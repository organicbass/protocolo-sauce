'use client'
import { motion, MotionValue, useTransform } from 'framer-motion'

interface GlassCubeProps {
    mouseX: MotionValue<number>
    mouseY: MotionValue<number>
}

export default function GlassCube({ mouseX, mouseY }: GlassCubeProps) {
    // Constant rotation for a dynamic feel
    const rotateX = useTransform(mouseY, [-500, 500], [45, -45])
    const rotateY = useTransform(mouseX, [-500, 500], [-45, 45])

    const faceStyle = "absolute inset-0 border border-white/60 backdrop-blur-[10px] bg-white/[0.08] shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"

    return (
        <motion.div
            className="relative w-12 h-12"
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateZ: [0, 360],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            {/* Each face is 48px wide/high. translateZ is half (24px) */}
            <div className={faceStyle} style={{ transform: 'rotateY(0deg) translateZ(24px)' }} />
            <div className={faceStyle} style={{ transform: 'rotateY(180deg) translateZ(24px)' }} />
            <div className={faceStyle} style={{ transform: 'rotateY(90deg) translateZ(24px)' }} />
            <div className={faceStyle} style={{ transform: 'rotateY(-90deg) translateZ(24px)' }} />
            <div className={faceStyle} style={{ transform: 'rotateX(90deg) translateZ(24px)' }} />
            <div className={faceStyle} style={{ transform: 'rotateX(-90deg) translateZ(24px)' }} />
        </motion.div>
    )
}
