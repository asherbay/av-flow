import {useState} from 'react'
import DeviceCatalogItem from './DeviceCatalogItem.jsx'

function DeviceCatalogCategory({category, categoryDevices, addNewDevice}) {
    const [expanded, setExpanded] = useState(true)

  return (
    <div className={"device-catalog-category"}>
        <button className="device-catalog-category-header" aria-expanded={expanded} onClick={()=>{setExpanded(!expanded)}}>
            <span className="category-chevron" aria-hidden="true">{expanded ? '\u2304' : '\u203a'}</span>
            <span>{category}</span>
            <span className="category-count">{categoryDevices.length}</span>
        </button>
        {expanded && categoryDevices.map((d)=><DeviceCatalogItem key={d.deviceType} device={d} addNewDevice={addNewDevice}/>)}
    </div>
  )
}

export default DeviceCatalogCategory
