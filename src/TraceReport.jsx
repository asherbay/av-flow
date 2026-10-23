import TracePathRow from './TracePathRow.jsx'
import { findPortRecord } from './findPortRecord.js'
import { TracePathItem } from './TracePathItem.jsx'
import './TraceReport.css'

export default function TraceReport({
  traceReport,
  devices,
  selectedPath,
  setSelectedPath,
  hoveredTraceItem,
  setHoveredTraceItem,
}) {
  const completePathCount = traceReport.pathResults.filter((path) => path.status === 'success').length
  // An unused output can be intentional; keep actual trace errors visible.
  const visiblePaths = traceReport.pathResults.filter((path) => path.reason !== 'broken path')
  const unreachedDestinations = traceReport.unreachableTerminalIds
    .map((portId) => findPortRecord(devices, portId))
    .filter(Boolean)

  function toggleExpandRow(pathId) {
    setHoveredTraceItem(null)
    setSelectedPath(selectedPath === pathId ? '' : pathId)
  }

  return (
    <div className="trace-report">
      <div className="trace-overview">
        <span className="trace-overview-label">Analysis complete</span>
        <p>
          <strong>{completePathCount}</strong> complete {completePathCount === 1 ? 'path' : 'paths'}
        </p>
        {visiblePaths.length > 0 && (
          <span className="trace-overview-caption">Expand a path to follow its signal.</span>
        )}
      </div>

      <section aria-labelledby="signal-paths-heading">
        <div className="trace-section-heading">
          <h3 id="signal-paths-heading">Signal paths</h3>
          <span>{visiblePaths.length}</span>
        </div>
        <div className="trace-path-list">
          {visiblePaths.map((pathResult) => (
            <TracePathRow
              key={pathResult.id}
              pathResult={pathResult}
              devices={devices}
              expanded={selectedPath === pathResult.id}
              onToggle={() => toggleExpandRow(pathResult.id)}
              hoveredTraceItem={hoveredTraceItem}
              setHoveredTraceItem={setHoveredTraceItem}
            />
          ))}
        </div>
        {visiblePaths.length === 0 && (
          <div className="trace-no-paths">
            <h4>{traceReport.origins.length === 0 ? 'No signal sources found' : 'No complete paths yet'}</h4>
            <p>Connect a source to a destination, then analyze again.</p>
          </div>
        )}
      </section>

      {unreachedDestinations.length > 0 && (
        <section className="trace-unreached" aria-labelledby="unreached-heading">
          <div className="trace-section-heading">
            <h3 id="unreached-heading">Unreached destinations</h3>
            <span>{unreachedDestinations.length}</span>
          </div>
          <p className="trace-section-description">No signal path reaches these inputs.</p>
          <ul className="trace-unreached-list">
            {unreachedDestinations.map(({ device, port }) => (
              <li key={port.id}>
                <TracePathItem
                  type="device"
                  item={device}
                  isHovered={hoveredTraceItem?.type === 'device' && hoveredTraceItem.id === device.id}
                  setHoveredTraceItem={setHoveredTraceItem}
                />
                <TracePathItem
                  type="port"
                  item={port}
                  isHovered={hoveredTraceItem?.type === 'port' && hoveredTraceItem.id === port.id}
                  setHoveredTraceItem={setHoveredTraceItem}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
