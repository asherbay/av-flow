import {canConnect} from './canConnect.js'
import {findPortRecord} from './findPortRecord.js'

export function connectPorts(devices, portAId, portBId) {

    let portA = findPortRecord(devices, portAId)?.port
    let portB = findPortRecord(devices, portBId)?.port

    if(!portA || !portB){
        return {isValid: false, reason: "One or both ports could not be found"}
    }

    let connectAttempt = canConnect(devices, portA, portB)
    if(connectAttempt.isValid){
        let updatedDevices = devices.map((d)=>{
            let updatedPorts = d.ports.map((p)=>{
                
                if(p.id === portAId){
                    return {...p, connectedToPortId: portBId}
                }
                if(p.id === portBId){
                    return {...p, connectedToPortId: portAId}
                }
                return p
            })
            return {...d, ports: updatedPorts}
        })
        

        // portAId.connectedTo = portBId
        // portBId.connectedTo = portAId
        // console.log(`Connecting ${sourcePort} to ${targetPort}`)
        return {...connectAttempt, devices: updatedDevices}
    } else {
        // console.error(`Cannot connect ${sourcePort} to ${targetPort}. Reason: ${connectAttempt.reason}`)
        return connectAttempt
    }
}