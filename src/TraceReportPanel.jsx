import TraceReport from './TraceReport.jsx'
import './TraceReportPanel.css'

function TraceReportPanel({
    closeTraceReport, 
    traceReport, 
    devices, 
    selectedPath, 
    setSelectedPath, 
    hoveredTraceItem, 
    setHoveredTraceItem
}) {
  return (
    <aside className="workspace-panel trace-report-panel" aria-labelledby="trace-heading">
        <header className="panel-header">
            <h2 id="trace-heading">Trace report</h2>
            {traceReport && (
                <button className="clear-report-button" onClick={closeTraceReport}>Clear</button>
            )}
        </header>
        <div className="panel-body">
            {traceReport ? (
                <TraceReport
                    traceReport={traceReport}
                    devices={devices}
                    selectedPath={selectedPath}
                    setSelectedPath={setSelectedPath}
                    hoveredTraceItem={hoveredTraceItem}
                    setHoveredTraceItem={setHoveredTraceItem}
                />
            ) : (
                <div className="panel-empty-state">
                    <span className="trace-empty-label">Ready when you are</span>
                    <h3>Follow the signal</h3>
                    <p>Build your connections, then choose Analyze to trace their paths.</p>
                </div>
            )}
        </div>
    </aside>
  )
}

export default TraceReportPanel
