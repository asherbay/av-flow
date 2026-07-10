import {describe, expect, test} from 'vitest'
import {canConnect} from '../canConnect.js'
import {makePort, makeDevices} from './testFactories.js'





describe('canConnect', () => {
    test('returns valid for compatible ports', () => {
        const outputPort = makePort({
            id: 'out-1',
            label: 'HDMI Out',
            direction: 'output',
            portType: 'HDMI',
            signal: 'video'
        })

        const inputPort = makePort({
            id: 'in-1',
            label: 'HDMI In',
            direction: 'input',
            portType: 'HDMI',
            signal: 'video'
        })

        const devices = makeDevices([inputPort], [outputPort])
        
        const result = canConnect(devices, outputPort, inputPort)

        expect(result.isValid).toBe(true)
        expect(result.reason).toBe('')
    })


    test('rejects ports with same direction', () => {
        const portA = makePort({direction: "output"})
        const portB = makePort({direction: "output"})

        const devices = makeDevices([portA], [portB])

        const result = canConnect(devices, portA, portB)

        expect(result.isValid).toBe(false)
        expect(result.reason).toBe('port directions are the same')
    })

    test('rejects mismatched signal types', () => {
        const portA = makePort({signal: "video", direction: "output"})
        const portB = makePort({signal: "audio", direction: "input"})

        const devices = makeDevices([portA], [portB])

        const result = canConnect(devices, portA, portB)

        expect(result.isValid).toBe(false)
        expect(result.reason).toBe('signal types do not match')
    })

    test('rejects mismatched port types', () => {
        const portA = makePort({portType: "HDMI", signal: "video", direction: "output"})
        const portB = makePort({portType: "SDI", signal: "video", direction: "input"})

        const devices = makeDevices([portA], [portB])

        const result = canConnect(devices, portA, portB)

        expect(result.isValid).toBe(false)
        expect(result.reason).toBe('port types do not match')
    })

    test('rejects a port that is already connected', () => {
        const outputPort = makePort({id: "out-1", direction: "output", label: "HDMI Out", connectedToPortId: "in-2"})
        const existingTargetPort = makePort({id: "in-2", direction: "input", label: "Existing HDMI In"})
        const newTargetPort = makePort({id: "in-3", direction: "input", label: "New HDMI In"})

        const devices = makeDevices([outputPort], [existingTargetPort], [newTargetPort])

        const result = canConnect(devices, outputPort, newTargetPort)

        expect(result.isValid).toBe(false)
        expect(result.reason).toContain('already connected')
    })


})
