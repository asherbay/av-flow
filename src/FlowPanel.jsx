import FlowCanvas from './FlowCanvas.jsx'
import './FlowPanel.css'

function FlowPanel({
    devices, 
    updateDevices,
    handleNodeDragStop, 
    handleFlowConnect, 
    handleFlowDisconnect, 
    handleDeleteDevice, 
    selectedPath, 
    setSelectedPath, 
    traceReport, 
    hoveredTraceItem, 
    setHoveredTraceItem,
    userNotification,
}) {
  return (
    <section className="workspace-panel flow-panel" aria-labelledby="canvas-heading">
        <header className="panel-header">
            <h2 id="canvas-heading">Canvas</h2>
            <span className="panel-meta">{devices.length} {devices.length === 1 ? 'device' : 'devices'}</span>
        </header>
        <div className="flow-panel-canvas">
            <FlowCanvas
                devices={devices}
                updateDevices={updateDevices}
                handleNodeDragStop={handleNodeDragStop}
                handleFlowConnect={handleFlowConnect}
                handleFlowDisconnect={handleFlowDisconnect}
                handleDeleteDevice={handleDeleteDevice}
                selectedPath={selectedPath}
                setSelectedPath={setSelectedPath}
                traceReport={traceReport}
                hoveredTraceItem={hoveredTraceItem}
                setHoveredTraceItem={setHoveredTraceItem}
            />
            {devices.length === 0 && (
                <div className="canvas-empty-state panel-empty-state">
                    <span className="canvas-empty-mark" aria-hidden="true">+</span>
                    <h3>Start with a device</h3>
                    <p>Add gear from the Devices panel, then connect compatible ports.</p>
                </div>
            )}
        </div>
        <footer className="canvas-status" role="status">
            {userNotification || 'Drag to arrange. Connect ports to build your signal flow.'}
        </footer>
    </section>
  )
}

export default FlowPanel
