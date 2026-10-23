import { useId } from 'react'
import { findPortRecord } from './findPortRecord.js'
import { TracePathItem } from './TracePathItem.jsx'
import './TracePathRow.css'

export default function TracePathRow({
  pathResult,
  devices,
  expanded,
  onToggle,
  hoveredTraceItem,
  setHoveredTraceItem,
}) {
  const detailsId = useId()
  const summaryId = useId()
  const deviceStops = []

  // Consecutive input/output ports on one device become a single visual stop.
  for (const [index, port] of pathResult.path.entries()) {
    const device = findPortRecord(devices, port.id)?.device
    const previousStop = deviceStops.at(-1)

    if (device && previousStop?.device?.id === device.id) {
      previousStop.ports.push(port)
    } else {
      deviceStops.push({ id: `${port.id}-${index}`, device, ports: [port] })
    }
  }

  const originLabel = deviceStops[0]?.device?.label ?? 'Unavailable device'
  const destinationLabel = deviceStops.at(-1)?.device?.label ?? 'Unavailable device'
  const signal = pathResult.origin?.signal
  const signalLabel = signal === 'audio' ? 'Audio' : signal === 'video' ? 'Video' : 'Unknown signal'
  const isSuccessful = pathResult.status === 'success'
  const failureDescription = pathResult.reason === 'circular path'
    ? 'This route loops back to a port it has already visited.'
    : 'A connection points to a port that is no longer available.'

  return (
    <article className={`trace-path-card ${isSuccessful ? 'success' : 'failure'} ${expanded ? 'expanded' : ''}`}>
      <button
        type="button"
        id={summaryId}
        className="trace-path-toggle"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} path from ${originLabel} to ${destinationLabel}`}
        onClick={onToggle}
      >
        <span className="trace-path-endpoints">
          <span className="trace-path-endpoint">{originLabel}</span>{' '}
          <span className="trace-path-destination">
            <span className="trace-path-arrow" aria-hidden="true">{'\u2192'}</span>{' '}
            {destinationLabel}
          </span>
        </span>
        <svg className="trace-path-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m5 6 3 3 3-3" />
        </svg>
        <span className="trace-path-meta">
          <span className="trace-signal-type">{signalLabel}</span>
          <span className="trace-path-status">
            <span className="trace-status-dot" aria-hidden="true" />
            {isSuccessful ? 'Complete' : 'Needs attention'}
          </span>
        </span>
      </button>

      <div id={detailsId} role="region" aria-labelledby={summaryId} hidden={!expanded}>
        {expanded && (
          <div className="trace-path-details">
            <div className="trace-route-heading">
              <span>Signal route</span>
              <span>{deviceStops.length} {deviceStops.length === 1 ? 'device' : 'devices'}</span>
            </div>
            <ol className="trace-route">
              {deviceStops.map((stop, index) => (
                <li className="trace-route-stop" key={stop.id}>
                  <span className="trace-stop-marker" aria-hidden="true">{index + 1}</span>
                  <div className="trace-stop-content">
                    {stop.device ? (
                      <TracePathItem
                        type="device"
                        item={stop.device}
                        isHovered={hoveredTraceItem?.type === 'device' && hoveredTraceItem.id === stop.device.id}
                        setHoveredTraceItem={setHoveredTraceItem}
                      />
                    ) : (
                      <span className="trace-unavailable-device">Unavailable device</span>
                    )}
                    <div className="trace-stop-ports">
                      {stop.ports.map((port, portIndex) => (
                        <div className="trace-stop-port" key={`${port.id}-${portIndex}`}>
                          <span className="trace-port-direction">{port.direction === 'input' ? 'In' : 'Out'}</span>
                          <TracePathItem
                            type="port"
                            item={port}
                            isHovered={hoveredTraceItem?.type === 'port' && hoveredTraceItem.id === port.id}
                            setHoveredTraceItem={setHoveredTraceItem}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {!isSuccessful && <p className="trace-path-issue">{failureDescription}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
