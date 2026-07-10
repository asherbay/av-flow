
let portCount = 0
let deviceCount = 0
export function makePort(overrides = {}){
    portCount += 1
    return {
        id: overrides.id ?? crypto.randomUUID(),
        key: overrides.key ?? `port-${portCount}`,
        label: overrides.label ?? `Test Port ${portCount}`,
        portType: overrides.portType ?? 'HDMI',
        signal: overrides.signal ?? 'video',
        direction: overrides.direction ?? 'output',
        flowRole: overrides.flowRole ?? 'origin',
        connectedToPortId: overrides.connectedToPortId ?? null,
    }
}


export function makeDevices(...portsByDevice){
    return portsByDevice.map((ports)=>{
        deviceCount += 1
        return {
            id: `device-${deviceCount}`,
            deviceType: 'Test Device',
            label: `Device ${deviceCount}`,
            ports,
        }
    })
}

export function makeDevice({ports, routing, ...overrides}){
    deviceCount += 1
    return {
        id: `device-${deviceCount}`,
        deviceType: overrides.deviceType ?? 'Test Device',
        label: overrides.label ?? `Device ${deviceCount}`,
        routing,
        ports,
    }
}