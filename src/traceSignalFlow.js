import {findPortRecord} from './findPortRecord.js'

export function traceSignalFlow (devices) {

    

    const originPorts = devices
    .flatMap((device) => device.ports)
    .filter((port) => port.flowRole === 'origin')

    const result = {
        origins: originPorts,
        pathResults: [],
        reachedTerminalIds: [],
        unreachableTerminalIds: [],
    }

    function tracePath (originPort){
        const startingPath = [originPort]
        const startingVisitedPortIds = []

        

        function getNextConnectedPort(currentPort, currentPath, visitedPortIds){

            if(visitedPortIds.includes(currentPort.id)){
                return [{origin: currentPath[0], status: 'failure', path: currentPath, terminal: null, reason: 'circular path'}]
            }

            if(currentPort.direction === 'output'){
                const connectedPortRecord = currentPort.connectedToPortId? findPortRecord(devices, currentPort.connectedToPortId) : null
                const connectedPort = connectedPortRecord? connectedPortRecord.port : null


                
                if(connectedPort){
                    return getNextConnectedPort(connectedPort, [...currentPath, connectedPort], [...visitedPortIds, currentPort.id])
                } 
                if(currentPort.connectedToPortId && !connectedPort) {
                    return [{origin: currentPath[0], status: 'failure', path: currentPath, terminal: null, reason: `could not find connected port ${currentPort.connectedToPortId} from ${currentPort.label}`}]
                }
            
            } else if(currentPort.direction === 'input'){
                if(currentPort.flowRole === 'terminate'){
                    return [{origin: currentPath[0], status: 'success', path: currentPath, terminal: currentPort, reason: ''}]
                }

                const portDeviceRecord = findPortRecord(devices, currentPort.id)
                const portDevice = portDeviceRecord? portDeviceRecord.device : null

                if(portDevice){
                    const destinationPortKeys = portDevice.routing[currentPort.key] ? portDevice.routing[currentPort.key] : null
                    const destinationPorts = destinationPortKeys ? destinationPortKeys.map((dpk)=>
                        portDevice.ports.find((p)=>p.key === dpk)
                    ) : null
                    if(destinationPorts){
                        
                        let branchResults = []

                        destinationPorts.forEach((destinationPort) => {
                            const nextPath = [...currentPath, destinationPort]
                            const nextVisited = [...visitedPortIds, currentPort.id]

                            const branchPathResults = getNextConnectedPort(
                                destinationPort,
                                nextPath,
                                nextVisited
                            )

                            branchResults = [...branchResults, ...branchPathResults]
                        })

                        return branchResults
                    }
                    
                }
                
            }
            return [{origin: currentPath[0], status: 'failure', path: currentPath, terminal: null, reason: 'broken path'}]
        }

        if(originPort.flowRole !== 'origin'){
            return 
        }
        const pathResult = getNextConnectedPort(originPort, startingPath, startingVisitedPortIds)

        return pathResult
    }

 
        result.pathResults = originPorts.flatMap((op)=>tracePath(op))

        const successfulPaths = result.pathResults.filter((pr)=>pr.status=== 'success')
        result.reachedTerminalIds = [...new Set(successfulPaths.map((sp)=>sp.terminal.id))]
      

        const allTerminalPorts = devices.flatMap((d)=>{
            return d.ports.filter((p)=>p.flowRole==='terminate')
        })


        const unreachableTerminals = allTerminalPorts.filter((tp)=> !result.reachedTerminalIds.includes(tp.id))
        result.unreachableTerminalIds = unreachableTerminals.map((ut)=> ut.id)

//   originPorts.forEach((op)=>{
//     const pathsFromOrigin = tracePath(op)
//     pathsFromOrigin.forEach((pfo)=>{
//         const lastPort = pfo.at(-1)
//         const lastPortRecord = findPortRecord(devices, lastPort.id)
//         const lastPortDevice = lastPortRecord ? lastPortRecord.device : null
//         const status = lastPort.flowRole === 'terminate' ? 'success' : 'failure'
//         if(status === 'success'){
//             result.reachedTerminals.push(lastPort)
//         }
//         result.pathResults.push({
//             origin: op, 
//             status: status,
//             path: pfo, 
//             terminal: status === 'success' ? lastPort : null, 
//             reason: status === 'failure' ? `signal from ${op.label} terminated at ${lastPort.label} on ${lastPortDevice.label} and failed to reach a terminal device` : '',
//         })
//     })
//   })

//   const allTerminalPorts = devices.flatMap((d)=>{
//     return d.ports.filter((p)=>p.flowRole==='terminate')
//   })

//   const allReachedPorts = result.pathResults.flatMap((pr)=>pr.path)
//   const allReachedTerminalPorts = allReachedPorts.filter((p)=>p.flowRole==='terminate')
//   const allReachedTerminalPortIds = [...new Set(allReachedTerminalPorts.map((p)=>p.id))] //removed duplicates

//   result.unreachableTerminals = allTerminalPorts.filter((tp)=>
//     !allReachedTerminalPortIds.includes(tp.id)
//   )

  return result
}


