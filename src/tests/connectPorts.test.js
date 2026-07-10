import {describe, expect, test} from 'vitest'
import {makePort, makeDevices} from './testFactories.js'
import {connectPorts} from '../connectPorts.js'
import {findPortRecord} from '../findPortRecord.js'

describe('connectPorts', ()=>{
    test('returns invalid if one or both port IDs do not exist', ()=>{
        const portA = makePort({id: "port-a"})
        const portB = makePort({id: "port-b"})

        const devices = makeDevices([portA], [portB])

        const result = connectPorts(devices, 'port-a', 'port-c')

        expect(result.isValid).toBe(false)
        expect(result.reason).toBe("One or both ports could not be found")
    })

    test('returns valid and updated devices for a compatible connection', ()=>{
        const portA = makePort({id: "port-a", direction: "output"})
        const portB = makePort({id: "port-b", direction: "input"}) 

        const devices = makeDevices([portA], [portB])

        const result = connectPorts(devices, "port-a", "port-b")

        expect(result.isValid).toBe(true)
        expect(result.reason).toBe('')

        expect(result.devices).toBeDefined()
        expect(Array.isArray(result.devices)).toBe(true)
        expect(result.devices.length).toBe(devices.length)

        expect(result.devices).not.toBe(devices)

        devices.forEach((d, index)=>{
            expect(d).not.toBe(result.devices[index])
        })


        const updatedPortA = findPortRecord(result.devices, 'port-a').port
        const updatedPortB = findPortRecord(result.devices, 'port-b').port

        expect(updatedPortA.connectedToPortId).toBe("port-b")
        expect(updatedPortB.connectedToPortId).toBe("port-a")
        expect(updatedPortA).not.toBe(portA)
        expect(updatedPortB).not.toBe(portB)

    })

    test('rejects connection if one or both ports are already connected', ()=>{
        const portA = makePort({id: "port-a", direction: "output", connectedToPortId: "port-c"})
        const portB = makePort({id: "port-b", direction: "input"}) 
        const portC = makePort({id: "port-c", direction: "input", connectedToPortId: "port-a"}) 

        const devices = makeDevices([portA], [portB], [portC])

        const result = connectPorts(devices, "port-a", "port-b")

        expect(result.isValid).toBe(false)
        expect(result.reason).toContain("already connected to")
    })

    test('does not mutate original devices array input', ()=>{
        const portA = makePort({id: "port-a", direction: "output"})
        const portB = makePort({id: "port-b", direction: "input"}) 

        const devices = makeDevices([portA], [portB])

        connectPorts(devices, "port-a", "port-b")

        expect(portA.connectedToPortId).toBeNull()
        expect(portB.connectedToPortId).toBeNull()

    })

    test('unrelated ports remain unchanged', ()=>{
        const portA = makePort({id: "port-a", direction: "output"})
        const portB = makePort({id: "port-b", direction: "input"}) 
        const portC = makePort({id: "port-c", direction: "input"})
        const portD = makePort({id: "port-d", direction: "input"})  

        const devices = makeDevices([portA], [portB, portC, portD])

        const result = connectPorts(devices, "port-a", "port-b")

        result.devices.forEach((d)=>{
            d.ports.forEach((p)=>{
                if(p.id !== "port-a" && p.id !== "port-b"){
                    const originalPort = findPortRecord(devices, p.id).port
                    expect(p).toBe(originalPort)
                }
            })
        })
    })
})