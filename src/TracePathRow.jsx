import {useState} from 'react'
import {findPortRecord} from './findPortRecord.js'

export default function TracePathRow(props){
    const pathResult = props.pathResult
    const devices = props.devices
    const expanded = props.expanded

    

    const portDevicePairsArray = pathResult.path.map((port)=> {
        const deviceRecord = findPortRecord(devices, port.id)
        if(!deviceRecord){
            return ["device record not found"]
        }
        const device = deviceRecord.device
        return [port.id, device]
    })
    // portDevicePairsArray.forEach((pdp)=>{
    //     console.log(pdp[0], pdp[1])
    // })

    
    const portDevicePairsObject = Object.fromEntries(portDevicePairsArray)
    
    function stringifyPathItem(port, path){
        const device = portDevicePairsObject[port.id]
        return `${device.label}: ${port.label}${path.at(-1).id!==port.id ? ` ${port.direction==="output" ? "→" : "↦"} ` : ""}`
    }
    

    return (
        <div className="trace-path-row">
            {/* <button className="expand-row-button" onClick={()=>{toggleExpandRow()}}>{expanded ? "▼" : "▶"}</button> */}
            {!expanded ? 
                    <span>
                        {stringifyPathItem(pathResult.origin, pathResult.path)} 
                        {stringifyPathItem(pathResult.path.at(-1), pathResult.path)} 
                    </span>
            :
                <span>
                    {pathResult.path.map((p)=> stringifyPathItem(p, pathResult.path))}
                </span>
                
               }
        </div>
    )
}