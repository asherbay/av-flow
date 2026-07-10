import {describe, expect, test} from 'vitest'
import {makePort, makeDevice} from './testFactories.js'
import {traceSignalFlow} from '../traceSignalFlow.js'


describe("traceSignalFlow", ()=>{
    test("returns a failed path result when routing is circular", ()=>{
        const deviceAInPort = makePort({direction: "input", key: "device-a-in", id: "device-a-in", flowRole: "pass-through", connectedToPortId: "device-b-out"})
        const deviceAOutPort = makePort({direction: "output", key: "device-a-out", id: "device-a-out", flowRole: "origin", connectedToPortId: "device-b-in"})

        const deviceBInPort = makePort({direction: "input", key: "device-b-in", id: "device-b-in", flowRole: "pass-through", connectedToPortId: "device-a-out"})
        const deviceBOutPort = makePort({direction: "output", key: "device-b-out", id: "device-b-out", flowRole: "pass-through", connectedToPortId: "device-a-in"})

        const deviceA = makeDevice({ports: [deviceAInPort, deviceAOutPort], routing: {'device-a-in': ["device-a-out"]}})
        const deviceB = makeDevice({ports: [deviceBInPort, deviceBOutPort], routing: {'device-b-in': ["device-b-out"]}})

        const result = traceSignalFlow([deviceA, deviceB])

        expect(result.pathResults).toHaveLength(1)
        expect(result.pathResults[0].status).toBe("failure")
        expect(result.pathResults[0].reason).toBe("circular path")
        expect(result.pathResults[0].path[0].key).toBe("device-a-out")
        expect(result.pathResults[0].path[1].key).toBe("device-b-in")
        expect(result.pathResults[0].path[2].key).toBe("device-b-out")
        expect(result.pathResults[0].path[3].key).toBe("device-a-in")

    })

    test("returns a successful path result when a terminal port is reached", ()=>{
        const originPort = makePort({direction: "output", id: "origin-port", flowRole: "origin", connectedToPortId: "terminal-port"})
        const terminalPort = makePort({direction: "input", id: "terminal-port", flowRole: "terminate", connectedToPortId: "origin-port"})

        const originDevice = makeDevice({ports: [originPort]})
        const terminalDevice = makeDevice({ports: [terminalPort]})

        const result = traceSignalFlow([originDevice, terminalDevice])

        expect(result.pathResults).toHaveLength(1)
        expect(result.pathResults[0].status).toBe("success")
        expect(result.pathResults[0].terminal.id).toBe("terminal-port")
        expect(result.pathResults[0].path[0].id).toBe("origin-port")
        expect(result.pathResults[0].path[1].id).toBe("terminal-port")
        expect(result.reachedTerminalIds).toStrictEqual(["terminal-port"])

    })

    test("returns a failed path result when no terminal port is reached", ()=>{
        const portA = makePort({direction: "output", id: "port-a", flowRole: "origin", connectedToPortId: "port-b"})
        const portB = makePort({direction: "input", id: "port-b", flowRole: "pass-through", connectedToPortId: "port-a"})
        const deviceA = makeDevice({ports: [portA], routing: {}})
        const deviceB = makeDevice({ports: [portB], routing: {}})

        const result = traceSignalFlow([deviceA, deviceB])

        expect(result.pathResults).toHaveLength(1)
        expect(result.pathResults[0].status).toBe('failure')
        expect(result.pathResults[0].reason).toBe('broken path')
        expect(result.pathResults[0].path[0].id).toBe("port-a")
        expect(result.pathResults[0].path[1].id).toBe("port-b")
        expect(result.pathResults[0].terminal).toBeNull()
    })

    test("returns one path result for each branch from a routed input", ()=>{
        const originPort = makePort({direction: "output", id: "origin-port", flowRole: "origin", connectedToPortId: "in-port"})
        const inPort = makePort({direction: "input", id: "in-port", key: "in-port", flowRole: "pass-through", connectedToPortId: "origin-port"})
        const outPort1 = makePort({direction: "output", id: "out-port-1", key: "out-port-1", flowRole: "pass-through", connectedToPortId: "terminal-port-1"})
        const outPort2 = makePort({direction: "output", id: "out-port-2", key: "out-port-2", flowRole: "pass-through", connectedToPortId: "terminal-port-2"})
        const terminalPort1 = makePort({direction: "input", id: "terminal-port-1", flowRole: "terminate", connectedToPortId: "out-port-1"})
        const terminalPort2 = makePort({direction: "input", id: "terminal-port-2", flowRole: "terminate", connectedToPortId: "out-port-2"})

        const originDevice = makeDevice({ports: [originPort], routing: {}})
        const routedDevice = makeDevice({ports: [inPort, outPort1, outPort2], routing: {"in-port": ["out-port-1", "out-port-2"]}})
        const terminalDevice1 = makeDevice({ports: [terminalPort1], routing: {}})
        const terminalDevice2 = makeDevice({ports: [terminalPort2], routing: {}})

        const result = traceSignalFlow([originDevice, routedDevice, terminalDevice1, terminalDevice2])

        const returnedPaths = result.pathResults.map((pathResult) => 
            pathResult.path.map((port)=> port.id).join(" -> ")
        )

        expect(returnedPaths.sort()).toStrictEqual([
            'origin-port -> in-port -> out-port-1 -> terminal-port-1',
            'origin-port -> in-port -> out-port-2 -> terminal-port-2'
         ].sort())

        expect(result.pathResults).toHaveLength(2)
        expect(result.pathResults[0].status).toBe("success")
        expect(result.pathResults[1].status).toBe("success")

        expect(result.reachedTerminalIds).toHaveLength(2)
        expect(result.reachedTerminalIds).toEqual(expect.arrayContaining(["terminal-port-1", "terminal-port-2"]))

    })

    test("collects unreachable terminal ids for terminals not reached", ()=>{
        const originPort = makePort({direction: "output", id: "origin-port", flowRole: "origin"})
        const terminalPort = makePort({direction: "input", id: "terminal-port", flowRole: "terminate"})

        const originDevice = makeDevice({ports: [originPort], routing: {}})
        const terminalDevice = makeDevice({ports: [terminalPort], routing: {}})

        const result = traceSignalFlow([originDevice, terminalDevice])


        expect(result.pathResults).toHaveLength(1)
        expect(result.pathResults[0].status).toBe('failure')

        expect(result.unreachableTerminalIds).toHaveLength(1)
        expect(result.unreachableTerminalIds).toContain('terminal-port')

        expect(result.reachedTerminalIds).toHaveLength(0)

    })

    test("returns no path results when there are no origin ports", ()=>{
        const terminalPort = makePort({direction: "input", id: "terminal-port", flowRole: "terminate"})

        const terminalDevice = makeDevice({ports: [terminalPort], routing: {}})

        const result = traceSignalFlow([terminalDevice])

        expect(result.pathResults).toHaveLength(0)
        expect(result.unreachableTerminalIds).toHaveLength(1)
        expect(result.unreachableTerminalIds).toContain("terminal-port")
    })

    test("returns a failed path result when an output points to a missing port id", ()=>{
        const originPort = makePort({direction: "output", id: "origin-port", flowRole: "origin", connectedToPortId: "missing-id"})
        const originDevice = makeDevice({ports: [originPort], routing: {}})

        const result = traceSignalFlow([originDevice])

        expect(result.pathResults).toHaveLength(1)
        expect(result.pathResults[0].status).toBe('failure')
        expect(result.pathResults[0].reason).toContain('could not find connected port')
    })

    test("returns both success and failure results when branches split and only one reaches a terminal", ()=>{
        const originPort = makePort({direction: "output", id: "origin-port", flowRole: "origin", connectedToPortId: "in-port"})
        const inPort = makePort({direction: "input", id: "in-port", key: "in-port", flowRole: "pass-through", connectedToPortId: "origin-port"})
        const outPort1 = makePort({direction: "output", id: "out-port-1", key: "out-port-1", flowRole: "pass-through", connectedToPortId: "terminal-port-1"})
        const outPort2 = makePort({direction: "output", id: "out-port-2", key: "out-port-2", flowRole: "pass-through"})
        const terminalPort1 = makePort({direction: "input", id: "terminal-port-1", flowRole: "terminate", connectedToPortId: "out-port-1"})

        const originDevice = makeDevice({ports: [originPort], routing: {}})
        const routedDevice = makeDevice({ports: [inPort, outPort1, outPort2], routing: {"in-port": ["out-port-1", "out-port-2"]}})
        const terminalDevice1 = makeDevice({ports: [terminalPort1], routing: {}})

        const result = traceSignalFlow([originDevice, routedDevice, terminalDevice1])

        expect(result.pathResults).toHaveLength(2)
        expect(result.pathResults.filter((pr)=>
            (pr.status==='failure' && pr.terminal===null && pr.reason==='broken path'))
        ).toHaveLength(1)
        expect(result.pathResults.filter((pr)=>
            (pr.status==='success'))
        ).toHaveLength(1)

        const returnedPaths = result.pathResults.map((pathResult) => 
            pathResult.path.map((port)=> port.id).join(" -> ")
        )

        expect(returnedPaths.sort()).toStrictEqual([
            'origin-port -> in-port -> out-port-1 -> terminal-port-1',
            'origin-port -> in-port -> out-port-2'
         ].sort())

    })
})