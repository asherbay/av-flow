import {describe, expect, test} from 'vitest'
import {findPortRecord} from '../findPortRecord.js'
import {makePort, makeDevices} from './testFactories.js'

describe("findPortRecord", () => {
    test("returns the correct device and port for an existing port id", () => {
        const portA = makePort({id: "port-a", label: "HDMI Out"})
        const portB = makePort({id: "port-b", label: "HDMI In"})

        const devices = makeDevices([portA], [portB])

        const result = findPortRecord(devices, "port-b")

        expect(result).not.toBeNull()
        expect(result.device.id).toBe(devices[1].id)
        expect(result.port.id).toBe("port-b")
    })

    test('returns null when the port id does not exist', () => {
        const portA = makePort({id: "port-a"})
        const devices = makeDevices([portA])

        const result = findPortRecord(devices, 'port-b')

        expect(result).toBeNull()
    })
})
