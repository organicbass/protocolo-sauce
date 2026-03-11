'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Instagram, Youtube } from 'lucide-react'

interface HeroSectionProps {
    onStart: () => void
}

export default function HeroSection({ onStart }: HeroSectionProps) {
    const sectionRef = useRef<HTMLElement>(null)
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
    const layerAnimX = useTransform(smoothX, [-500, 500], [15, -15])
    const layerAnimY = useTransform(smoothY, [-500, 500], [15, -15])

    const charX = useTransform(smoothX, [-500, 500], [35, -35])
    const charY = useTransform(smoothY, [-500, 500], [15, -15])
    const particlesX = useTransform(smoothX, [-500, 500], [50, -50])
    const particlesY = useTransform(smoothY, [-500, 500], [50, -50])

    // Frame Animation & Preloading
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const frameIndexRef = useRef(0)
    const lastTimeRef = useRef(0)
    const directionRef = useRef(1) // 1 for forward, -1 for backward

    useEffect(() => {
        let loadedCount = 0
        const totalFrames = 283 // Updated for new 283 frames
        const loadedImages: HTMLImageElement[] = new Array(totalFrames)

        for (let i = 1; i <= totalFrames; i++) {
            const img = new (window as any).Image()
            const frameNumber = String(i).padStart(3, '0')
            // Path fixed to match public/bg-frames/frames/
            img.src = `/bg-frames/frames/${frameNumber}.jpg`
            img.onload = () => {
                loadedCount++
                if (loadedCount === totalFrames) {
                    // Set images once all are loaded to ensure consistency
                    setImages([...loadedImages])
                    setIsLoaded(true)
                }
            }
            img.onerror = () => {
                console.error(`Failed to load frame: ${frameNumber}`)
                loadedCount++ // Still increment to reach totalFrames
                if (loadedCount === totalFrames) {
                    setImages([...loadedImages])
                    setIsLoaded(true)
                }
            }
            loadedImages[i - 1] = img
        }
    }, [])

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

    // Main animation loop (Background + Particles)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        let animationId: number

        const resize = () => {
            if (canvas) {
                canvas.width = window.innerWidth
                canvas.height = sectionRef.current?.offsetHeight || window.innerHeight
            }
        }
        resize()
        window.addEventListener('resize', resize)

        class Particle {
            x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string
            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 2 + 1
                this.speedX = (Math.random() - 0.5) * 0.2
                this.speedY = Math.random() * 2 + 0.5
                this.opacity = Math.random() * 0.7 + 0.3
                this.color = Math.random() > 0.5 ? '#adec19' : '#eceb21'
            }
            update(mX: number, mY: number) {
                const dx = (mX + window.innerWidth / 2) - this.x
                const dy = (mY + window.innerHeight / 2) - this.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 150) {
                    this.x -= dx * 0.01; this.y -= dy * 0.01
                    this.opacity = Math.min(this.opacity + 0.02, 0.8)
                } else {
                    this.opacity = Math.max(this.opacity - 0.005, 0.1)
                }
                this.x += this.speedX; this.y += this.speedY
                if (this.x < 0) this.x = canvas!.width
                if (this.x > canvas!.width) this.x = 0
                if (this.y < 0) this.y = canvas!.height
                if (this.y > canvas!.height) this.y = 0
            }
            draw() {
                if (!ctx) return
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color; ctx.globalAlpha = this.opacity
                ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.fill()
                ctx.shadowBlur = 0; ctx.globalAlpha = 1
            }
        }

        const particles: Particle[] = []
        const particleCount = Math.min(200, Math.floor(canvas.width * canvas.height / 10000))
        for (let i = 0; i < particleCount; i++) particles.push(new Particle())

        function animate(time: number) {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 1. Draw Background Frame
            if (images.length > 0) {
                const deltaTime = time - lastTimeRef.current
                if (deltaTime > 33) { // 30fps for smooth video fluidity
                    // Simple cycle loop
                    frameIndexRef.current = (frameIndexRef.current + 1) % images.length
                    lastTimeRef.current = time
                }

                const currentImg = images[frameIndexRef.current]
                if (currentImg && currentImg.complete) {
                    // Parallax for Background
                    const px = smoothX.get() * 0.05
                    const py = smoothY.get() * 0.05

                    ctx.save()
                    ctx.globalAlpha = 0.22 // Reduced by 3 (from 0.25 to 0.22) as requested

                    // Object-cover style drawing
                    const canvasRatio = canvas.width / canvas.height
                    const imgRatio = currentImg.width / currentImg.height
                    let drawWidth = canvas.width
                    let drawHeight = canvas.height
                    let offsetX = 0
                    let offsetY = 0

                    if (canvasRatio > imgRatio) {
                        drawHeight = canvas.width / imgRatio
                        offsetY = (canvas.height - drawHeight) / 2
                    } else {
                        drawWidth = canvas.height * imgRatio
                        offsetX = (canvas.width - drawWidth) / 2
                    }

                    // Apply Parallax and Scale for better coverage
                    const scaleFactor = 1.1
                    ctx.drawImage(
                        currentImg,
                        offsetX - (drawWidth * (scaleFactor - 1) / 2) + px,
                        offsetY - (drawHeight * (scaleFactor - 1) / 2) + py,
                        drawWidth * scaleFactor,
                        drawHeight * scaleFactor
                    )
                    ctx.restore()

                    // 1.5 Draw Cinematic Vignette
                    ctx.save()
                    const gradient = ctx.createRadialGradient(
                        canvas.width / 2, canvas.height / 2, 0,
                        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
                    )
                    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
                    ctx.fillStyle = gradient
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.restore()
                }
            }

            // 2. Draw Particles
            particles.forEach(p => { p.update(smoothX.get(), smoothY.get()); p.draw() })

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [images]) // Re-run when images are loaded

    const [imageVersion] = useState(Date.now())

    return (
        <motion.section
            ref={sectionRef}
            className="relative w-screen h-screen overflow-hidden bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {/* Background Canvas - Single instance for all views */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
            />

            {/* PC VIEW (>= 1200px) */}
            <div className="hidden pc:flex flex-col w-full h-full relative">
                <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-8 pointer-events-auto">
                    <div className="font-heading text-neon-green text-[18px] tracking-[0.3em] uppercase">Protocolo Sauce</div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 mr-4 border-r border-white/10 pr-6">
                            <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Instagram size={20} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Youtube size={20} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                        <a href="#" className="font-sans text-xs text-neon-green uppercase tracking-[0.2em] hover:text-white transition-colors">SOBRE</a>
                        <a href="https://discord.gg/8mdQpd9Y" target="_blank" rel="noopener noreferrer" className="font-sans text-xs bg-neon-yellow text-black px-5 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors">DISCORD</a>
                    </div>
                </nav>

                <div className="absolute inset-0 z-[2]">
                    <motion.div className="absolute inset-[-10%] z-[3] w-[120%] h-[120%]" style={{ x: charX, y: charY }}>
                        <Image src={`/Hero.png?v=${imageVersion}`} alt="Hero Character" fill className="object-cover pc:scale-105" quality={100} priority />
                    </motion.div>
                </div>

                <div className="relative z-50 h-full flex items-center justify-end px-32 pr-[228px] pointer-events-none">
                    <div className="flex flex-col items-start text-left max-w-[650px] pointer-events-auto">
                        <h1 className="font-heading text-[77px] leading-[0.9] tracking-tighter text-white uppercase mb-6">DOMINE AS<br />FERRAMENTAS<br /><span className="text-neon-yellow">DO MERCADO ATUAL</span></h1>
                        <p className="font-sans font-light text-[23px] text-white/90 mb-10 leading-relaxed">Eu te ensino a utilizar as ferramentas de ponta do mercado atual para converter dias de trabalho em minutos de criação e a fatura <span className="font-bold text-neon-green">muito mais</span></p>
                        <button
                            onClick={onStart}
                            className="group relative px-12 py-5 border border-neon-yellow/30 text-neon-yellow font-sans font-black text-[25px] uppercase tracking-[0.1em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden animate-shimmer"
                        >
                            <span className="relative z-10">SAIBA MAIS</span>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLET VIEW (810px - 1199px) */}
            <div className="hidden tablet:flex pc:hidden flex-col w-screen h-screen relative bg-black">
                <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-8">
                    <div className="font-heading text-neon-green text-[18px] tracking-[0.3em] uppercase">Protocolo Sauce</div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 mr-4 border-r border-white/10 pr-6">
                            <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Instagram size={20} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Youtube size={20} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                        <a href="#" className="font-sans text-xs text-neon-green uppercase tracking-[0.2em] hover:text-white transition-colors">SOBRE</a>
                        <a href="https://discord.gg/8mdQpd9Y" target="_blank" rel="noopener noreferrer" className="font-sans text-xs bg-neon-yellow text-black px-5 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors">DISCORD</a>
                    </div>
                </nav>

                <div className="absolute inset-0 z-[2]">
                    <Image
                        src={`/Hero.png?v=${imageVersion}`}
                        alt="Hero Tablet"
                        fill
                        className="object-cover object-center scale-105"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/60" />
                </div>

                <div className="relative z-20 h-full flex items-center justify-end px-12 pr-20 pointer-events-none">
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
                            className="group relative px-10 py-5 border border-neon-yellow/30 text-neon-yellow font-sans font-black text-xl uppercase tracking-widest transition-all duration-500 overflow-hidden hover:bg-neon-yellow hover:text-black animate-shimmer"
                        >
                            <span className="relative z-10">SAIBA MAIS</span>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE VIEW (< 810px) */}
            <div className="flex tablet:hidden flex-col w-full min-h-screen bg-black relative overflow-x-hidden">
                <div className="absolute top-0 left-0 w-full h-[550px] z-[2]">
                    <Image
                        src={`/Herocelular.png?v=${imageVersion}`}
                        alt="Hero Mobile"
                        fill
                        className="object-cover object-top"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
                </div>

                <div className="relative z-20 w-full px-6 pt-[440px] pb-12 flex flex-col items-center text-center -translate-y-[145px]">
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
                        className="group relative w-full py-6 border border-neon-yellow/30 text-neon-yellow font-sans font-black text-xl uppercase tracking-widest transition-all duration-500 overflow-hidden hover:bg-neon-yellow hover:text-black animate-shimmer"
                    >
                        <span className="relative z-10">SAIBA MAIS</span>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                    </button>
                    <div className="flex items-center gap-8 mt-10">
                        <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                            <Instagram size={28} />
                        </a>
                        <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                            <Youtube size={28} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative scanlines */}
            <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.03] animate-scanline bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        </motion.section>
    )
}
