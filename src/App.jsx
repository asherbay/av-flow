import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [devices, setDevices] = useState([])
  const [connectMode, setConnectMode] = useState(false)
  const [selectedSourcePort, setSelectedSourcePort] = useState(null)
  const [selectedTargetPort, setSelectedTargetPort] = useState(null)
  
  useEffect(() => {
    setDevices([
      new Device(laptopDefinition.type, laptopDefinition.label, laptopDefinition.ports),
      new Device(projectorDefinition.type, projectorDefinition.label, projectorDefinition.ports)
    ]);
  }, [])

  useEffect(() => {
    console.log('Devices updated:', devices);
  }, [devices.length])


   useEffect(() => {
    if(selectedSourcePort && selectedTargetPort) {
      selectedSourcePort.connect(selectedTargetPort);
      setDevices([...devices]) // Trigger re-render to show updated connections
      setSelectedSourcePort(null)
      setSelectedTargetPort(null)
      setConnectMode(false)
    }
  }, [selectedSourcePort, selectedTargetPort])

  const portTypes = ['HDMI', 'USB', 'XLR', '1/8" TRS']

  // class Port {
  //   constructor(key, label, type, signal, direction, quantity) { //ie. "HDMI", "input"
  //     this.id = crypto.randomUUID();
  //     this.key = key;
  //     this.label = label;
  //     this.type = type;
  //     this.signal = signal;
  //     this.direction = direction;
  //     this.quantity = quantity;
  //     this.connectedTo = null;
  //     this.device = null;
  //   }
  //   connect(targetPort) {
  //     if(this.direction != targetPort.direction) { // Ensure one is input and the other is output
  //       if(this.type === targetPort.type) { // Ensure port types match
  //         this.connectedTo = targetPort;
  //         targetPort.connectedTo = this;
  //         console.log(`Connecting ${this.type} port to ${targetPort.type} port`);
  //       } else {
  //         console.error(`Cannot connect ${this.type} port to ${targetPort.type} port: incompatible types`);
  //       }
  //     } else {
  //       console.error(`Cannot connect ${this.direction} port to another ${targetPort.direction} port`);
  //     }
  //   }
  // }

  // class Device {
  //   constructor(type, label, ports = []) {
  //     this.id = crypto.randomUUID();
  //     this.type = type;
  //     this.label = label;
  //     this.ports = ports;
  //     this.ports.forEach((port) => {
  //       port.device = this
  //     })
  //   }
  // } 

  // const laptopDefinition = {
  //   type: 'Laptop',
  //   label: 'Laptop',
  //   ports: [
  //     new Port('hdmi-out', 'HDMI Out', 'HDMI', 'video', 'output', 1),
  //     new Port('headphone-out', 'Headphone Out', '1/8" TRS', 'audio', 'output', 1),
  //   ]
  // }

  // const projectorDefinition = {
  //   type: 'Projector',
  //   label: 'Projector',
  //   ports: [
  //     new Port('hdmi-in', 'HDMI In', 'HDMI', 'video', 'input', 1),
  //   ]
  // }





  return (
    <>
      <div className="App">
          <h1>Device Connection Simulator</h1>
          {devices.map((device) => (
            <div key={device.id} className="device">
              <h2>{device.label}</h2>
              <ul>
                {device.ports.map((port) => (
                  <li key={port.id}>
                    {port.label} ({port.type}, {port.direction})
                    <button onClick={() => {
                      if(connectMode) {
                        if(selectedSourcePort && selectedSourcePort.id === port.id) {
                          setSelectedSourcePort(null)
                        } else if(selectedTargetPort && selectedTargetPort.id === port.id) {
                          setSelectedTargetPort(null)
                        } else if(!selectedSourcePort) {
                          setSelectedSourcePort(port)
                        } else if(!selectedTargetPort) {
                          setSelectedTargetPort(port)
                        }
                      } else {
                        setConnectMode(true)
                        setSelectedSourcePort(port)
                      }
                    }} style={{ marginLeft: '10px', backgroundColor: (selectedSourcePort && selectedSourcePort.id === port.id) || (selectedTargetPort && selectedTargetPort.id === port.id) ? 'lightblue' : 'white' }}>
                      {connectMode ? 'Select' : 'Connect'}
                    </button>
                    {port.connectedTo && (
                      <span> - Connected to {port.connectedTo.device.label}'s {port.connectedTo.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </>
  )
}

export default App
