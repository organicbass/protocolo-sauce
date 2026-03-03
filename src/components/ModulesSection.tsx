'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { Shield, Zap, Target, BarChart3, Binary, Cpu, Instagram, Youtube } from 'lucide-react'

const modules = [
    {
        id: '01',
        title: 'Implementação de Fluxo de\u00A0Trabalho',
        description: 'Chega de perder horas testando prompts ou pagando por ferramentas que você não usa. Aprenda a configurar seu próprio agente de IA e descubra o ecossistema exato para gerar resultados profissionais',
        icon: <Cpu className="w-6 h-6" />,
        status: 'Disponível para Acesso',
    },
    {
        id: '02',
        title: 'Design de Conversão',
        description: 'Multiplique sua capacidade de entrega. Aprenda a transformar referências em dezenas de artes de alta conversão em menos de 30 minutos, escalando seus contratos sem trabalhar horas a mais.',
        icon: <Target className="w-6 h-6" />,
        status: 'Disponível para Acesso',
    },
    {
        id: '03',
        title: 'Mentoria 1x1',
        description: 'Acompanhamento direto para escala individual e refinamento de\u00A0operação.',
        icon: <Zap className="w-6 h-6" />,
        status: 'Disponível para Acesso',
    },
]

interface ModulesSectionProps {
    onNext?: () => void
    onModuleClick?: (moduleId: string) => void
}

export default function ModulesSection({ onNext, onModuleClick }: ModulesSectionProps) {
    const [glitching, setGlitching] = useState(true)
    const sectionRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [imageVersion] = useState(Date.now())

    // Parallax Motion Values
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth springs
    const springConfig = { damping: 25, stiffness: 150 }
    const smoothX = useSpring(mouseX, springConfig)
    const smoothY = useSpring(mouseY, springConfig)

    // Camera/Container Transforms
    const containerX = useTransform(smoothX, [-500, 500], [20, -20])
    const containerY = useTransform(smoothY, [-500, 500], [10, -10])

    // Deeper parallax for background lines
    const bgX = useTransform(smoothX, [-500, 500], [40, -40])
    const bgY = useTransform(smoothY, [-500, 500], [20, -20])

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

    // Particle system (Faiscas/Drops)
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
                this.size = Math.random() * 2 + 1
                this.speedX = (Math.random() - 0.5) * 0.2
                this.speedY = Math.random() * 2 + 0.5
                this.opacity = Math.random() * 0.4 + 0.1
                this.color = Math.random() > 0.5 ? '#adec19' : '#eceb21'
            }

            update(mX: number, mY: number) {
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
                ctx.shadowBlur = 10
                ctx.shadowColor = this.color
                ctx.fill()
                ctx.shadowBlur = 0
                ctx.globalAlpha = 1
            }
        }

        const particles: Particle[] = []
        const particleCount = Math.min(200, Math.floor(canvas.width * canvas.height / 10000))
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
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

    useEffect(() => {
        // End glitch effect after 1.2s
        const timer = setTimeout(() => setGlitching(false), 1200)
        return () => clearTimeout(timer)
    }, [])

    /* ── Reusable card renderer ── */
    const renderModuleCard = (module: typeof modules[0]) => (
        <div key={module.id} className="flex flex-col gap-2">
            <motion.div className="group relative bg-[#0a0a0a] p-10 border border-white/5 hover:border-neon-green transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[120%] h-[2px] bg-white/10 group-hover:bg-neon-green rotate-45 translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 border border-white/10 text-white/40 group-hover:text-neon-green group-hover:border-neon-green/50 transition-colors uppercase">{module.icon}</div>
                    <span className="font-heading text-2xl text-white/10 group-hover:text-neon-green/20 transition-colors">{module.id}</span>
                </div>
                <h3 className="font-heading text-2xl text-white mb-4 uppercase tracking-tight group-hover:text-neon-yellow transition-colors">{module.title}</h3>
                <p className="font-sans font-light text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{module.description}</p>
                <div className="absolute left-0 right-0 h-[1px] bg-neon-green/40 bottom-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="mt-8 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 animate-pulse ${module.status === 'Acesso em breve' ? 'bg-white/20' : 'bg-neon-green'}`} />
                    <span className={`font-sans text-[8px] uppercase tracking-[0.2em] ${module.status === 'Acesso em breve' ? 'text-white/20' : 'text-neon-green/40'}`}>{module.status}</span>
                </div>
            </motion.div>
            <button onClick={() => onModuleClick?.(module.id)} className="w-full py-4 bg-[#111] hover:bg-neon-yellow/20 text-[11px] text-white/50 hover:text-neon-yellow font-sans font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-neon-yellow/30">Como funciona?</button>
        </div>
    )

    return (
        <motion.section
            ref={sectionRef}
            className="relative w-screen min-h-screen bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
        >

            {/* Particles — shared */}
            <motion.canvas
                ref={canvasRef}
                className="absolute inset-[-5%] z-[1] w-[110%] h-[110%] pointer-events-none"
                style={{ x: particlesX, y: particlesY }}
            />

            {/* ===== PC VIEW (≥ 1200px) ===== */}
            <div className="hidden pc:block w-full h-screen overflow-hidden pt-20 pb-10 px-32">
                <motion.div
                    className="absolute inset-[-10%] z-0 pointer-events-none w-[120%] h-[120%]"
                    style={{ x: bgX, y: bgY }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                >
                    <img
                        src={`/003.png?v=${imageVersion}`}
                        alt="Background Character"
                        className="absolute opacity-20 top-[150px] right-[200px] scale-100 max-h-full w-auto saturate-[0.3] brightness-[0.7]"
                    />
                </motion.div>

                <motion.div className="relative z-10 max-w-7xl mx-auto -translate-y-[10px]" style={{ x: containerX, y: containerY }}>
                    <div className="mb-12 flex justify-between items-end">
                        <div className="flex flex-col items-start text-left">
                            <motion.div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-[2px] bg-neon-green" />
                                <span className="font-sans text-xs text-neon-green font-bold uppercase tracking-[0.4em]">Protocolo Sauce</span>
                            </motion.div>
                            <h2 className="font-heading text-7xl leading-none text-white uppercase tracking-tighter flex gap-[0.1em]">
                                {"MÓDULOS INICIAIS".split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        whileHover={{ scale: 1.3, color: '#adec19', y: -5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                            <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Instagram size={24} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer"
                                className="group relative p-2 border border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black transition-all duration-300">
                                <Youtube size={24} className="relative z-10" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                    <p className="mb-10 font-sans font-light text-white/50 max-w-xl text-base leading-relaxed">
                        A estrutura passo a passo para dominar a criação com IA. Da escolha da ferramenta única até a automação do seu processo.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                        {modules.map(renderModuleCard)}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="w-24 h-1 bg-neon-green/20" />
                            <div className="w-12 h-1 bg-neon-yellow/20" />
                        </div>
                        <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.5em]">H.S.L PROTOCOLO</span>
                    </div>
                    <div className="mt-2 flex justify-center pb-12">
                        <button onClick={onNext} className="group relative px-10 py-4 border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden animate-shimmer">
                            <span className="relative z-10 text-[14px]">PARA QUEM É O PROTOCOLO ?</span>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ===== TABLET VIEW (810px – 1199px) ===== */}
            <div className="hidden tablet:block pc:hidden w-full h-screen overflow-y-auto pt-20 pb-10 px-12">
                <motion.div
                    className="absolute inset-[-10%] z-0 pointer-events-none w-[120%] h-[120%]"
                    style={{ x: bgX, y: bgY }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
                >
                    <img
                        src={`/003.png?v=${imageVersion}`}
                        alt="Background Character"
                        className="absolute opacity-20 top-[150px] right-[40px] scale-[0.8] max-h-full w-auto saturate-[0.3] brightness-[0.7]"
                    />
                </motion.div>

                <motion.div className="relative z-10 max-w-7xl mx-auto -translate-y-[10px]" style={{ x: containerX, y: containerY }}>
                    <div className="mb-12 flex justify-between items-end">
                        <div className="flex flex-col items-start text-left">
                            <motion.div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-[2px] bg-neon-green" />
                                <span className="font-sans text-xs text-neon-green font-bold uppercase tracking-[0.4em]">Protocolo Sauce</span>
                            </motion.div>
                            <h2 className="font-heading text-6xl leading-none text-white uppercase tracking-tighter flex gap-[0.1em]">
                                {"MÓDULOS INICIAIS".split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        whileHover={{ scale: 1.3, color: '#adec19', y: -5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                            <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                                <Instagram size={22} />
                            </a>
                            <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                                <Youtube size={22} />
                            </a>
                        </div>
                    </div>
                    <p className="mb-10 font-sans font-light text-white/50 max-w-xl text-base leading-relaxed">
                        A estrutura passo a passo para dominar a criação com IA. Da escolha da ferramenta única até a automação do seu processo.
                    </p>

                    <div className="grid grid-cols-2 gap-10">
                        {modules.map(renderModuleCard)}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="w-24 h-1 bg-neon-green/20" />
                            <div className="w-12 h-1 bg-neon-yellow/20" />
                        </div>
                        <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.5em]">H.S.L PROTOCOLO</span>
                    </div>
                    <div className="mt-2 flex justify-center pb-12">
                        <button onClick={onNext} className="group relative px-10 py-4 border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden animate-shimmer">
                            <span className="relative z-10 text-[14px]">PARA QUEM É O PROTOCOLO ?</span>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ===== MOBILE VIEW (< 810px) ===== */}
            <div className="block tablet:hidden w-full pt-20 pb-10 px-6">
                <div className="flex flex-col items-center justify-start w-full gap-16 py-10">
                    <div className="flex flex-col items-center text-center w-full">
                        <div className="w-full flex justify-center items-center mb-6">
                            <div className="w-12 h-[2px] bg-neon-green" />
                        </div>
                        <h2 className="font-heading text-5xl leading-none text-white uppercase tracking-tighter mb-4 flex gap-[0.1em] justify-center">
                            {"MÓDULOS".split('').map((char, i) => (
                                <motion.span
                                    key={`m-${i}`}
                                    className="inline-block"
                                    whileHover={{ scale: 1.2, color: '#adec19' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            {"\u00A0"}
                            <span className="text-neon-yellow flex gap-[0.1em]">
                                {"INICIAIS".split('').map((char, i) => (
                                    <motion.span
                                        key={`i-${i}`}
                                        className="inline-block"
                                        whileHover={{ scale: 1.2, color: '#white' }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        </h2>
                        <p className="mt-2 mb-12 font-sans font-light text-white/50 text-sm leading-relaxed max-w-[280px]">
                            A estrutura passo a passo para dominar a criação com IA. Da escolha da ferramenta única até a automação do seu processo.
                        </p>
                        <div className="flex flex-col gap-10 w-full mb-16">
                            {modules.map((module) => (
                                <div key={module.id} className="flex flex-col gap-4 bg-[#0a0a0a] p-8 border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <div className="p-3 border border-neon-green/30 text-neon-green">{module.icon}</div>
                                        <span className="font-heading text-xl text-white/10">{module.id}</span>
                                    </div>
                                    <h3 className="font-heading text-2xl text-white uppercase">{module.title}</h3>
                                    <p className="font-sans font-light text-sm text-white/40">{module.description}</p>
                                    <button onClick={() => onModuleClick?.(module.id)} className="mt-4 py-4 bg-[#111] text-[11px] text-neon-yellow font-black uppercase tracking-widest border border-neon-yellow/20">Como funciona?</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={onNext} className="w-full py-5 bg-neon-yellow text-black font-sans font-black uppercase tracking-widest animate-shimmer">
                            PARA QUEM É O PROTOCOLO ?
                        </button>
                        {/* Social Icons moved below the button */}
                        <div className="flex items-center justify-center gap-8 mt-10">
                            <a href="https://www.instagram.com/humansauce.lab/" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                                <Instagram size={28} />
                            </a>
                            <a href="https://www.youtube.com/@HumanSauceLab" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-white transition-colors">
                                <Youtube size={28} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}
