export function findPortRecord(devices, portId){
    for(const device of devices){
        const port = device.port.find((p)=> p.id === portId)

        if(port){
            return {device, port}
        }
    }
    return null
}