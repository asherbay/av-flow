import { useState, useEffect } from 'react'
import './App.css'
import {connectPorts} from './connectPorts.js'
import {createDeviceFromDefinition} from './createDeviceFromDefinition.js'
import {findPortRecord} from './findPortRecord.js'
import {deviceCatalog} from './deviceCatalog.js'
import {disconnectPort} from './disconnectPort.js'
import {traceSignalFlow} from './traceSignalFlow.js'

function App() {
  const [devices, setDevices] = useState([])
  const [selectedPort, setSelectedPort] = useState(null)
  const [userNotification, setUserNotification] = useState("")
  
  useEffect(() => {
 
  }, [])

  useEffect(() => {
    console.log('Devices updated:', devices);
  }, [devices.length])


  function addNewDevice(type){
    const newDevice = createDeviceFromDefinition(deviceCatalog.find((d)=>d.deviceType === type), devices)
    setDevices((devices)=> [...devices, newDevice])
  }


  function handleTraceSignalFlowClick(){
    const result = traceSignalFlow(devices)
    const returnedPathsString = result.pathResults.map((pathResult) => 
            pathResult.path.map((port)=> port.label).join(" -> ")
        ).join(", ")

    const reachedTerminalLabels = result.reachedTerminalIds.map((rtid)=>findPortRecord(devices, rtid).port.label)
    const unreachableTerminalLabels = result.unreachableTerminalIds.map((utid)=>findPortRecord(devices, utid).port.label)


    setUserNotification(`paths: ${returnedPathsString}, reachable terminal IDs: ${reachedTerminalLabels.join(', ')} unreachable terminal IDs: ${unreachableTerminalLabels.join(', ')}`)

  }

  function handleDisconnectPortClick(port){

    
    const result = disconnectPort(devices, port.id)

    if(!result.isValid){
      setUserNotification(result.reason)
      console.log(result.reason)
      return
    }

    const connectedPortRecord = result.disconnectedPortId
    ? findPortRecord(devices, result.disconnectedPortId)
    : null

    const connectedPort = connectedPortRecord?.port

    
      setDevices(result.devices)
      if(connectedPort){
        setUserNotification(`disconnected ${port.label} from ${connectedPort.label}`)
        console.log(`disconnected ${port.label} from ${connectedPort.label}`)
      } else {
        setUserNotification(`disconnected ${port.label}`)
      }
      
    
  }

  function handlePortClick(port){

    if(!selectedPort){
      setUserNotification("")
      setSelectedPort(port)
      return
    }

    if(selectedPort && selectedPort.id === port.id) { //user selects the same port twice
      setSelectedPort(null)
      return
    }

    const result = connectPorts(devices, selectedPort.id, port.id)

    if(result.isValid){
      setDevices(result.devices)
      setUserNotification(`connected ${selectedPort.label} to ${port.label}`)
      console.log(`connected ${selectedPort.label} to ${port.label}`)
    } else {
      setUserNotification(result.reason)
      console.error(result.reason)
    }

    setSelectedPort(null)
  }


  return (
    <>
      <div className="App">
          <h1>Device Connection Simulator</h1>
          <div>
            <h2>Add Devices:</h2>
            <ul>
            {deviceCatalog.map((d, index)=> 
              <li key={index}> 
              <button onClick={()=>{addNewDevice(d.deviceType)}}>{d.deviceType}</button>
              </li>
            )}
            </ul>
          </div>
          {devices.map((device) => (
            <div key={device.id} className="device">
              <h2>{device.label}</h2>
              <ul>
                {device.ports.map((port) => {
                  let connectedPortRecord = findPortRecord(devices, port.connectedToPortId)
                  return (<li key={port.id}>
                      {port.label} ({port.portType}, {port.direction})
                      <button onClick={() => {
                        handlePortClick(port)
                      }} style={{ color: '#000000', marginLeft: '10px', backgroundColor: (selectedPort && selectedPort.id === port.id) ? 'lightblue' : 'white' }}>
                        {selectedPort ? 'Connect' : 'Select'}
                      </button>
                      {port.connectedToPortId && (
                        <button onClick={() => {handleDisconnectPortClick(port)}}> Disconnect </button>
                      )}
                      {port.connectedToPortId && (
                        
                        <span> - Connected to {connectedPortRecord?.device.label}'s {connectedPortRecord?.port.label}</span>
                      )}
                    </li>
                    )
                })
                }
              </ul>
            </div>
          ))}
          <div >
            <button onClick={()=>{handleTraceSignalFlowClick()}}>Trace Signal Flow</button>
          </div>

          <div style={{border: "0.5px solid white"}}>
            {userNotification ? userNotification : ""}
          </div>
      </div>
    </>
  )
}

export default App
