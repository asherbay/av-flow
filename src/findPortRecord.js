export function findPortRecord(devices, portId){
    for(const device of devices){
        const port = device.ports.find((p)=> p.id === portId)

        if(port){
            return {device, port}
        }
    }
    return null
}