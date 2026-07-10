
export function createDeviceFromDefinition (definition, currentDevices) {
    let newPorts = definition.ports.map(
        (p)=> {
            return {
                id: crypto.randomUUID(), 
                key: p.key, 
                label: p.label, 
                portType: p.portType, 
                signal: p.signal, 
                direction: p.direction,
                flowRole: p.flowRole,
                connectedToPortId: null,
            }
        }
    )

    const currentDevicesOfSameType = currentDevices.filter((d)=>d.deviceType===definition.deviceType)
    const numCurrentDevicesOfSameType = currentDevicesOfSameType? currentDevicesOfSameType.length : 0

    console.log(`creating new ${definition.label} device`)
    return {
        id: crypto.randomUUID(),
        deviceType: definition.deviceType, 
        label: definition.label + " " + numCurrentDevicesOfSameType, 
        ports: newPorts,
        routing: definition.routing
    }
}