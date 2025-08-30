import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiBold, FiItalic, FiType } from 'react-icons/fi'
import ToolButton from '../components/ToolButton'
import ColorPicker from '../components/ColorPicker'

export default function InlineTextEditor({ stageRef, shape, onConfirm, onCancel }) {
  const textareaRef = useRef(null)
  const [text, setText] = useState(shape.text)
  const [fontSize, setFontSize] = useState(shape.fontSize)
  const [fontWeight, setFontWeight] = useState(shape.fontWeight || 'normal')
  const [fontStyle, setFontStyle] = useState(shape.fontStyle || 'normal')
  const [fill, setFill] = useState(shape.fill)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || !stageRef.current || !shape) return

    const stage = stageRef.current
    const textNode = shape

    // Calculate position relative to the stage container
    const stageRect = stage.container().getBoundingClientRect()
    const textNodeRect = textNode.getClientRect()

    const x = stageRect.left + textNodeRect.x + window.scrollX
    const y = stageRect.top + textNodeRect.y + window.scrollY

    textarea.style.top = `${y}px`
    textarea.style.left = `${x}px`
    textarea.style.width = `${textNodeRect.width}px`
    textarea.style.height = `${textNodeRect.height}px`
    textarea.style.fontSize = `${fontSize}px`
    textarea.style.fontWeight = fontWeight
    textarea.style.fontStyle = fontStyle
    textarea.style.color = fill
    textarea.style.lineHeight = textNode.lineHeight()
    textarea.style.padding = '0px'
    textarea.style.margin = '0px'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'transparent'
    textarea.style.border = '1px dashed #999'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.transformOrigin = 'left top'
    textarea.style.textAlign = textNode.align()
    textarea.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        onConfirm({ text, fontSize, fontWeight, fontStyle, fill })
      }
    }

    textarea.addEventListener('keydown', handleKeyDown)

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown)
    }
  }, [stageRef, shape, onConfirm, onCancel, text, fontSize, fontWeight, fontStyle, fill])

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value))
  }

  const toggleBold = () => {
    setFontWeight(prev => (prev === 'bold' ? 'normal' : 'bold'))
  }

  const toggleItalic = () => {
    setFontStyle(prev => (prev === 'italic' ? 'normal' : 'italic'))
  }

  const handleColorChange = (newColor) => {
    setFill(newColor)
  }

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onBlur={() => onConfirm({ text, fontSize, fontWeight, fontStyle, fill })}
        style={{
          position: 'absolute',
          fontFamily: shape.fontFamily(),
        }}
      />
      <div
        className="absolute flex items-center gap-2 p-2 rounded-md shadow-md bg-white dark:bg-gray-800"
        style={{
          top: (shape.getClientRect().y + shape.getClientRect().height + 10) + 'px',
          left: shape.getClientRect().x + 'px',
        }}
      >
        <ToolButton onClick={toggleBold} active={fontWeight === 'bold'} title="Bold">
          <FiBold />
        </ToolButton>
        <ToolButton onClick={toggleItalic} active={fontStyle === 'italic'} title="Italic">
          <FiItalic />
        </ToolButton>
        <input
          type="number"
          value={fontSize}
          onChange={handleFontSizeChange}
          className="w-16 p-1 text-sm border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          title="Font Size"
        />
        <ColorPicker color={fill} onChange={handleColorChange} />
      </div>
    </div>,
    document.body
  )
}