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
            className="relative w-screen h-screen overflow-hidden bg-black flex flex-col justify-center items-end px-6 tablet:px-32 desktop:px-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background HUD Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />
                <motion.div
                    className="absolute inset-0 border-[20px] border-neon-yellow/5"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            {/* Bio-Scan Animation Overlay (Left Side) */}
            <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-1/3 h-2/3 pointer-events-none hidden desktop:block">
                <motion.div
                    className="w-full h-full border-l border-neon-green/30 relative"
                    initial={{ height: 0 }}
                    animate={{ height: '66%' }}
                >
                    <Microscope className="w-12 h-12 text-neon-green absolute -top-6 -left-6 opacity-50" />
                    <motion.div
                        className="absolute top-0 left-0 w-full h-[2px] bg-neon-green shadow-[0_0_15px_#adec19]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute bottom-4 left-4 font-heading text-[10px] text-neon-green/50 tracking-widest uppercase">
                        System.scan_in_progress...<br />
                        Targeting_detected.
                    </div>
                </motion.div>
            </div>

            {/* Right Aligned Content */}
            <div className="relative z-10 flex flex-col items-end text-right max-w-[800px]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-heading text-5xl tablet:text-7xl desktop:text-[5rem] leading-[0.9] text-white uppercase mb-4 tracking-tighter">
                        PARA QUEM É O<br />
                        <span className="text-neon-yellow">HUMAN SAUCE LAB?</span>
                    </h2>
                    <p className="font-sans font-light text-muted text-base tablet:text-lg mb-12 max-w-[500px] ml-auto">
                        Protocolo Bio-Identificado. Se você se enquadra em um dos perfis abaixo, o acesso foi autorizado.
                    </p>
                </motion.div>

                {/* Bio-Cards / List */}
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
                                <div className="p-2 border border-neon-yellow/30 bg-black/50">
                                    {item.icon}
                                </div>
                            </div>
                            <p className="font-sans text-xs tablet:text-sm text-muted/80 leading-relaxed font-light">
                                {item.description}
                            </p>

                            {/* Scan Corner Decorators */}
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-yellow/20" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/5" />
                        </motion.div>
                    ))}
                </div>

                {/* Next CTA */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <button
                        onClick={onNext}
                        className="font-heading text-sm text-neon-green hover:text-white flex items-center gap-3 tracking-[0.3em] transition-colors group"
                    >
                        PRÓXIMO PROTOCOLO
                        <div className="w-12 h-[1px] bg-neon-green group-hover:w-20 transition-all" />
                        <ShieldCheck className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>

            {/* Decorative hud text */}
            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
                <div className="font-sans text-[8px] text-white tracking-[0.5em]">AUTH_KEY: HSL_003_ALPHA</div>
                <div className="font-sans text-[8px] text-white tracking-[0.5em]">STATUS: IDENTIFIED</div>
            </div>
        </motion.section>
    )
}
