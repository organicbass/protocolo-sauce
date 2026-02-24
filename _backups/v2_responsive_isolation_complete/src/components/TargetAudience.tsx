'use client'
import { motion } from 'framer-motion'
import { Target, Zap, TrendingUp, ShieldCheck, Microscope } from 'lucide-react'

interface TargetAudienceProps {
    onNext: () => void
}

const bioMarkers = [
    {
        title: "DESIGNERS EM TRANSIÇÃO",
        description: "Para quem quer sair do operacional manual e dominar a escala industrial via IA.",
        icon: <Zap className="w-5 h-5" />
    },
    {
        title: "CRIATIVOS HIGH-END",
        description: "Profissionais focados em faturamento +5k/mês através de processos ultra-rápidos.",
        icon: <TrendingUp className="w-5 h-5" />
    },
    {
        title: "AGÊNCIAS DE PERFORMANCE",
        description: "Equipes que precisam converter dias de criação em minutos de entrega real.",
        icon: <Target className="w-5 h-5" />
    }
]

export default function TargetAudience({ onNext }: TargetAudienceProps) {
    return (
        <motion.section
            className="relative w-screen h-screen overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
        >
            {/* ===== PC VIEW (≥ 1200px) ===== */}
            <div className="hidden pc:flex w-full h-full flex-col justify-center items-end px-48">
                {/* Background HUD Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern overflow-hidden" />

                {/* Bio-Scan Animation Overlay */}
                <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-1/3 h-2/3 pointer-events-none">
                    <motion.div className="w-full h-full border-l border-neon-green/30 relative" initial={{ height: 0 }} animate={{ height: '66%' }}>
                        <Microscope className="w-12 h-12 text-neon-green absolute -top-6 -left-6 opacity-50" />
                        <motion.div className="absolute top-0 left-0 w-full h-[2px] bg-neon-green shadow-[0_0_15px_#adec19]" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    </motion.div>
                </div>

                {/* Content Block */}
                <div className="relative z-10 flex flex-col items-end text-right max-w-[800px]">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="font-heading text-[5rem] leading-[0.9] text-white uppercase mb-4 tracking-tighter">
                            PARA QUEM É O<br />
                            <span className="text-neon-yellow">HUMAN SAUCE LAB?</span>
                        </h2>
                        <p className="font-sans font-light text-muted text-lg mb-12 max-w-[500px] ml-auto">
                            Protocolo Bio-Identificado. Se você se enquadra em um dos perfis abaixo, o acesso foi autorizado.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-6 w-full items-end">
                        {bioMarkers.map((item, index) => (
                            <motion.div
                                key={index}
                                className="group relative flex flex-col items-end p-6 border-r-4 border-transparent hover:border-neon-yellow bg-white/5 backdrop-blur-sm transition-all duration-300 w-full max-w-[550px]"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                whileHover={{ x: -10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <div className="flex items-center gap-4 text-neon-yellow mb-2">
                                    <span className="font-heading text-xl">{item.title}</span>
                                    <div className="p-2 border border-neon-yellow/30 bg-black/50">{item.icon}</div>
                                </div>
                                <p className="font-sans text-sm text-muted/80 leading-relaxed font-light">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div className="mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        <button onClick={onNext} className="font-heading text-sm text-neon-green hover:text-white flex items-center gap-3 tracking-[0.3em] transition-colors group">
                            PRÓXIMO PROTOCOLO
                            <div className="w-12 h-[1px] bg-neon-green group-hover:w-20 transition-all" />
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* ===== TABLET VIEW (810px – 1199px) ===== */}
            <div className="hidden tablet:flex pc:hidden w-full h-full flex-col justify-center items-end px-32">
                {/* Background HUD Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern overflow-hidden" />

                {/* Content Block */}
                <div className="relative z-10 flex flex-col items-end text-right max-w-[800px]">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="font-heading text-7xl leading-[0.9] text-white uppercase mb-4 tracking-tighter">
                            PARA QUEM É O<br />
                            <span className="text-neon-yellow">HUMAN SAUCE LAB?</span>
                        </h2>
                        <p className="font-sans font-light text-muted text-lg mb-12 max-w-[500px] ml-auto">
                            Protocolo Bio-Identificado. Se você se enquadra em um dos perfis abaixo, o acesso foi autorizado.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-6 w-full items-end">
                        {bioMarkers.map((item, index) => (
                            <motion.div
                                key={index}
                                className="group relative flex flex-col items-end p-6 border-r-4 border-transparent hover:border-neon-yellow bg-white/5 backdrop-blur-sm transition-all duration-300 w-full max-w-[550px]"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                whileHover={{ x: -10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <div className="flex items-center gap-4 text-neon-yellow mb-2">
                                    <span className="font-heading text-xl">{item.title}</span>
                                    <div className="p-2 border border-neon-yellow/30 bg-black/50">{item.icon}</div>
                                </div>
                                <p className="font-sans text-sm text-muted/80 leading-relaxed font-light">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div className="mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        <button onClick={onNext} className="font-heading text-sm text-neon-green hover:text-white flex items-center gap-3 tracking-[0.3em] transition-colors group">
                            PRÓXIMO PROTOCOLO
                            <div className="w-12 h-[1px] bg-neon-green group-hover:w-20 transition-all" />
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* ===== MOBILE VIEW (< 810px) ===== */}
            <div className="flex tablet:hidden flex-col items-center justify-center w-full px-6 py-10 text-center">
                <h2 className="font-heading text-5xl leading-[0.9] text-white uppercase mb-6 tracking-tighter">
                    PARA QUEM É O<br />
                    <span className="text-neon-yellow">HUMAN SAUCE LAB?</span>
                </h2>
                <div className="flex flex-col gap-4 w-full">
                    {bioMarkers.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-6 bg-white/5 border border-white/10">
                            <div className="text-neon-yellow mb-4 p-3 border border-neon-yellow/30">{item.icon}</div>
                            <span className="font-heading text-lg text-white mb-2 uppercase">{item.title}</span>
                            <p className="font-sans text-xs text-muted/80 font-light">{item.description}</p>
                        </div>
                    ))}
                </div>
                <button onClick={onNext} className="mt-12 w-full py-5 bg-neon-green text-black font-sans font-black uppercase tracking-widest text-xs">
                    PRÓXIMO PROTOCOLO
                </button>
            </div>

            {/* Decorative hud text */}
            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
                <div className="font-sans text-[8px] text-white tracking-[0.5em]">AUTH_KEY: HSL_003_ALPHA</div>
                <div className="font-sans text-[8px] text-white tracking-[0.5em]">STATUS: IDENTIFIED</div>
            </div>
        </motion.section>
    )
}
