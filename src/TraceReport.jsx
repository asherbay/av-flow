import TracePathRow from './TracePathRow.jsx'
import {useState} from 'react'

export default function TraceReport(props){
    const result = props.result
    const devices = props.devices
    const hoveredTraceItem = props.hoveredTraceItem
    const setHoveredTraceItem = props.setHoveredTraceItem

    // console.log("hoveredTraceItem", hoveredTraceItem)
    // const [expandedRow, setExpandedRow] = useState("")

    function toggleExpandRow(pathResultId){
        if(props.selectedPath===pathResultId){
            props.setSelectedPath("")
        } else {
            props.setSelectedPath(pathResultId)
        }
    }


    return (
        <div className="trace-report">
            <button onClick={()=>{props.closeTraceReport()}}>X</button>
            <h3>Successful Paths:</h3>
            {result.pathResults.map((pr, index)=>
                pr.status==="success" && 
                <div key={pr.id}>
                    <button className="expand-row-button" onClick={()=>{toggleExpandRow(pr.id)}}>{props.selectedPath===pr.id ? "▼" : "▶"}</button>
                    <TracePathRow pathResult={pr} devices={devices} expanded={props.selectedPath===pr.id} selectedPath={props.selectedPath} hoveredTraceItem={hoveredTraceItem} setHoveredTraceItem={setHoveredTraceItem}/>
                </div>
            )}
        </div>
    )
}