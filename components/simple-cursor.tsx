"use client"

import { useState, useEffect } from "react"

export default function SimpleCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)

      const target = e.target
      if (!(target instanceof Element)) {
        setIsHovering(false)
        return
      }

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList?.contains('interactive') ||
        !!target.closest('.interactive') ||
        !!target.closest('.crt-button')

      setIsHovering(isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setVisible(false)

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (!visible || typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.05s ease-out, opacity 0.2s ease',
      }}
    >
      <div
        style={{
          width: isHovering ? '32px' : '24px',
          height: isHovering ? '32px' : '24px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 0, 87, 0.8)',
          boxShadow: '0 0 8px rgba(255, 0, 87, 0.6)',
          backgroundColor: isHovering ? 'rgba(255, 0, 87, 0.15)' : 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          transition: 'width 0.2s, height 0.2s, transform 0.1s, background-color 0.2s',
        }}
      />

      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#2196f3',
          boxShadow: '0 0 8px #2196f3',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
    </div>
  )
}
