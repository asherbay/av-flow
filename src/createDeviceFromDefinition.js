import { Device } from './Device.js'
import { Port } from './Port.js'

export function createDeviceFromDefinition (definition) {
    let newPorts = definition.ports.map(
        (p)=> new Port({
            id: crypto.randomUUID(), 
            key: p.key, 
            label: p.label, 
            portType: p.portType, 
            signal: p.signal, 
            direction: p.direction
        })
    )
    console.log(`creating new ${definition.label} device`)
    return new Device({
        deviceType: definition.deviceType, 
        label: definition.label, 
        ports: newPorts
    })
}