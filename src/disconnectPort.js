import {findPortRecord} from './findPortRecord.js'

export function disconnectPort(devices, portAId) {

    const portARecord = findPortRecord(devices, portAId)
    const portA = portARecord ? portARecord.port : null

    if(!portA){
        return {isValid: false, reason: "Starting port could not be found"}
    }

    if(!portA.connectedToPortId){
        console.log("portA connected: ", portA.connectedToPortId)
        return {isValid: false, reason: "Port is not currently connected"}
    }

    const portBRecord = findPortRecord(devices, portA.connectedToPortId)
    const portB = portBRecord ? portBRecord.port : null

    if(!portB){
        return {isValid: false, reason: "Connected port could not be found"}
    }


    let updatedDevices = devices.map((d)=>{
            let updatedPorts = d.ports.map((p)=>{
                
                if(p.id === portAId){
                    return {...p, connectedToPortId: null}
                }
                if(p.id === portB.id){
                    return {...p, connectedToPortId: null}
                }
                return p
            })
            return {...d, ports: updatedPorts}
        })
    
        return {isValid: true, reason: '', devices: updatedDevices, disconnectedPortId: portB.id}
}