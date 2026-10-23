import React, {useState} from 'react'
import {selectSwitcherInput} from './selectSwitcherInput.js'


const SwitcherOutputSelector = ({device, output, devices, updateDevices}) => {
    const [selectedInputIndex, setSelectedInputIndex] = useState(0)
    const inPorts = device.ports.filter((p)=>p.direction === "input" && p.label)

    const handleChange = (event) => {
        setSelectedInputIndex(event.target.value)
        updateDevices(selectSwitcherInput(devices, device, inPorts[event.target.value], output))
    }

  return (
    <select value={selectedInputIndex} onChange={handleChange}> 
        {inPorts.map((p, index)=><option value={index}>{p.label}</option>)}
    </select>
  )
}

export default SwitcherOutputSelector