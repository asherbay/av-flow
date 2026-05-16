import { useState, useEffect } from 'react'
import './App.css'
import {connectPorts} from './connectPorts.js'
import {createDeviceFromDefinition} from './createDeviceFromDefinition.js'
import {findPortRecord} from './findPortRecord.js'
import {deviceCatalog} from './deviceCatalog.js'

function App() {
  const [devices, setDevices] = useState([])
  const [selectedPort, setSelectedPort] = useState(null)
  // const [secondSelectedPort, setSecondSelectedPort] = useState(null)
  
  useEffect(() => {
    setDevices([
      createDeviceFromDefinition(deviceCatalog.find((d)=>d.deviceType === "Laptop")),
      createDeviceFromDefinition(deviceCatalog.find((d)=>d.deviceType === "Projector"))
    ]);
  }, [])

  useEffect(() => {
    console.log('Devices updated:', devices);
  }, [devices.length])


 


  function handlePortClick(port){

    if(!selectedPort){
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
      console.log(`connected ${selectedPort.label} to ${port.label}`)
    } else {
      console.error(result.reason)
    }

    setSelectedPort(null)
  }


  return (
    <>
      <div className="App">
          <h1>Device Connection Simulator</h1>
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
                      }} style={{ marginLeft: '10px', backgroundColor: (selectedPort && selectedPort.id === port.id) ? 'lightblue' : 'white' }}>
                        {selectedPort ? 'Connect' : 'Select'}
                      </button>
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
      </div>
    </>
  )
}

export default App
