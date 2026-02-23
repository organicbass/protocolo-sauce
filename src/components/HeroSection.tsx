'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import HeroImg from '@/assets/Hero.png'
import Img000 from '@/assets/000.png'
import Img001 from '@/assets/001.png'
import GlassCube from './GlassCube'

interface HeroSectionProps {
    onStart: () => void
}

export default function HeroSection({ onStart }: HeroSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Parallax Motion Values
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth springs for camera/parallax movement
    const springConfig = { damping: 25, stiffness: 150 }
    const smoothX = useSpring(mouseX, springConfig)
    const smoothY = useSpring(mouseY, springConfig)


    // New Background Layers (Parallax Depth)
    const layer000X = useTransform(smoothX, [-500, 500], [15, -15])
    const layer000Y = useTransform(smoothY, [-500, 500], [15, -15])
    const layer001X = useTransform(smoothX, [-500, 500], [18, -18])
    const layer001Y = useTransform(smoothY, [-500, 500], [12, -12])

    const charX = useTransform(smoothX, [-500, 500], [35, -35])
    const charY = useTransform(smoothY, [-500, 500], [15, -15])
    const particlesX = useTransform(smoothX, [-500, 500], [50, -50])
    const particlesY = useTransform(smoothY, [-500, 500], [50, -50])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const moveX = clientX - window.innerWidth / 2
            const moveY = clientY - window.innerHeight / 2
            mouseX.set(moveX)
            mouseY.set(moveY)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    // Particle system for background
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Particles
        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            opacity: number
            color: string

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 2 + 1 // Balanced size
                this.speedX = (Math.random() - 0.5) * 0.2
                this.speedY = Math.random() * 2 + 0.5 // Always falling down like 'drops'
                this.opacity = Math.random() * 0.7 + 0.3
                this.color = Math.random() > 0.5 ? '#adec19' : '#eceb21'
            }

            update(mX: number, mY: number) {
                // React to mouse (parallax-like influence)
                const dx = (mX + window.innerWidth / 2) - this.x
                const dy = (mY + window.innerHeight / 2) - this.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < 150) {
                    this.x -= dx * 0.01
                    this.y -= dy * 0.01
                    this.opacity = Math.min(this.opacity + 0.02, 0.8)
                } else {
                    this.opacity = Math.max(this.opacity - 0.005, 0.1)
                }

                this.x += this.speedX
                this.y += this.speedY

                if (this.x < 0) this.x = canvas!.width
                if (this.x > canvas!.width) this.x = 0
                if (this.y < 0) this.y = canvas!.height
                if (this.y > canvas!.height) this.y = 0
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.globalAlpha = this.opacity

                // Add glow effect
                ctx.shadowBlur = 10
                ctx.shadowColor = this.color

                ctx.fill()

                // Reset shadow for next draws
                ctx.shadowBlur = 0
                ctx.globalAlpha = 1
            }
        }

        const particles: Particle[] = []
        const particleCount = Math.min(200, Math.floor(canvas.width * canvas.height / 10000)) // More drops
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update particles with smooth mouse influence
            particles.forEach(p => {
                p.update(smoothX.get(), smoothY.get())
                p.draw()
            })

            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [smoothX, smoothY])

    // Cache busting for dynamic assets during dev
    const [imageVersion] = useState(Date.now())

    return (
        <motion.section
            className="relative w-screen h-screen overflow-hidden bg-black flex flex-col cursor-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
        >
            {/* HEADER NAVIGATION */}
            <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-6 tablet:px-12 py-8 pointer-events-auto">
                <motion.div
                    className="font-heading text-neon-green text-[18px] tracking-[0.3em] uppercase"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    Protocolo Sauce
                </motion.div>

                <motion.div
                    className="flex items-center gap-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <a href="#" className="font-sans text-[10px] tablet:text-xs text-neon-green uppercase tracking-[0.2em] hover:text-white transition-colors">
                        SOBRE
                    </a>
                    <a href="https://discord.gg/8mdQpd9Y" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] tablet:text-xs bg-neon-yellow text-black px-5 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors">
                        DISCORD
                    </a>
                </motion.div>
            </nav>

            {/* PARALLAX CONTAINER */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* Layer 000 (Deepest) */}
                <motion.div
                    className="absolute inset-[-10%] z-[1] w-[120%] h-[120%]"
                    style={{ x: layer000X, y: layer000Y }}
                >
                    <Image
                        src={Img000}
                        alt="Background Depth Layer 000"
                        fill
                        className="object-cover object-center opacity-70 scale-90 tablet:scale-80"
                        priority
                    />
                </motion.div>

                {/* Layer 001 (Deep) */}
                <motion.div
                    className="absolute inset-[-10%] z-[2] w-[120%] h-[120%]"
                    style={{ x: layer001X, y: layer001Y }}
                >
                    <Image
                        src={Img001}
                        alt="Background Depth Layer 001"
                        fill
                        className="object-cover object-center scale-110 tablet:scale-100"
                        priority
                    />
                </motion.div>

                {/* Background Image Layer (Character) */}
                <motion.div
                    className="absolute inset-[-10%] z-[3] w-[120%] h-[120%]"
                    style={{ x: charX, y: charY }}
                >
                    <Image
                        src={HeroImg}
                        alt="Human Sauce Lab Character"
                        fill
                        priority
                        className="object-cover object-center scale-[1.2] tablet:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>

                {/* Particles Layer (Floating in front of images) */}
                <motion.canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-[10] w-full h-full pointer-events-none"
                    style={{ x: particlesX, y: particlesY }}
                />
            </div>

            {/* Hero Content - Positioned on the RIGHT, but text LEFT-ALIGNED */}
            <div className="relative z-[50] h-full w-full flex items-center justify-center tablet:justify-end px-6 tablet:px-12 desktop:px-32 pr-6 tablet:pr-[100px] desktop:pr-[228px] pointer-events-none">

                {/* Glass Cube Mouse Cursor */}
                <motion.div
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none hidden desktop:block"
                    style={{
                        x: smoothX,
                        y: smoothY
                    }}
                >
                    <GlassCube mouseX={smoothX} mouseY={smoothY} />
                </motion.div>

                <motion.div
                    className="flex flex-col items-start text-left max-w-[650px] pointer-events-auto"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                    {/* Heading */}
                    <h1 className="font-heading text-3xl mobile:text-4xl tablet:text-6xl desktop:text-[77px] leading-[0.9] tracking-tighter text-white uppercase mb-6 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        DOMINE AS<br />
                        FERRAMENTAS<br />
                        <span className="text-neon-yellow">DO MERCADO ATUAL</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="font-sans font-light text-sm tablet:text-base desktop:text-[23px] text-white/90 mb-10 max-w-[650px] leading-relaxed">
                        Eu te ensino a utilizar as ferramentas de ponta do mercado atual para converter dias de trabalho em minutos de criação e a fatura <span className="font-bold text-neon-green">muito mais</span>
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={onStart}
                        className="group relative px-12 py-5 bg-[#eceb21] text-black font-sans font-black text-lg tablet:text-xl desktop:text-[25px] uppercase tracking-[0.1em] rounded-none hover:shadow-[0_0_40px_rgba(236,235,33,0.5)] transition-all overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10">SAIBA MAIS</span>
                        {/* Glossy shine effect */}
                        <motion.div
                            className="absolute top-0 left-[-100%] w-[50%] h-full bg-white/30 skew-x-[-25deg] z-0"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </motion.button>
                </motion.div>
            </div>

            {/* Decorative scanlines */}
            <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.03] animate-scanline bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        </motion.section>
    )
}
