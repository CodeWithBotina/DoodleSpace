import React, { useState } from 'react'
import Toolbar from './components/Toolbar'
import Whiteboard from './whiteboard/Whiteboard'
import { StorageService } from './services/StorageService'

export default function App() {
  const [activeTool, setActiveTool] = useState('pen')
  const [color, setColor] = useState('#1f2937')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [showGrid, setShowGrid] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

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
    <div className="h-screen flex flex-col font-inter">
      <header className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DoodleSpace</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">Canvas whiteboard MVP</span>
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
        <div className="mx-auto rounded-lg shadow-lg bg-[var(--panel)] p-2 h-full flex flex-col overflow-hidden">
          <Whiteboard activeTool={activeTool} color={color} strokeWidth={strokeWidth} showGrid={showGrid} dark={dark} />
        </div>
      </main>

      <footer className="p-3 text-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        Built with ❤️ by CodeWithBotina
      </footer>
    </div>
  )
}















