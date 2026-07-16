import { useState, useEffect } from 'react'
import './App.css'
import {connectPorts} from './connectPorts.js'
import {createDeviceFromDefinition} from './createDeviceFromDefinition.js'
import {findPortRecord} from './findPortRecord.js'
import {deviceCatalog} from './deviceCatalog.js'
import {disconnectPort} from './disconnectPort.js'
import {traceSignalFlow} from './traceSignalFlow.js'
import FlowCanvas from './FlowCanvas.jsx'

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
            pathResult.path.map((port)=> {
              const portDeviceRecord = findPortRecord(devices, port.id)
              const portDevice = portDeviceRecord? portDeviceRecord.device : null
        
              return `${port.label}` + (portDevice? ` (${portDevice.label})` : '')
            }
            ).join(" -> ")
        ).join(", ")

    const reachedTerminalLabels = result.reachedTerminalIds.map((rtid)=>findPortRecord(devices, rtid).port.label)
    const unreachableTerminalLabels = result.unreachableTerminalIds.map((utid)=>findPortRecord(devices, utid).port.label)


    setUserNotification(`paths: ${returnedPathsString}, reachable terminal IDs: ${reachedTerminalLabels.join(', ')} unreachable terminal IDs: ${unreachableTerminalLabels.join(', ')}`)

  }

  function handleDisconnectPortClick(port){
    console.log("handleDisconnectPortClick called")
    
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

  function handleFlowConnect(connection){
    const sourcePortId = connection.sourceHandle
    const targetPortId = connection.targetHandle

    if(!sourcePortId || !targetPortId){
      return
    }

    const result = connectPorts(devices, sourcePortId, targetPortId)

    if(result.isValid){

      const sourcePortRecord = findPortRecord(devices, sourcePortId)
      const targetPortRecord = findPortRecord(devices, targetPortId)
      setDevices(result.devices)

      setUserNotification(`connected ${sourcePortRecord ? sourcePortRecord.port.label : "--port record not found--"} to ${targetPortRecord ? targetPortRecord.port.label : "--port record not found--"}`)
    } else {
      setUserNotification(result.reason)
      console.error(result.reason)
    }


  }

  function handleNodeDragStop(event, node) {

    console.log("drag stop")
    const { x, y } = node.position

    const device = devices.find((d)=>d.id===node.id)

    const updatedDevices = devices.map((d)=>{

      if(d.id===device.id){
        return {...d, position: {x, y}}
      }

      return {...d}

    })

    setDevices(updatedDevices)

  }


  // function handleFlowDisconnect(connection){
  //   const portRecord = findPortRecord(devices, connection)

  // }


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
          
          <div >
            <button onClick={()=>{handleTraceSignalFlowClick()}}>Trace Signal Flow</button>
          </div>

          <div style={{border: "0.5px solid white"}}>
            {userNotification ? userNotification : ""}
          </div>
          <FlowCanvas devices={devices} handleNodeDragStop={handleNodeDragStop} handleFlowConnect={handleFlowConnect} handleFlowDisconnect={handleDisconnectPortClick}/>
      </div>
    </>
  )
}

export default App
