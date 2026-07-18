import TracePathRow from './TracePathRow.jsx'
import {useState} from 'react'

export default function TraceReport(props){
    const result = props.result
    const devices = props.devices

    const [expandedRow, setExpandedRow] = useState("")

    function toggleExpandRow(pathResultId){
        if(expandedRow===pathResultId){
            setExpandedRow("")
        } else {
            setExpandedRow(pathResultId)
        }
    }


    return (
        <div className="trace-report">
            <button onClick={()=>{props.closeTraceReport()}}>X</button>
            <h3>Successful Paths:</h3>
            {result.pathResults.map((pr, index)=>
                pr.status==="success" && 
                <div key={pr.id}>
                    <button className="expand-row-button" onClick={()=>{toggleExpandRow(pr.id)}}>{expandedRow===pr.id ? "▼" : "▶"}</button>
                    <TracePathRow pathResult={pr} devices={devices} expanded={expandedRow===pr.id}/>
                </div>
            )}
        </div>
    )
}