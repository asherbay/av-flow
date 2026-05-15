export function canConnect(portA, portB) {

  if (portA.connectedTo) {
    return { isValid: false, reason: `${portA.label} port is already connected to ${portA.connectedTo.label}` }
  }
  
  if (portB.connectedTo) {
    return { isValid: false, reason: `${portB.label} port is already connected to ${portB.connectedTo.label}` }
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
