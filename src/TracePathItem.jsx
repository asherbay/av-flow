import './TracePathItem.css'

export function TracePathItem({ type, item, isHovered, setHoveredTraceItem }) {
  function highlightItem() {
    setHoveredTraceItem({ type, id: item.id })
  }

  function clearHighlight() {
    setHoveredTraceItem(null)
  }

  return (
    <button
      type="button"
      className={`trace-path-item ${type} ${isHovered ? 'hovered' : ''}`}
      aria-label={`Highlight ${type} ${item.label} on the canvas`}
      onMouseEnter={highlightItem}
      onMouseLeave={clearHighlight}
      onFocus={highlightItem}
      onBlur={clearHighlight}
    >
      {item.label}
    </button>
  )
}
