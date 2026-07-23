import {Position, Handle} from '@xyflow/react'
import './DeviceNode.css'

export default function DeviceNode (props){
    const device = props.data.device
    const handleFlowDisconnect = props.data.handleFlowDisconnect
    const deleteDevice = props.data.deleteDevice
    const selectionData = props.data.selectionData


    //make a selection object {isSelected: true, status: "success/failure", selectedPortIds: [], isHighlighted: true, highlightedPortIds: []}
    return (
        <div className={`device-node ${selectionData.isSelected ? "selected" : "not-selected"} ${selectionData.status ? selectionData.status : ""} ${selectionData.isHovered ? "hovered" : "not-hovered"}`}>
            <div className="top-row">
                <span> {device.label} </span>
                <button className="delete-button" onClick={()=>deleteDevice(props.data.device)}>X</button>
            </div>
            {device.ports.map((p)=> {
                const isSelectedPort = selectionData.selectedPortIdsOnDevice.includes(p.id)
                const isHoveredPort = selectionData.hoveredPortIdOnDevice === p.id

                if(p.direction === "input"){
                    return (
                        <div className={`port-row input`} key={p.key}>
                            <Handle 
                                id={p.id} 
                                key={p.key} 
                                type="target"
                                position={Position.Left}
                                onClick={()=>handleFlowDisconnect(p)}
                                className={`port-handle ${isSelectedPort ? `selected ${selectionData.status}` :  "not-selected"} ${isHoveredPort ? "hovered" : "not-hovered"}`}
                            />
                            <span className={`port-label`}>{p.label}</span>
                        </div>
                    )
                } else if(p.direction === "output"){
                    return (
                        <div className={`port-row output`} key={p.key}>
                            <span>{p.label}</span>
                            <Handle 
                                id={p.id} 
                                key={p.key} 
                                type="source"
                                position={Position.Right}
                                onClick={()=>handleFlowDisconnect(p)}
                                className={`port-handle ${isSelectedPort ? `selected ${selectionData.status}` :  "not-selected"} ${isHoveredPort ? "hovered" : "not-hovered"}`}
                            />
                        </div>
                    )
                }
            })}
        </div>
    )
}