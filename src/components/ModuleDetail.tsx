'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowLeft, Play } from 'lucide-react'

interface ModuleDetailProps {
    moduleId: string
    title: string
    description: string
    vslUrl?: string
    ctaText?: string
    onBack: () => void
}

export default function ModuleDetail({ moduleId, title, description, vslUrl, ctaText, onBack }: ModuleDetailProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 25, stiffness: 150 }
    const smoothX = useSpring(mouseX, springConfig)
    const smoothY = useSpring(mouseY, springConfig)
    const bgX = useTransform(smoothX, [-500, 500], [20, -20])
    const bgY = useTransform(smoothY, [-500, 500], [10, -10])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2)
            mouseY.set(e.clientY - window.innerHeight / 2)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    // Particles
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
            x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string
            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 1.5 + 0.5
                this.speedX = (Math.random() - 0.5) * 0.15
                this.speedY = Math.random() * 1.5 + 0.3
                this.opacity = Math.random() * 0.5 + 0.2
                this.color = Math.random() > 0.5 ? '#adec19' : '#eceb21'
            }
            update() {
                this.x += this.speedX
                this.y += this.speedY
                if (this.y > canvas!.height) this.y = 0
                if (this.x < 0) this.x = canvas!.width
                if (this.x > canvas!.width) this.x = 0
            }
            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.globalAlpha = this.opacity
                ctx.shadowBlur = 8
                ctx.shadowColor = this.color
                ctx.fill()
                ctx.shadowBlur = 0
                ctx.globalAlpha = 1
            }
        }

        const particles: Particle[] = []
        for (let i = 0; i < 80; i++) particles.push(new Particle())

        function animate() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach(p => { p.update(); p.draw() })
            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <motion.section
            className="relative w-screen min-h-screen bg-black overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

            {/* ===== PC VIEW (≥ 1200px) ===== */}
            <motion.div
                className="hidden pc:flex relative z-10 flex-col h-screen px-32 py-10"
                style={{ x: bgX, y: bgY }}
            >
                <motion.button onClick={onBack} className="group flex items-center gap-3 mb-12 self-start pointer-events-auto" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} whileHover={{ x: -5 }}>
                    <div className="p-2 border border-white/10 group-hover:border-neon-green transition-colors"><ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-neon-green transition-colors" /></div>
                    <span className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] group-hover:text-neon-green transition-colors">Voltar aos Módulos</span>
                </motion.button>

                <div className="flex-1 flex flex-row gap-20 items-center">
                    <div className="flex-1 flex flex-col justify-center max-w-[600px]">
                        <motion.div className="flex items-center gap-4 mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="w-10 h-[2px] bg-neon-green" />
                            <span className="font-sans text-[10px] text-neon-green font-bold uppercase tracking-[0.4em]">Módulo {moduleId}</span>
                        </motion.div>
                        <motion.h1 className="font-heading text-[72px] leading-[0.9] text-white uppercase tracking-tighter mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>{title}</motion.h1>
                        <motion.p className="font-sans font-light text-white/50 text-lg leading-relaxed mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{description}</motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <button className="group relative px-10 py-4 bg-transparent border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden pointer-events-auto">
                                <span className="relative z-10 text-[15px]">{ctaText || 'QUERO ACESSO'}</span>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                                <motion.div className="absolute inset-0 bg-neon-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </div>

                    <motion.div className="flex-1 w-full max-w-[700px]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                        <div className="relative w-full aspect-video bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                            {vslUrl ? (<iframe src={vslUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon-green/30" />
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-yellow/40 flex items-center justify-center group-hover:border-neon-yellow group-hover:bg-neon-yellow/10 transition-all duration-300"><Play className="w-6 h-6 text-neon-yellow ml-1" /></div>
                                    <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.4em]">VSL — Em breve</span>
                                    <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green/20" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="font-sans text-[8px] text-white/15 uppercase tracking-[0.5em]">H.S.L_MODULE_{moduleId}_VSL</span>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon-green/30 animate-pulse" /><span className="font-sans text-[8px] text-white/15 uppercase tracking-[0.3em]">STREAM_READY</span></div>
                        </div>
                    </motion.div>
                </div>

                <motion.div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <div className="flex gap-4"><div className="w-16 h-1 bg-neon-green/20" /><div className="w-8 h-1 bg-neon-yellow/20" /></div>
                    <span className="font-sans text-[10px] text-white/15 uppercase tracking-[0.5em]">H.S.L PROTOCOLO — MÓDULO {moduleId}</span>
                </motion.div>
            </motion.div>

            {/* ===== TABLET VIEW (810px – 1199px) ===== */}
            <motion.div
                className="hidden tablet:flex pc:hidden relative z-10 flex-col h-screen px-12 py-10"
                style={{ x: bgX, y: bgY }}
            >
                <motion.button onClick={onBack} className="group flex items-center gap-3 mb-12 self-start pointer-events-auto" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} whileHover={{ x: -5 }}>
                    <div className="p-2 border border-white/10 group-hover:border-neon-green transition-colors"><ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-neon-green transition-colors" /></div>
                    <span className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] group-hover:text-neon-green transition-colors">Voltar aos Módulos</span>
                </motion.button>

                <div className="flex-1 flex flex-col gap-12 items-center">
                    <div className="flex flex-col justify-center max-w-[600px] w-full">
                        <motion.div className="flex items-center gap-4 mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="w-10 h-[2px] bg-neon-green" />
                            <span className="font-sans text-[10px] text-neon-green font-bold uppercase tracking-[0.4em]">Módulo {moduleId}</span>
                        </motion.div>
                        <motion.h1 className="font-heading text-6xl leading-[0.9] text-white uppercase tracking-tighter mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>{title}</motion.h1>
                        <motion.p className="font-sans font-light text-white/50 text-base leading-relaxed mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{description}</motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <button className="group relative px-10 py-4 bg-transparent border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden pointer-events-auto">
                                <span className="relative z-10 text-[13px]">{ctaText || 'QUERO ACESSO'}</span>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                                <motion.div className="absolute inset-0 bg-neon-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </div>

                    <motion.div className="w-full max-w-[700px]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                        <div className="relative w-full aspect-video bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                            {vslUrl ? (<iframe src={vslUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon-green/30" />
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-yellow/40 flex items-center justify-center group-hover:border-neon-yellow group-hover:bg-neon-yellow/10 transition-all duration-300"><Play className="w-6 h-6 text-neon-yellow ml-1" /></div>
                                    <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.4em]">VSL — Em breve</span>
                                    <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green/20" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="font-sans text-[8px] text-white/15 uppercase tracking-[0.5em]">H.S.L_MODULE_{moduleId}_VSL</span>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-neon-green/30 animate-pulse" /><span className="font-sans text-[8px] text-white/15 uppercase tracking-[0.3em]">STREAM_READY</span></div>
                        </div>
                    </motion.div>
                </div>

                <motion.div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <div className="flex gap-4"><div className="w-16 h-1 bg-neon-green/20" /><div className="w-8 h-1 bg-neon-yellow/20" /></div>
                    <span className="font-sans text-[10px] text-white/15 uppercase tracking-[0.5em]">H.S.L PROTOCOLO — MÓDULO {moduleId}</span>
                </motion.div>
            </motion.div>

            {/* ===== MOBILE VIEW (< 810px) ===== */}
            <motion.div
                className="flex tablet:hidden relative z-10 flex-col min-h-screen px-6 py-10"
                style={{ x: bgX, y: bgY }}
            >
                <motion.button onClick={onBack} className="group flex items-center gap-3 mb-12 self-start pointer-events-auto" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} whileHover={{ x: -5 }}>
                    <div className="p-2 border border-white/10 group-hover:border-neon-green transition-colors"><ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-neon-green transition-colors" /></div>
                    <span className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] group-hover:text-neon-green transition-colors">Voltar aos Módulos</span>
                </motion.button>

                <div className="flex-1 flex flex-col gap-12 items-center">
                    <div className="flex flex-col justify-center w-full">
                        <motion.div className="flex items-center gap-4 mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <div className="w-10 h-[2px] bg-neon-green" />
                            <span className="font-sans text-[10px] text-neon-green font-bold uppercase tracking-[0.4em]">Módulo {moduleId}</span>
                        </motion.div>
                        <motion.h1 className="font-heading text-4xl leading-[0.9] text-white uppercase tracking-tighter mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>{title}</motion.h1>
                        <motion.p className="font-sans font-light text-white/50 text-sm leading-relaxed mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{description}</motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                            <button className="group relative px-10 py-4 bg-transparent border border-neon-yellow/30 text-neon-yellow font-sans font-bold uppercase tracking-[0.3em] hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-all duration-500 overflow-hidden pointer-events-auto">
                                <span className="relative z-10 text-[13px]">{ctaText || 'QUERO ACESSO'}</span>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-yellow" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-yellow" />
                                <motion.div className="absolute inset-0 bg-neon-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </div>

                    <motion.div className="w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                        <div className="relative w-full aspect-video bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                            {vslUrl ? (<iframe src={vslUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon-green/30" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon-green/30" />
                                    <div className="w-16 h-16 rounded-full border-2 border-neon-yellow/40 flex items-center justify-center"><Play className="w-6 h-6 text-neon-yellow ml-1" /></div>
                                    <span className="font-sans text-[10px] text-white/20 uppercase tracking-[0.4em]">VSL — Em breve</span>
                                    <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green/20" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <motion.div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <div className="flex gap-4"><div className="w-16 h-1 bg-neon-green/20" /><div className="w-8 h-1 bg-neon-yellow/20" /></div>
                    <span className="font-sans text-[10px] text-white/15 uppercase tracking-[0.5em]">H.S.L PROTOCOLO — MÓDULO {moduleId}</span>
                </motion.div>
            </motion.div>
        </motion.section>
    )
}
