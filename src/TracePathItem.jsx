import './TracePathItem.css'


export function TracePathItem(props){
    const type = props.type
    const item = props.item
    const path = props.path
    const isHovered = props.isHovered
    const setHoveredTraceItem = props.setHoveredTraceItem


    const handleMouseOver = () => {
        setHoveredTraceItem({type: type, id: item.id})
    }

    const handleMouseExit = () => {
        setHoveredTraceItem(null)
    }

    return (
        <span className={`trace-path-item ${type} ${isHovered ? "hovered" : "not-hovered"}`} onMouseOver={handleMouseOver} onMouseLeave={handleMouseExit}>
            {type==="device" &&
                <span>
                    {item.label}:{" "}
                </span>
            }   
            {type==="port" &&
                <span>
                    {item.label}{path.at(-1).id!==item.id ? ` ${item.direction==="output" ? "→" : "↦"} ` : ""}
                </span>
            }
        </span>
    )
}


// function stringifyPathItem(port, path){
//         const device = portDevicePairsObject[port.id]
//         if(!device){
//             return
//         }
//         return `${device.label}: ${port.label}${path.at(-1).id!==port.id ? ` ${port.direction==="output" ? "→" : "↦"} ` : ""}`
//     }