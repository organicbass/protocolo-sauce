'use client'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import useAdvancedAudio from '@/hooks/useAdvancedAudio'

interface TerminalLoaderProps {
    onComplete: () => void
}

const terminalLines = [
    { text: '> INITIALIZING PROTOCOLO_SAUCE...', delay: 0 },
    { text: '> SCANNING NEURAL INTERFACE...', delay: 600 },
    { text: '> ESTABLISHING SECURE CONNECTION...', delay: 1200 },
    { text: '> DECRYPTING DATA STREAM...', delay: 1800 },
    { text: '> BYPASSING FIREWALL [████████] 100%', delay: 2400 },
    { text: '> LOADING CORE MODULES...', delay: 3000 },
    { text: '> SYSTEM STABILIZED.', delay: 3600 },
    { text: '> ACCESS GRANTED.', delay: 4200 },
]

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
    const [visibleLines, setVisibleLines] = useState<number>(0)
    const [progress, setProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const { playTrack, initContext } = useAdvancedAudio()

    useEffect(() => {
        // Show terminal lines
        terminalLines.forEach((line, i) => {
            setTimeout(() => {
                setVisibleLines(i + 1)
                // Play typing SFX
                initContext()
                playTrack('typing', false)
            }, line.delay)
        })

        // Progress bar duration should match total terminal delay + safety margin
        const duration = 4800
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const pct = Math.min((elapsed / duration) * 100, 100)
            setProgress(pct)
            if (pct >= 100) {
                clearInterval(interval)
                setTimeout(onComplete, 800)
            }
        }, 30)

        return () => clearInterval(interval)
    }, [onComplete])

    return (
        <motion.section
            className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
        >
            {/* SVG Glitch Filter */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="glitch-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Scanline overlay */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(173,236,25,0.05) 1px, rgba(173,236,25,0.05) 2px)',
                }}
            />

            {/* Moving scanline */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] bg-neon-green/20 z-[3] pointer-events-none"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Terminal Container */}
            <div
                ref={containerRef}
                className="relative z-[10] w-[90vw] max-w-[700px] p-6 tablet:p-8"
            >
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-neon-green/20">
                    <div className="w-2.5 h-2.5 bg-red-500/80" />
                    <div className="w-2.5 h-2.5 bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 bg-neon-green/80" />
                    <span className="ml-4 font-sans text-[10px] text-neon-green/50 uppercase tracking-[0.3em]">
                        PROTOCOLO_SAUCE://SYSTEM_CORE
                    </span>
                </div>

                {/* Terminal lines */}
                <div className="space-y-2 mb-8 min-h-[200px] tablet:min-h-[240px]">
                    {terminalLines.slice(0, visibleLines).map((line, i) => (
                        <motion.div
                            key={i}
                            className="font-mono text-xs tablet:text-sm overflow-hidden whitespace-nowrap"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ duration: 0.5, ease: "linear" }}
                            style={{
                                color: i === terminalLines.length - 1 ? '#eceb21' : '#adec19',
                                textShadow: '0 0 8px rgba(173, 236, 25, 0.3)',
                            }}
                        >
                            {line.text}
                        </motion.div>
                    ))}

                    {/* Blinking cursor */}
                    {visibleLines < terminalLines.length && (
                        <span
                            className="inline-block w-2 h-4 bg-neon-green ml-1"
                            style={{ animation: 'terminalBlink 0.8s infinite' }}
                        />
                    )}
                </div>

                {/* Progress bar */}
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-sans text-[10px] text-white/40 uppercase tracking-[0.2em]">
                            Loading Modules
                        </span>
                        <span className="font-mono text-xs text-neon-green">
                            {Math.floor(progress)}%
                        </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full bg-neon-green"
                            style={{
                                width: `${progress}%`,
                                boxShadow: '0 0 10px rgba(173, 236, 25, 0.5), 0 0 20px rgba(173, 236, 25, 0.2)',
                            }}
                        />
                    </div>

                    {/* Progress segments */}
                    <div className="flex justify-between mt-1">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="w-px h-1"
                                style={{
                                    backgroundColor: progress > (i + 1) * 10 ? '#adec19' : 'rgba(255,255,255,0.1)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-neon-green/20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-neon-green/20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-neon-green/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-neon-green/20" />
        </motion.section>
    )
}
