import { Position, Handle } from '@xyflow/react'
import SwitcherOutputSelector from './SwitcherOutputSelector.jsx'
import './DeviceNode.css'

export default function DeviceNode({ data }) {
  const { device, devices, updateDevices, handleFlowDisconnect, deleteDevice, selectionData } = data

  return (
    <div className={`device-node ${selectionData.isSelected ? 'selected' : 'not-selected'} ${selectionData.status ?? ''} ${selectionData.isHovered ? 'hovered' : 'not-hovered'}`}>
      <div className="device-node-header">
        <span className="device-node-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 9h10M7 13h4M15 13h2" />
          </svg>
        </span>
        <div className="device-node-heading">
          <h3 className="device-node-label">{device.label}</h3>
          <span className="device-node-port-count">
            {device.ports.length} {device.ports.length === 1 ? 'port' : 'ports'}
          </span>
        </div>
        <button
          type="button"
          className="device-node-delete nodrag nopan"
          aria-label={`Delete ${device.label}`}
          title={`Delete ${device.label}`}
          onClick={() => deleteDevice(device)}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
      <div className="device-node-ports">
        {device.ports.map((port) => {
          const isInput = port.direction === 'input'
          const isConnected = Boolean(port.connectedToPortId)
          const isSelected = selectionData.selectedPortIdsOnDevice.includes(port.id)
          const isHovered = selectionData.hoveredPortIdOnDevice === port.id

          return (
            <div className={`port-row ${port.direction}`} key={port.key}>
              <span className="port-label">{port.label}</span>
              <span className="port-type">{port.portType}</span>
              {
                (device.deviceType.includes("Video Switcher") && !isInput) && 
                <SwitcherOutputSelector device={device} output={port} devices={devices} updateDevices={updateDevices}/>
               }
              <Handle
                id={port.id}
                type={isInput ? 'target' : 'source'}
                position={isInput ? Position.Left : Position.Right}
                title={`${port.label} (${port.portType}, ${port.direction})${isConnected ? ' - click to disconnect' : ' - drag to connect'}`}
                onClick={() => handleFlowDisconnect(port)}
                className={`port-handle ${isConnected ? 'connected' : 'unconnected'} ${isSelected ? `selected ${selectionData.status}` : 'not-selected'} ${isHovered ? 'hovered' : 'not-hovered'}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
