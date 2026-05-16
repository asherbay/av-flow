
export function createDeviceFromDefinition (definition) {
    let newPorts = definition.ports.map(
        (p)=> {
            return {
                id: crypto.randomUUID(), 
                key: p.key, 
                label: p.label, 
                portType: p.portType, 
                signal: p.signal, 
                direction: p.direction,
                connectedToPortId: null,
            }
        }
    )

    console.log(`creating new ${definition.label} device`)
    return {
        id: crypto.randomUUID(),
        deviceType: definition.deviceType, 
        label: definition.label, 
        ports: newPorts
    }
}