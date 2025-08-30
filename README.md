# DoodleSpace

DoodleSpace is a responsive canvas-based whiteboard built with **React + Vite + Tailwind + Konva**. This refactor focuses on professional UI, responsive layout, inline text editing, true eraser, grid overlay, and persistence.

## Live demo

https://codewithbotina.github.io/DoodleSpace

## Features

- Freehand drawing (strokes stored as points)
- Shapes: rectangle, circle, straight lines — draggable & resizable
- Inline text tool with real-time editing
- True eraser (deletes elements)
- Grid overlay toggle
- Export/Import board JSON, auto-save to localStorage
- Export as PNG
- Dark / Light modes
- Responsive toolbar and keyboard shortcuts

## Tech stack

- React + Vite
- TailwindCSS (dark mode via class)
- Konva + react-konva for canvas primitives
- react-icons for icons

## Setup

```bash
git clone https://github.com/CodeWithBotina/DoodleSpace.git
cd DoodleSpace
npm install
npm run dev
