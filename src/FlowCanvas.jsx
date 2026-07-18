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
            return {id: d.id, position: {x: d.position.x, y: d.position.y}, data: { device: d, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}, type: 'deviceNode'} 
        }
    )
    const [nodes, setNodes] = useState(initialNodes)
    // const [nodeDragPositions, setNodeDragPositions] = useState({})

    useEffect(()=>{
        const updatedNodes = props.devices.map((d)=>{
            const node = nodes.find((n)=>n.id===d.id)
            if(!node){
                return {id: d.id, position: {x: d.position.x, y: d.position.y}, data: { device: d, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}, type: 'deviceNode'} 
            }
            if(d.position.x !== node.position.x || d.position.y !== node.position.y){
                return {...node, position: {x: device.position.x, y: device.position.y}, data: {device: d, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}}
            }
            return {...node, data: {device: d, handleFlowDisconnect: props.handleFlowDisconnect, deleteDevice: props.handleDeleteDevice}}
        })
        setNodes(updatedNodes)
    }, [props.devices])



    

    


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

        
        return [{ id: `${outDeviceId}-${inDeviceId}`, source: outDeviceId, target: inDeviceId, sourceHandle: outPortId, targetHandle: inPortId }]
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
            // onEdgesChange={onEdgesChange}
            onConnect={props.handleFlowConnect}
            onNodeDragStop={props.handleNodeDragStop}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
        />
        </div>
    );
}