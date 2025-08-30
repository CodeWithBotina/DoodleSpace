import React from 'react'
import { Line, Rect, Circle, Text } from 'react-konva'

export default function ElementRenderer({ el, isSelected, onSelect, onDragEnd, onTransformEnd }) {
  const common = {
    draggable: true,
    onClick: (e) => {
      e.cancelBubble = true
      onSelect(el.id)
    },
    onTap: (e) => {
      e.cancelBubble = true
      onSelect(el.id)
    }
  }

  if (el.type === 'stroke') {
    return (
      <Line
        {...common}
        id={el.id}
        points={el.points}
        stroke={el.color}
        strokeWidth={el.width}
        lineCap="round"
        lineJoin="round"
        tension={0}
        lineJoinStyle="round"
        onDragEnd={(e) => onDragEnd(el.id, e)}
      />
    )
  }
  if (el.type === 'rect') {
    return (
      <Rect
        {...common}
        id={el.id}
        x={el.x}
        y={el.y}
        width={el.width}
        height={el.height}
        fill={el.fill || 'transparent'}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth || 2}
        onDragEnd={(e) => onDragEnd(el.id, e)}
        onTransformEnd={(e) => onTransformEnd(el.id, e)}
      />
    )
  }
  if (el.type === 'circle') {
    return (
      <Circle
        {...common}
        id={el.id}
        x={el.x}
        y={el.y}
        radius={el.radius}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth || 2}
        fill={el.fill || 'transparent'}
        onDragEnd={(e) => onDragEnd(el.id, e)}
        onTransformEnd={(e) => onTransformEnd(el.id, e)}
      />
    )
  }
  if (el.type === 'line') {
    return (
      <Line
        {...common}
        id={el.id}
        points={[el.x1, el.y1, el.x2, el.y2]}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth || 2}
        onDragEnd={(e) => onDragEnd(el.id, e)}
        onTransformEnd={(e) => onTransformEnd(el.id, e)}
      />
    )
  }
  if (el.type === 'text') {
    return (
      <Text
        {...common}
        id={el.id}
        x={el.x}
        y={el.y}
        text={el.text}
        fontSize={el.fontSize || 18}
        fontFamily="Inter"
        fontStyle={el.fontStyle || 'normal'}
        fontWeight={el.fontWeight || 'normal'}
        fill={el.fill}
        width={el.width}
        height={el.height}
        onDragEnd={(e) => onDragEnd(el.id, e)}
        onTransformEnd={(e) => onTransformEnd(el.id, e)}
      />
    )
  }
  return null
}
