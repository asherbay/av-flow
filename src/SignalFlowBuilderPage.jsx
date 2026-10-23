import PanelLayout from './PanelLayout.jsx'
import { useState } from 'react'
import {connectPorts} from './connectPorts.js'
import {createDeviceFromDefinition} from './createDeviceFromDefinition.js'
import {findPortRecord} from './findPortRecord.js'
import {deviceCatalog} from './deviceCatalog.js'
import {disconnectPort} from './disconnectPort.js'
import {traceSignalFlow} from './traceSignalFlow.js'
import DevicePalettePanel from './DevicePalettePanel.jsx'
import FlowPanel from './FlowPanel.jsx'
import TraceReportPanel from './TraceReportPanel.jsx'

function SignalFlowBuilderPage() {

  const [devices, setDevices] = useState([])
  const [userNotification, setUserNotification] = useState("")
  const [traceReport, setTraceReport] = useState(null)

  const [selectedPath, setSelectedPath] = useState("")
  const [hoveredTraceItem, setHoveredTraceItem] = useState(null)

  function addNewDevice(type){
    const newDevice = createDeviceFromDefinition(deviceCatalog.find((d)=>d.deviceType === type), devices)
    setDevices((devices)=> [...devices, newDevice])
  }
  function handleTraceSignalFlowClick(){
    const result = traceSignalFlow(devices)
    setSelectedPath("")
    setHoveredTraceItem(null)
    setTraceReport(result)
  }

  function closeTraceReport(){
    setTraceReport(null)
    setSelectedPath("")
    setHoveredTraceItem(null)
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
      closeTraceReport()
      if(connectedPort){
        setUserNotification(`disconnected ${port.label} from ${connectedPort.label}`)
        console.log(`disconnected ${port.label} from ${connectedPort.label}`)
      } else {
        setUserNotification(`disconnected ${port.label}`)
      }
      
    
  }

  function handleDeleteDevice(device){
      closeTraceReport()
      setSelectedPath("")

      setDevices((currentDevices)=>{
        const deviceToDelete = currentDevices.find((d)=>d.id===device.id)

        if(!deviceToDelete){
          return currentDevices
        }

        let updatedDevices = currentDevices

        for(const port of deviceToDelete.ports){
          const currentPortRecord = findPortRecord(updatedDevices, port.id)
          const currentPort = currentPortRecord?.port

          if(!currentPort?.connectedToPortId){
            continue
          }
          
          const result = disconnectPort(updatedDevices, port.id)

          if(result.isValid){
            updatedDevices = result.devices
          }

        }
        return updatedDevices.filter((d)=>d.id!==device.id)
      })
    setUserNotification(`deleted ${device.label}`)
    console.log(`deleted ${device.label}`)
  }

  function updateDevices(updatedDevice){
    const updatedDevices = devices.map((d)=>d.id === updatedDevice.id ? updatedDevice : d)
    closeTraceReport()
    setDevices(updatedDevices)
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
      closeTraceReport()
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
  return (
    <main className="builder-page">
      <div className="builder-workspace">
        <header className="workspace-header">
          <div className="workspace-brand">
            <span className="workspace-mark" aria-hidden="true">AV</span>
            <div>
              <h1>AV Flow</h1>
              <p>Signal flow workspace</p>
            </div>
          </div>
          <button
            className="analyze-button"
            onClick={handleTraceSignalFlowClick}
            disabled={devices.length === 0}
          >
            Analyze
          </button>
        </header>
        <PanelLayout>
          <DevicePalettePanel
            devices={devices}
            deviceCatalog={deviceCatalog}
            addNewDevice={addNewDevice}
          />
          <FlowPanel
            devices={devices}
            updateDevices={updateDevices}
            handleDeleteDevice={handleDeleteDevice}
            handleNodeDragStop={handleNodeDragStop}
            handleFlowConnect={handleFlowConnect}
            handleFlowDisconnect={handleDisconnectPortClick}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            traceReport={traceReport}
            hoveredTraceItem={hoveredTraceItem}
            setHoveredTraceItem={setHoveredTraceItem}
            userNotification={userNotification}
          />
          <TraceReportPanel
            devices={devices}
            traceReport={traceReport}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            hoveredTraceItem={hoveredTraceItem}
            setHoveredTraceItem={setHoveredTraceItem}
            closeTraceReport={closeTraceReport}
          />
        </PanelLayout>
      </div>
    </main>
  )
}

export default SignalFlowBuilderPage
