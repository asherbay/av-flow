import {Position, Handle} from '@xyflow/react'
import './DeviceNode.css'

export default function DeviceNode (props){
    const device = props.data.device
    const handleFlowDisconnect = props.data.handleFlowDisconnect
    const deleteDevice = props.data.deleteDevice


    return (
        <div className="device-node">
            <div className="top-row">
                <span> {device.label} </span>
                <button className="delete-button" onClick={()=>deleteDevice(props.data.device)}>X</button>
            </div>
            {device.ports.map((p)=> {
                if(p.direction === "input"){
                    return (
                        <div className={`port-row input`} key={p.key}>
                            <Handle 
                                id={p.id} 
                                key={p.key} 
                                type="target"
                                position={Position.Left}
                                onClick={()=>handleFlowDisconnect(p)}
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
                            />
                        </div>
                    )
                }
            })}
        </div>
    )
}