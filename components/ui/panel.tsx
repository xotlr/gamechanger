"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CardCorners } from "./card-corners"

interface PanelProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'solid' | 'glass'
  borderColor?: 'blue' | 'red' | 'white'
  corners?: boolean
  cornerSize?: 'sm' | 'md'
  hover3d?: boolean
}

const borderColors = {
  blue: 'border-[#2196f3]/30',
  red: 'border-[#ff0057]/30',
  white: 'border-white/20'
}

const hoverBorderColors = {
  blue: 'hsl(207, 90%, 54%)',
  red: 'hsl(342, 100%, 49%)',
  white: 'rgba(255, 255, 255, 0.5)'
}

const cornerColors = {
  blue: '#2196f3',
  red: '#ff0057',
  white: '#ffffff'
}

export function Panel({
  children,
  className = '',
  variant = 'default',
  borderColor = 'blue',
  corners = true,
  cornerSize = 'md',
  hover3d = true
}: PanelProps) {
  const [isHovered, setIsHovered] = useState(false)

  const base = 'relative'

  const variants = {
    default: `bg-[#0a0a14] border ${borderColors[borderColor]}`,
    solid: `bg-[#0a0a14] border-2 ${borderColors[borderColor]}`,
    glass: `bg-[#0a0a14]/80 border ${borderColors[borderColor]} backdrop-blur-sm`
  }

  if (!hover3d) {
    return (
      <div className={`${base} ${variants[variant]} ${className}`}>
        {children}
        {corners && <CardCorners color={cornerColors[borderColor]} size={cornerSize} />}
      </div>
    )
  }

  return (
    <motion.div
      className={`${base} ${variants[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: isHovered ? 3 : 0,
        translateY: isHovered ? -6 : 0,
        boxShadow: isHovered
          ? `0 12px 24px rgba(0, 0, 0, 0.4), 0 0 20px ${borderColor === 'red' ? 'rgba(255, 0, 87, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`
          : '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderColor: isHovered ? hoverBorderColors[borderColor] : undefined,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      {children}
      {corners && <CardCorners color={cornerColors[borderColor]} size={cornerSize} />}

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255, 0, 87, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export function PanelHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-xl font-bold mb-4 glitch-text ${className}`}>
      {children}
    </h3>
  )
}

export function PanelContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-gray-300 ${className}`}>
      {children}
    </div>
  )
}
