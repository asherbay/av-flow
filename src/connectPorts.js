import {canConnect} from './canConnect.js'

export function connect(sourcePort, targetPort) {
    let connectAttempt = canConnect(sourcePort, targetPort)
    if(connectAttempt.isValid){
        sourcePort.connectedTo = targetPort
        targetPort.connectedTo = sourcePort
        console.log(`Connecting ${sourcePort} to ${targetPort}`)
    } else {
        console.error(`Cannot connect ${sourcePort} to ${targetPort}. Reason: ${connectAttempt.reason}`)
    }
}