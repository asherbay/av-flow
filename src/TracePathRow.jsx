import {useState} from 'react'
import {findPortRecord} from './findPortRecord.js'
import {TracePathItem} from './TracePathItem.jsx'

export default function TracePathRow(props){
    const pathResult = props.pathResult
    const devices = props.devices
    const expanded = props.expanded
    const hoveredTraceItem = props.hoveredTraceItem
    const setHoveredTraceItem = props.setHoveredTraceItem

    

    const portDevicePairsArray = pathResult.path.map((port)=> {
        const deviceRecord = findPortRecord(devices, port.id)
        if(!deviceRecord){
            return [port.id, null]
        }
        const device = deviceRecord.device
        return [port.id, device]
    })
    // portDevicePairsArray.forEach((pdp)=>{
    //     console.log(pdp[0], pdp[1])
    // })

    
    const portDevicePairsObject = Object.fromEntries(portDevicePairsArray)
    
    // function stringifyPathItem(port, path){
    //     const device = portDevicePairsObject[port.id]
    //     if(!device){
    //         return
    //     }
    //     return `${device.label}: ${port.label}${path.at(-1).id!==port.id ? ` ${port.direction==="output" ? "→" : "↦"} ` : ""}`
    // }

    function portDevicePathItemPair(port, path){
        const device = portDevicePairsObject[port.id]
        const portIsHovered = hoveredTraceItem ? hoveredTraceItem.id === port.id : false
        const deviceIsHovered = hoveredTraceItem ? hoveredTraceItem.id === device.id : false
        if(!device){
            return
        }
        return (
            <span key={port.id}>
                <TracePathItem type={"device"} item={device} path={path} isHovered={deviceIsHovered} setHoveredTraceItem={setHoveredTraceItem}/>
                <TracePathItem type={"port"} item={port} path={path} isHovered={portIsHovered} setHoveredTraceItem={setHoveredTraceItem}/>
            </span>
        )
        // return `${device.label}: ${port.label}${path.at(-1).id!==port.id ? ` ${port.direction==="output" ? "→" : "↦"} ` : ""}`
    }
    
    

    return (
        <div className="trace-path-row">
            {/* <button className="expand-row-button" onClick={()=>{toggleExpandRow()}}>{expanded ? "▼" : "▶"}</button> */}
            {!expanded ? 
                    <span>
                        {portDevicePathItemPair(pathResult.origin, pathResult.path)} 
                        {portDevicePathItemPair(pathResult.path.at(-1), pathResult.path)} 
                    </span>
            :
                <span>
                    {pathResult.path.map((p)=> portDevicePathItemPair(p, pathResult.path))}
                </span>
                
               }
        </div>
    )
}