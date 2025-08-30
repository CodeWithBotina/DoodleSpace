import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function InlineTextEditor({ stageRef, shape, onConfirm, onCancel }) {
  const textareaRef = useRef()

  useEffect(() => {
    if (!stageRef.current || !shape) return
    const stage = stageRef.current
    const textNode = shape
    const absPos = textNode.getAbsolutePosition()
    const area = document.createElement('textarea')
    area.value = textNode.text()
    area.style.position = 'absolute'
    area.style.top = `${absPos.y}px`
    area.style.left = `${absPos.x}px`
    area.style.width = `${textNode.width()}px`
    area.style.height = `${textNode.height()}px`
    area.style.font = `${textNode.fontSize()}px ${textNode.fontFamily()}`
    area.style.color = textNode.fill()
    area.style.background = 'transparent'
    area.style.border = '1px dashed #999'
    document.body.appendChild(area)
    textareaRef.current = area
    area.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        onConfirm(area.value)
      }
    }
    area.addEventListener('keydown', onKey)

    return () => {
      area.removeEventListener('keydown', onKey)
      area.remove()
    }
  }, [stageRef, shape, onConfirm, onCancel])

  return null
}
