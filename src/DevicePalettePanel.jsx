import DeviceCatalogCategory from './DeviceCatalogCategory.jsx'
import './DevicePalettePanel.css'

function DevicePalettePanel({
    devices, 
    deviceCatalog, 
    addNewDevice,
}) {

    const paletteCategories = [...new Set(deviceCatalog.map((d) => d.paletteCategory))]

  return (
    <aside className="workspace-panel device-palette-panel" aria-labelledby="devices-heading">
        <header className="panel-header">
            <h2 id="devices-heading">Devices</h2>
            <span className="panel-meta">{deviceCatalog.length} types</span>
        </header>
        <div className="panel-body">
            <p className="panel-description">Choose a device to add to the canvas.</p>
            {
                paletteCategories.map((pc)=> {
                    const categoryDevices = deviceCatalog.filter((d)=>d.paletteCategory===pc)
                    return (<DeviceCatalogCategory key={pc} category={pc} categoryDevices={categoryDevices} addNewDevice={addNewDevice}/>)
                })
            }
        </div>
        <footer className="palette-footer">
            <span className="palette-status-dot" aria-hidden="true" />
            {devices.length} {devices.length === 1 ? 'device' : 'devices'} in use
        </footer>
    </aside>
  )
}

export default DevicePalettePanel
