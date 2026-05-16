import {findPortRecord} from './findPortRecord.js'
export function canConnect(devices, portA, portB) {
    

  if (portA.connectedToPortId) {
    let portAConnectedPortRecord = findPortRecord(devices, portA.connectedToPortId)
    if(!portAConnectedPortRecord){ //null guard
        return {isValid: false, reason: `Port connected to ${portA.label} cannot be found`}
    }
    return { isValid: false, reason: `${portA.label} port is already connected to ${portAConnectedPortRecord.port.label}` }
  }
  
  if (portB.connectedToPortId) {
    let portBConnectedPortRecord = findPortRecord(devices, portB.connectedToPortId)
    if(!portBConnectedPortRecord){ //null guard
        return {isValid: false, reason: `Port connected to ${portB.label} cannot be found`}
    }

    return { isValid: false, reason: `${portB.label} port is already connected to ${portBConnectedPortRecord.port.label}` }
  }

  if (portA.direction === portB.direction) {
    return { isValid: false, reason: 'port directions are the same' }
  }

  const outputPort = portA.direction === 'output' ? portA : portB
  const inputPort = portA.direction === 'input' ? portA : portB

  if (outputPort.signal !== inputPort.signal) {
    return { isValid: false, reason: 'signal types do not match' }
  }

  if (outputPort.portType !== inputPort.portType) {
    return { isValid: false, reason: 'port types do not match' }
  }

  return { isValid: true, reason: '' }
}
