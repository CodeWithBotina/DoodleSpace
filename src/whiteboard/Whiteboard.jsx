import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Line, Transformer } from 'react-konva'
import ElementRenderer from './ElementRenderer'
import { uid } from '../utils/id'
import { StorageService } from '../services/StorageService'
import InlineTextEditor from './InlineTextEditor'

const defaultWidth = 1200
const defaultHeight = 800

export default function Whiteboard({ activeTool, color, strokeWidth, showGrid, dark }) {
  const stageRef = useRef(null)
  const selectionRef = useRef(null)
  const trRef = useRef(null)
  const [elements, setElements] = useState(() => {
    const saved = StorageService.loadLocal()
    return saved?.elements || []
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [editingTextId, setEditingTextId] = useState(null)

  useEffect(() => {
    StorageService.saveLocal({ elements })
  }, [elements])

  useEffect(() => {
    if (trRef.current && selectedId) {
      const stage = stageRef.current
      const selectedNode = stage.findOne(`#${selectedId}`)
      if (selectedNode) {
        trRef.current.nodes([selectedNode])
        trRef.current.getLayer().batchDraw()
      } else {
        trRef.current.nodes([])
      }
    } else if (trRef.current) {
      trRef.current.nodes([])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedId, elements])

  // mouse down
  const handleMouseDown = (e) => {
    const stage = stageRef.current
    const pos = stage.getPointerPosition()
    if (!pos) return

    // if clicked on empty area, clear selection
    const clickedOnEmpty = e.target === stage
    if (clickedOnEmpty) setSelectedId(null)

    if (activeTool === 'pen') {
      const id = uid('stroke_')
      const newStroke = {
        id,
        type: 'stroke',
        points: [pos.x, pos.y],
        color,
        width: strokeWidth
      }
      setElements(prev => [...prev, newStroke])
      setIsDrawing(true)
    } else if (activeTool === 'rect') {
      const id = uid('rect_')
      const rect = {
        id,
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: 1,
        height: 1,
        stroke: color,
        strokeWidth
      }
      setElements(prev => [...prev, rect])
      setSelectedId(id)
      setIsDrawing(true)
    } else if (activeTool === 'circle') {
      const id = uid('circle_')
      const circ = {
        id,
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 1,
        stroke: color,
        strokeWidth
      }
      setElements(prev => [...prev, circ])
      setSelectedId(id)
      setIsDrawing(true)
    } else if (activeTool === 'line') {
      const id = uid('line_')
      const l = {
        id,
        type: 'line',
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
        stroke: color,
        strokeWidth
      }
      setElements(prev => [...prev, l])
      setSelectedId(id)
      setIsDrawing(true)
    } else if (activeTool === 'text') {
      const id = uid('text_')
      const t = {
        id,
        type: 'text',
        x: pos.x,
        y: pos.y,
        text: 'Double-click to edit',
        fontSize: 18,
        color
      }
      setElements(prev => [...prev, t])
      setSelectedId(id)
      // open edit instantly
      setTimeout(() => setEditingTextId(id), 50)
    } else if (activeTool === 'eraser') {
      // remove object on click - immediate
      if (e.target && e.target.attrs && e.target.attrs.id) {
        const id = e.target.attrs.id
        setElements(prev => prev.filter(p => p.id !== id))
        setSelectedId(null)
      }
    }
  }

  // mouse move
  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const pos = stageRef.current.getPointerPosition()
    if (!pos) return
    setElements(prev => {
      const last = prev[prev.length - 1]
      if (!last) return prev
      const copy = [...prev]
      if (last.type === 'stroke') {
        last.points = [...last.points, pos.x, pos.y]
      } else if (last.type === 'rect') {
        last.width = Math.max(1, pos.x - last.x)
        last.height = Math.max(1, pos.y - last.y)
      } else if (last.type === 'circle') {
        const dx = pos.x - last.x
        const dy = pos.y - last.y
        last.radius = Math.sqrt(dx * dx + dy * dy)
      } else if (last.type === 'line') {
        last.x2 = pos.x
        last.y2 = pos.y
      }
      copy[copy.length - 1] = { ...last }
      return copy
    })
  }

  // mouse up
  const handleMouseUp = (e) => {
    setIsDrawing(false)
  }

  // selection handlers
  const handleSelect = (id) => {
    setSelectedId(id)
  }
  const handleDelete = () => {
    if (selectedId) {
      setElements(prev => prev.filter(p => p.id !== selectedId))
      setSelectedId(null)
    }
  }
  const handleDragEnd = (id, e) => {
    const node = e.target
    setElements(prev => prev.map(el => {
      if (el.id !== id) return el
      if (el.type === 'stroke') {
        // stroke dragging: move each point by delta
        const dx = node.x()
        const dy = node.y()
        // simpler approach: reset node position and update points relative
        const newPoints = el.points.map((p, idx) => {
          // points are [x0,y0,x1,y1...]
          return p
        })
        // Instead of complex absolute transforms, we will store points as absolute coordinates and set node position back to 0
        // Here Konva does translate via node.x/y; to keep simplicity, avoid applying transforms for strokes
        // For simplicity in MVP, disable drag for strokes (or convert to group later)
        return el
      }
      // rect, circle, line, text - can use node.x/y
      const newEl = { ...el, x: node.x(), y: node.y() }
      if (el.type === 'line') {
        // Konva Line used for simple lines during creation, but after drag we may want to recalc
      }
      return newEl
    }))
  }

  const handleTransformEnd = (id, e) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)
    setElements(prev => prev.map(el => {
      if (el.id !== id) return el
      if (el.type === 'rect') {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, el.width * scaleX),
          height: Math.max(5, el.height * scaleY)
        }
      } else if (el.type === 'circle') {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          radius: Math.max(2, el.radius * Math.max(scaleX, scaleY))
        }
      } else if (el.type === 'text') {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          fontSize: Math.max(8, el.fontSize * scaleY)
        }
      } else if (el.type === 'line') {
        // We don't handle complex transform for line here
      }
      return el
    }))
  }

  // double click for text editing
  const handleDblClick = (e) => {
    if (!e.target || !e.target.attrs) return
    const id = e.target.attrs.id
    const el = elements.find(x => x.id === id)
    if (el && el.type === 'text') {
      setEditingTextId(id)
      setSelectedId(id)
    }
  }

  const confirmTextEdit = (text) => {
    setElements(prev => prev.map(el => el.id === editingTextId ? { ...el, text } : el))
    setEditingTextId(null)
  }
  const cancelTextEdit = () => setEditingTextId(null)

  // export PNG
  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
    const a = document.createElement('a')
    a.href = uri
    a.download = 'doodlespace-board.png'
    a.click()
  }

  // export JSON
  const exportJSON = () => {
    StorageService.exportJSON({ elements })
  }

  // import JSON (object)
  const importJSON = (json) => {
    if (!json?.elements) return
    setElements(json.elements)
  }

  // keyboard events
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        StorageService.saveLocal({ elements })
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) handleDelete()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        // minimal undo: remove last
        setElements(prev => prev.slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, elements])

  return (
    <div className="flex-1 w-full h-full relative">
      <Stage
        width={Math.max(window.innerWidth - 300, 600)}
        height={Math.max(window.innerHeight - 120, 400)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblClick={handleDblClick}
        ref={stageRef}
        className="bg-transparent"
      >
        <Layer>
          {/* Grid background */}
          {showGrid &&
            (() => {
              const lines = []
              const step = 25
              for (let i = 0; i < defaultWidth; i += step) {
                lines.push(
                  <Line key={'v' + i} points={[i, 0, i, defaultHeight]} stroke={dark ? '#12202b' : '#e6eef8'} strokeWidth={0.5} />
                )
              }
              for (let j = 0; j < defaultHeight; j += step) {
                lines.push(
                  <Line key={'h' + j} points={[0, j, defaultWidth, j]} stroke={dark ? '#12202b' : '#e6eef8'} strokeWidth={0.5} />
                )
              }
              return lines
            })()
          }
        </Layer>

        <Layer>
          {elements.map(el => (
            <ElementRenderer
              key={el.id}
              el={el}
              isSelected={el.id === selectedId}
              onSelect={handleSelect}
              onDragEnd={(id, e) => handleDragEnd(id, e)}
              onTransformEnd={(id, e) => handleTransformEnd(id, e)}
            />
          ))}
        </Layer>

        <Layer>
          <Transformer ref={trRef} rotateEnabled={false} />
        </Layer>
      </Stage>

      {editingTextId && (
        <InlineTextEditor
          stageRef={stageRef}
          shape={stageRef.current.findOne(`#${editingTextId}`)}
          onConfirm={confirmTextEdit}
          onCancel={cancelTextEdit}
        />
      )}

      {/* small action buttons */}
      <div className="absolute right-4 bottom-4 flex gap-2">
        <button className="px-3 py-2 rounded shadow bg-white dark:bg-gray-800" onClick={exportPNG}>Export PNG</button>
        <button className="px-3 py-2 rounded shadow bg-white dark:bg-gray-800" onClick={exportJSON}>Export JSON</button>
      </div>
    </div>
  )
}
