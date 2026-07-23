import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import {findPortRecord} from './findPortRecord.js'
import {canConnect} from './canConnect.js'
import '@xyflow/react/dist/style.css';
import DeviceNode from './DeviceNode.jsx'
 

 
export default function FlowCanvas(props) {

    // const nodePositionsEntries = props.devices.map((d)=>[d.id, {x: d.position.x, y: d.position.y}])
    // const initialNodePositions = Object.fromEntries(nodePositionsEntries)

    const initialNodes = props.devices.map((d, index)=>   
        {
            return {id: d.id, position: {x: d.position.x, y: d.position.y}, data: { device: d, selectionData: {isSelected: false, selectedPortIdsOnDevice: [], status: null, isHovered: false, hoveredPortIdOnDevice: ""}, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}, type: 'deviceNode'} 
        }
    )
    const [nodes, setNodes] = useState(initialNodes)


    const selectedPathResult = props.traceReport?.pathResults.find((pr)=>pr.id===props.selectedPath)
    const selectedPortIds = selectedPathResult?.path.map((port)=>port.id)
    const selectedPortRecords = selectedPortIds?.map((pid)=>findPortRecord(props.devices, pid)).filter((pr)=>pr)
    const selectedDeviceIds = [...new Set(selectedPortRecords?.map((pr)=>pr.device.id))]

    

    const selectedEdgeIds = new Set()

    if(selectedPathResult){
        for(let i = 0; i < selectedPathResult.path.length - 1; i++){
            const portA = selectedPathResult.path[i]
            const portB = selectedPathResult.path[i + 1]

            const isCableConnection = 
                portA.connectedToPortId === portB.id || portB.connectedToPortId === portA.id
            
            if(!isCableConnection){
                continue
            }

            const outputPortId = portA.direction === "output" ? portA.id : portB.id
            const inputPortId = portA.direction === "input" ? portA.id : portB.id
            selectedEdgeIds.add(`${outputPortId}-${inputPortId}`)
        }
    }


    useEffect(()=>{
        console.log("props.hoveredTraceItem", props.hoveredTraceItem)
        const updatedNodes = props.devices.map((d)=>{
            const node = nodes.find((n)=>n.id===d.id)
            const isSelected = selectedDeviceIds.includes(d.id)
            const selectedPortsOnDevice = selectedPathResult ? d.ports.filter((port)=>selectedPortIds.includes(port.id)) : []
            const selectedPortIdsOnDevice = selectedPortsOnDevice?.map((port)=>port.id)
            const status = selectedPathResult ? selectedPathResult.status : null
            const isHovered = props.hoveredTraceItem?.id === d.id
            const hoveredPortOnDevice = props.hoveredTraceItem && props.hoveredTraceItem.type==="port" ? d.ports.find((port)=>port.id===props.hoveredTraceItem.id) : null
            const hoveredPortIdOnDevice = hoveredPortOnDevice ? hoveredPortOnDevice.id : null
            

            if(!node){
                return {id: d.id, position: {x: d.position.x, y: d.position.y}, data: { device: d, selectionData: {isSelected: isSelected, selectedPortIdsOnDevice: selectedPortIdsOnDevice, status: status, isHovered, hoveredPortIdOnDevice}, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}, type: 'deviceNode'} 
            }
            if(d.position.x !== node.position.x || d.position.y !== node.position.y){
                return {...node, position: {x: d.position.x, y: d.position.y}, data: {device: d, selectionData: {isSelected: isSelected, selectedPortIdsOnDevice: selectedPortIdsOnDevice, status: status, isHovered, hoveredPortIdOnDevice}, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}}
            }
            return {...node, data: {device: d, selectionData: {isSelected: isSelected, selectedPortIdsOnDevice: selectedPortIdsOnDevice, status: status, isHovered, hoveredPortIdOnDevice}, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}}
        })
        setNodes(updatedNodes)
    }, [props.devices, props.selectedPath, props.hoveredTraceItem])



    

    


    const ports = props.devices.flatMap((d)=>d.ports)
    const connectedPorts = ports.filter((p)=>p.connectedToPortId!==null)
    
    const connectedPortIdsVisited = new Set()
    const connectedPortIdPairs = []

    connectedPorts.forEach((cp)=>{
        if(!connectedPortIdsVisited.has(cp.id) && !connectedPortIdsVisited.has(cp.connectedToPortId)){
            connectedPortIdPairs.push([cp.id, cp.connectedToPortId])
        }
        connectedPortIdsVisited.add(cp.id).add(cp.connectedToPortId)
    })

    const edges = connectedPortIdPairs.flatMap((cpidPair)=> {
        const portARecord = findPortRecord(props.devices, cpidPair[0])
        const portBRecord = findPortRecord(props.devices, cpidPair[1])

        if(!portARecord || !portBRecord){
            return []
        }

        const inPortRecord = [portARecord, portBRecord].find((pr)=>pr.port.direction==="input")
        const outPortRecord = [portARecord, portBRecord].find((pr)=>pr.port.direction==="output")

        if(!inPortRecord || !outPortRecord){
            return []
        }

        const inPortId = inPortRecord.port.id
        const outPortId = outPortRecord.port.id

        const inDeviceId = inPortRecord.device.id
        const outDeviceId = outPortRecord.device.id

        const edgeId = `${outPortId}-${inPortId}`
        const isSelected = selectedEdgeIds.has(edgeId)
        const selectedStatus = selectedPathResult?.status
        
        return [{ 
            id: edgeId, 
            source: outDeviceId, 
            target: inDeviceId, 
            sourceHandle: outPortId, 
            targetHandle: inPortId,
            style: isSelected ? {
                stroke: selectedStatus === "success" ? "#008000" : "#FF0000",
                strokeWidth: 2.5
            } : {
                stroke: "white",
                strokeWidth: 1.5
            }
        }]
    })
    

    function onNodesChange(changes) {
        setNodes((currentNodes) => applyNodeChanges(changes, currentNodes))
    }


    const nodeTypes = {
        deviceNode: DeviceNode,
    }

    function isValidConnection(connection){
        const portARecord = findPortRecord(props.devices, connection.sourceHandle)
        const portBRecord = findPortRecord(props.devices, connection.targetHandle)
        if(!portARecord || !portBRecord){
            return false
        }
        const portA = portARecord.port
        const portB = portBRecord.port

        const result = canConnect(props.devices, portA, portB)

        return result.isValid

    }
    
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={props.handleFlowConnect}
            onNodeDragStop={props.handleNodeDragStop}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            // isValidConnection={isValidConnection}
            fitView
        />
        </div>
    );
}