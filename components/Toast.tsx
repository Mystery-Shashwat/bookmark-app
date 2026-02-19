'use client'

import { useEffect } from 'react'

type ToastProps = {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideIn">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 text-xl font-bold leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
