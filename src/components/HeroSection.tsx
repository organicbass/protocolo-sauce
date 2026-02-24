'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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

    // Transform values for different layers (parallax depth)
    const bgX = useTransform(smoothX, [-500, 500], [15, -15])
    const bgY = useTransform(smoothY, [-500, 500], [15, -15])

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
        let currentX = 0
        let currentY = 0

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
            {/* PC VIEW (>= 1200px) */}
            <div className="hidden pc:flex flex-col w-full h-full relative cursor-none">
                <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-8 pointer-events-auto">
                    <div className="font-heading text-neon-green text-[18px] tracking-[0.3em] uppercase">Protocolo Sauce</div>
                    <div className="flex items-center gap-8">
                        <a href="#" className="font-sans text-xs text-neon-green uppercase tracking-[0.2em] hover:text-white transition-colors">SOBRE</a>
                        <a href="https://discord.gg/8mdQpd9Y" target="_blank" rel="noopener noreferrer" className="font-sans text-xs bg-neon-yellow text-black px-5 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors">DISCORD</a>
                    </div>
                </nav>

                <div className="absolute inset-0 z-0">
                    <motion.div className="absolute inset-[-10%] z-[1] w-[120%] h-[120%]" style={{ x: layer000X, y: layer000Y }}>
                        <Image src={`/000.png?v=${imageVersion}`} alt="BG" fill className="object-cover opacity-70" />
                    </motion.div>
                    <motion.div className="absolute inset-[-10%] z-[2] w-[120%] h-[120%]" style={{ x: layer001X, y: layer001Y }}>
                        <Image src={`/001.png?v=${imageVersion}`} alt="BG Layer 1" fill className="object-cover" />
                    </motion.div>
                    <motion.div className="absolute inset-[-10%] z-[3] w-[120%] h-[120%]" style={{ x: charX, y: charY }}>
                        <Image src={`/Hero.png?v=${imageVersion}`} alt="Hero Character" fill className="object-cover pc:scale-105" priority />
                    </motion.div>
                    <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none" />
                </div>

                <div className="relative z-50 h-full flex items-center justify-end px-32 pr-[228px] pointer-events-none">
                    <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none" style={{ x: smoothX, y: smoothY }}>
                        <GlassCube mouseX={smoothX} mouseY={smoothY} />
                    </motion.div>
                    <div className="flex flex-col items-start text-left max-w-[650px] pointer-events-auto">
                        <h1 className="font-heading text-[77px] leading-[0.9] tracking-tighter text-white uppercase mb-6">DOMINE AS<br />FERRAMENTAS<br /><span className="text-neon-yellow">DO MERCADO ATUAL</span></h1>
                        <p className="font-sans font-light text-[23px] text-white/90 mb-10 leading-relaxed">Eu te ensino a utilizar as ferramentas de ponta do mercado atual para converter dias de trabalho em minutos de criação e a fatura <span className="font-bold text-neon-green">muito mais</span></p>
                        <button onClick={onStart} className="px-12 py-5 bg-[#eceb21] text-black font-sans font-black text-[25px] uppercase tracking-[0.1em] hover:shadow-[0_0_40px_rgba(236,235,33,0.5)] transition-all">SAIBA MAIS</button>
                    </div>
                </div>
            </div>

            {/* TABLET VIEW (810px - 1199px) */}
            <div className="hidden tablet:flex pc:hidden flex-col w-screen h-screen relative bg-black">
                <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-8">
                    <div className="font-heading text-neon-green text-[18px] tracking-[0.3em] uppercase">Protocolo Sauce</div>
                    <div className="flex items-center gap-8">
                        <a href="#" className="font-sans text-xs text-neon-green uppercase tracking-[0.2em] hover:text-white transition-colors">SOBRE</a>
                        <a href="https://discord.gg/8mdQpd9Y" target="_blank" rel="noopener noreferrer" className="font-sans text-xs bg-neon-yellow text-black px-5 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors">DISCORD</a>
                    </div>
                </nav>

                <div className="absolute inset-0 z-0">
                    <Image
                        src={`/Hero.png?v=${imageVersion}`}
                        alt="Hero Tablet"
                        fill
                        className="object-cover object-center scale-105"
                        priority
                    />
                    {/* PC-style overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/60" />
                </div>

                {/* Container on the right side (like PC), but text internal is left-aligned */}
                <div className="relative z-10 h-full flex items-center justify-end px-12 pr-20 pointer-events-none">
                    <div className="flex flex-col items-start text-left max-w-[450px] pointer-events-auto">
                        <h1 className="font-heading text-6xl leading-[0.9] tracking-tighter text-white uppercase mb-8">
                            DOMINE AS<br />
                            FERRAMENTAS DO<br />
                            <span className="text-neon-yellow">MERCADO ATUAL</span>
                        </h1>
                        <p className="font-sans font-light text-lg text-white/90 mb-10 leading-relaxed">
                            Eu te ensino a utilizar as ferramentas de ponta do mercado para converter dias de trabalho em minutos de criação.
                        </p>
                        <button
                            onClick={onStart}
                            className="px-10 py-5 bg-[#eceb21] text-black font-sans font-black text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(236,235,33,0.3)]"
                        >
                            SAIBA MAIS
                        </button>
                    </div>
                </div>
            </div>
            {/* MOBILE VIEW (< 810px) */}
            <div className="flex tablet:hidden flex-col w-full min-h-screen bg-black relative overflow-x-hidden">
                {/* Image Background - "Free" version */}
                <div className="absolute top-0 left-0 w-full h-[550px] z-0">
                    <Image
                        src={`/Herocelular.png?v=${imageVersion}`}
                        alt="Hero Mobile"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
                </div>

                {/* Text Content - overlaid and shifted up */}
                <div className="relative z-10 w-full px-6 pt-[440px] pb-12 flex flex-col items-center text-center -translate-y-[145px]">
                    <div className="w-12 h-[2px] bg-neon-green mb-8" />
                    <h1 className="font-heading text-[52px] leading-[0.85] tracking-tighter text-white uppercase mb-8">
                        DOMINE AS<br />
                        FERRAMENTAS DO<br />
                        <span className="text-neon-yellow">MERCADO ATUAL</span>
                    </h1>
                    <p className="font-sans font-light text-base text-white/70 mb-10 max-w-[320px] leading-relaxed">
                        Eu te ensino a utilizar as ferramentas de ponta do mercado para converter dias de trabalho em minutos de criação.
                    </p>
                    <button
                        onClick={onStart}
                        className="w-full py-6 bg-[#eceb21] text-black font-sans font-black text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(236,235,33,0.3)]"
                    >
                        SAIBA MAIS
                    </button>
                    <div className="mt-20 opacity-10">
                        <span className="text-[10px] text-white tracking-[0.5em] uppercase">Protocolo Sauce</span>
                    </div>
                </div>
            </div>

            {/* Decorative scanlines */}
            <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.03] animate-scanline bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        </motion.section>
    )
}
