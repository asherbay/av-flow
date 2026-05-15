import {canConnect} from './canConnect.js'
import {findPortRecord} from './findPortRecord.js'

export function connectPorts(devices, portAId, portBId) {

    let portA = findPortRecord(devices, portAId)
    let portB = findPortRecord(devices, portBId)

    let connectAttempt = canConnect(portA, portB)
    if(connectAttempt.isValid){
        let updatedDevices = devices.map((d)=>{
            let updatedPorts = d.ports.map((p)=>{
                
                if(p.id === portAId){
                    p.connectedToPortId = portBId
                }
                if(p.id === portBId){
                    p.connectedToPortId = portAId
                }
                return {}
            })
            return {id: d.id, deviceType: d.deviceType, label: d.label, ports: updatedPorts}
        })
        

        // portAId.connectedTo = portBId
        // portBId.connectedTo = portAId
        // console.log(`Connecting ${sourcePort} to ${targetPort}`)
        return { isValid: connectAttempt.isValid, reason: connectAttempt.reason, devices: updatedDevices}
    } else {
        // console.error(`Cannot connect ${sourcePort} to ${targetPort}. Reason: ${connectAttempt.reason}`)
        return connectAttempt
    }
}