import React, { useState } from 'react'
import Toolbar from './components/Toolbar'
import Whiteboard from './whiteboard/Whiteboard'
import { StorageService } from './services/StorageService'

export default function App() {
  const [activeTool, setActiveTool] = useState('pen')
  const [color, setColor] = useState('#1f2937')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [showGrid, setShowGrid] = useState(false)
  const [dark, setDark] = useState(false)

  const toggleGrid = () => setShowGrid(v => !v)
  const toggleDark = () => {
    setDark(d => {
      const next = !d
      if (next) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return next
    })
  }

  const handleExportJSON = () => {
    const state = StorageService.loadLocal()
    StorageService.exportJSON(state || { elements: [] })
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await StorageService.importJSON(file)
      if (parsed && parsed.elements) {
        // pass to storage (Whiteboard will load from local)
        StorageService.saveLocal(parsed)
        window.location.reload()
      } else {
        alert('Invalid file')
      }
    } catch (err) {
      alert('Import error')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">DoodleSpace</h1>
          <span className="text-sm text-gray-500">Canvas whiteboard MVP</span>
        </div>
        <div className="flex items-center gap-2">
          <Toolbar
            activeTool={activeTool}
            setTool={setActiveTool}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            color={color}
            setColor={setColor}
            toggleGrid={toggleGrid}
            showGrid={showGrid}
            onExportPNG={() => {
              // delegated inside Whiteboard? We keep export on whiteboard; but provide event via localStorage or custom event
              const event = new Event('exportPNG')
              window.dispatchEvent(event)
            }}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportFile}
            dark={dark}
            toggleDark={toggleDark}
          />
        </div>
      </header>

      <main className="flex-1 p-4 bg-[var(--bg)]">
        <div className="mx-auto rounded-lg shadow-sm bg-[var(--panel)] p-2 h-full flex flex-col">
          <Whiteboard activeTool={activeTool} color={color} strokeWidth={strokeWidth} showGrid={showGrid} dark={dark} />
        </div>
      </main>

      <footer className="p-2 text-center text-xs text-gray-500">
        Built with ❤️ — CodeWithBotina
      </footer>
    </div>
  )
}
