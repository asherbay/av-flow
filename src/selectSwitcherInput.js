import React from 'react'

export function selectSwitcherInput (devices, device, input, output) {
    // let updatedRoute = Object.hasOwn(device.routing, input.key) ? [...device.routing[input.key], output.key] : [output.key]
    let updatedRouting = device.routing
    Object.keys(updatedRouting).forEach((route)=>{
        if(updatedRouting[route].includes(output.key)){
            updatedRouting[route] = updatedRouting[route].filter((op)=>op !== output.key)
        }
    })

    let updatedDevice = {...device, routing: {...updatedRouting, [input.key]: [output.key]}}
    console.log("updatedDevice routing:", updatedDevice.routing)
    // let updatedDevices = devices.map((d)=>
    //     d.id === device.id ? updatedDevice : d
    // )
  return updatedDevice
}

