import React from 'react'
import clsx from 'clsx'

export default function ToolButton({ active, title, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'p-2 rounded-md transition-all flex items-center justify-center',
        active ? 'bg-brand-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 hover:shadow-sm'
      )}
    >
      {children}
    </button>
  )
}
