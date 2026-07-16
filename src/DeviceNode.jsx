import {Position, Handle} from '@xyflow/react'
import './DeviceNode.css'

export default function DeviceNode (props){
    const device = props.data.device
    const handleFlowDisconnect = props.data.handleFlowDisconnect


    return (
        <div className="device-node">
            <h4> {device.label} </h4>
            {device.ports.map((p)=> {
                if(p.direction === "input"){
                    return (
                        <div className="port-row" key={p.key}>
                            <Handle 
                                id={p.id} 
                                key={p.key} 
                                type="target"
                                position={Position.Left}
                                onClick={()=>handleFlowDisconnect(p)}
                            />
                            <span>{p.label}</span>
                        </div>
                    )
                } else if(p.direction === "output"){
                    return (
                        <div className="port-row" key={p.key}>
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