'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Zap, Target, Cpu } from 'lucide-react'
import Img003 from '@/assets/003.png'
import GlassCube from './GlassCube'

const modules = [
    {
        id: '01',
        title: 'Implementação de Fluxo de\u00A0Trabalho',
        description: 'Chega de perder horas testando prompts ou pagando por ferramentas que você não usa. Aprenda a configurar seu próprio agente de IA e descubra o ecossistema exato para gerar resultados profissionais',
        icon: <Cpu className="w-6 h-6" />,
        status: 'Acesso em breve',
    },
    {
        id: '02',
        title: 'Design de Conversão',
        description: 'Multiplique sua capacidade de entrega. Aprenda a transformar referências em dezenas de artes de alta conversão em menos de 30 minutos, escalando seus contratos sem trabalhar horas a mais.',
        icon: <Target className="w-6 h-6" />,
        status: 'Acesso em breve',
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
                this.opacity = Math.random() * 0.7 + 0.3
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

    return (
        <motion.section
            ref={sectionRef}
            className="relative w-screen min-h-screen bg-black overflow-hidden pt-20 pb-10 px-6 tablet:px-12 desktop:px-32 cursor-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
        >
            {/* Glass Cube Cursor */}
            <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none hidden desktop:block"
                style={{
                    x: smoothX,
                    y: smoothY
                }}
            >
                <GlassCube mouseX={smoothX} mouseY={smoothY} />
            </motion.div>

            {/* Glitch Overlay Initial Effect */}
            {glitching && (
                <div className="absolute inset-0 z-[100] bg-neon-green/10 pointer-events-none animate-glitch" />
            )}

            {/* Background Character Layer with Parallax */}
            <motion.div
                className="absolute inset-[-10%] z-0 pointer-events-none w-[120%] h-[120%]"
                style={{ x: bgX, y: bgY }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
            >
                <Image
                    src={Img003}
                    alt="Background Character"
                    className="absolute opacity-50 object-cover tablet:object-none"
                    style={{ top: '150px', right: '0px', tablet: { right: '200px' }, maxHeight: '100%', width: 'auto' } as any}
                    width={800}
                    height={1200}
                    priority
                />
            </motion.div>

            {/* Particles Layer (Faiscas) */}
            <motion.canvas
                ref={canvasRef}
                className="absolute inset-[-5%] z-[1] w-[110%] h-[110%] pointer-events-none"
                style={{ x: particlesX, y: particlesY }}
            />

            <motion.div
                className="relative z-10 max-w-7xl mx-auto -translate-y-[10px]"
                style={{ x: containerX, y: containerY }}
            >
                {/* Header Section */}
                <div className="mb-12 flex flex-col items-center tablet:items-start text-center tablet:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="w-12 h-[2px] bg-neon-green" />
                        <span className="font-sans text-[10px] tablet:text-xs text-neon-green font-bold uppercase tracking-[0.4em]">
                            Protocolo Sauce
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="font-heading text-4xl mobile:text-5xl tablet:text-7xl leading-none text-white uppercase tracking-tighter flex flex-wrap"
                    >
                        {'MÓDULOS INICIAIS'.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                className="inline-block origin-bottom cursor-default"
                                whileHover={{ scale: 1.6, color: '#eceb21', textShadow: '0 0 30px rgba(236,235,33,0.6)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                style={{ display: char === ' ' ? 'inline-block' : undefined, width: char === ' ' ? '0.3em' : undefined }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 font-sans font-light text-white/50 max-w-xl text-xs tablet:text-base desktop:text-[18px] leading-relaxed"
                    >
                        A estrutura passo a passo para dominar a criação com IA. Da escolha da ferramenta única até a automação do seu processo.
                    </motion.p>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-2">
                    {modules.map((module, index) => (
                        <div key={module.id} className="flex flex-col gap-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative bg-[#0a0a0a] p-8 tablet:p-10 border border-white/5 hover:border-neon-green transition-all duration-300 h-full"
                            >
                                {/* Card Corner Trim */}
                                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                                    <div className="absolute top-0 right-0 w-[120%] h-[2px] bg-white/10 group-hover:bg-neon-green rotate-45 translate-x-1/2 -translate-y-1/2" />
                                </div>

                                {/* Module Identifier */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 border border-white/10 text-white/40 group-hover:text-neon-green group-hover:border-neon-green/50 transition-colors">
                                        {module.icon}
                                    </div>
                                    <span className="font-heading text-2xl text-white/10 group-hover:text-neon-green/20 transition-colors">
                                        {module.id}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="font-heading text-2xl text-white mb-4 uppercase tracking-tight group-hover:text-neon-yellow transition-colors">
                                    {module.title}
                                </h3>
                                <p className="font-sans font-light text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                    {module.description}
                                </p>

                                {/* Decorative System Scanning (Hover) */}
                                <div className="absolute left-0 right-0 h-[1px] bg-neon-green/40 bottom-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                {/* Status Indicator */}
                                <div className="mt-8 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 animate-pulse ${module.status === 'Acesso em breve' ? 'bg-white/20' : 'bg-neon-green'}`} />
                                    <span className={`font-sans text-[8px] uppercase tracking-[0.2em] ${module.status === 'Acesso em breve' ? 'text-white/20' : 'text-neon-green/40'}`}>
                                        {module.status}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Button below each module */}
                            <motion.div
                                className="flex gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                            >
                                <button
                                    onClick={() => onModuleClick?.(module.id)}
                                    className="w-full py-4 bg-[#111] hover:bg-neon-yellow/20 text-[11px] text-white/50 hover:text-neon-yellow font-sans font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-neon-yellow/30"
                                >
                                    Como funciona?
                                </button>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Footer Accent */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-12 pt-8 border-t border-white/5 flex flex-col tablet:flex-row justify-between items-center gap-6"
                >
                    <div className="flex gap-4">
                        <div className="w-24 h-1 bg-neon-green/20" />
                        <div className="w-12 h-1 bg-neon-yellow/20" />
                    </div>
                    <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.5em]">
                        H.S.L PROTOCOLO
                    </span>
                </motion.div>

                {/* CTA to Next Section */}
                <motion.div
                    className="mt-2 flex justify-center pb-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 }}
                >
                    <button
                        onClick={onNext}
                        className="group relative px-10 py-4 bg-transparent border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden"
                    >
                        <span className="relative z-10 transition-colors duration-500 text-[14px] desktop:text-[16px]">PARA QUEM É O PROTOCOLO ?</span>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                        <motion.div
                            className="absolute inset-0 bg-neon-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                        />
                    </button>
                </motion.div>
            </motion.div>
        </motion.section>
    )
}
