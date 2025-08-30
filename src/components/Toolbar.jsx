import React from 'react'
import { FiPenTool, FiSquare, FiCircle, FiType, FiScissors, FiGrid, FiSun, FiDownload, FiUpload } from 'react-icons/fi'
import ToolButton from './ToolButton'
import ColorPicker from './ColorPicker'

export default function Toolbar({
  activeTool,
  setTool,
  strokeWidth,
  setStrokeWidth,
  color,
  setColor,
  toggleGrid,
  showGrid,
  onExportPNG,
  onExportJSON,
  onImportJSON,
  dark,
  toggleDark
}) {
  return (
    <div className="w-full md:w-auto p-2 bg-transparent flex items-center gap-2">
      <div className="flex items-center gap-2">
        <ToolButton active={activeTool === 'pen'} onClick={() => setTool('pen')} title="Pen">
          <FiPenTool />
        </ToolButton>
        <ToolButton active={activeTool === 'rect'} onClick={() => setTool('rect')} title="Rectangle">
          <FiSquare />
        </ToolButton>
        <ToolButton active={activeTool === 'circle'} onClick={() => setTool('circle')} title="Circle">
          <FiCircle />
        </ToolButton>
        <ToolButton active={activeTool === 'line'} onClick={() => setTool('line')} title="Line">
          <FiSquare style={{ transform: 'rotate(45deg)' }} />
        </ToolButton>
        <ToolButton active={activeTool === 'text'} onClick={() => setTool('text')} title="Text">
          <FiType />
        </ToolButton>
        <ToolButton active={activeTool === 'eraser'} onClick={() => setTool('eraser')} title="Eraser">
          <FiScissors />
        </ToolButton>
      </div>

      <div className="ml-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Width</label>
          <input type="range" min="1" max="40" value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} />
        </div>

        <ColorPicker color={color} onChange={setColor} />

        <ToolButton onClick={() => toggleGrid()} active={showGrid} title="Toggle grid">
          <FiGrid />
        </ToolButton>

        <ToolButton onClick={onExportPNG} title="Export PNG">
          <FiDownload />
        </ToolButton>

        <ToolButton onClick={onExportJSON} title="Export JSON">
          <FiDownload />
        </ToolButton>

        <label className="cursor-pointer" title="Import JSON">
          <input type="file" accept="application/json" onChange={onImportJSON} className="hidden" />
          <ToolButton title="Import JSON">
            <FiUpload />
          </ToolButton>
        </label>

        <ToolButton onClick={toggleDark} title="Toggle theme">
          <FiSun />
        </ToolButton>
      </div>
    </div>
  )
}
