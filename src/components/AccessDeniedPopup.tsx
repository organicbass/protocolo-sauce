'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldOff, X } from 'lucide-react'

interface AccessDeniedPopupProps {
    isOpen: boolean
    onClose: () => void
}

export default function AccessDeniedPopup({ isOpen, onClose }: AccessDeniedPopupProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Popup */}
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <div className="relative pointer-events-auto max-w-md w-full mx-6 bg-[#0a0a0a] border border-red-500/20 p-8 overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Corner decorations */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/50" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/50" />

                            {/* Scan line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-red-500/30"
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Content */}
                            <div className="flex flex-col items-center text-center gap-5">
                                {/* Icon */}
                                <motion.div
                                    className="w-16 h-16 rounded-full border-2 border-red-500/40 flex items-center justify-center"
                                    animate={{ boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.3)', '0 0 0px rgba(239,68,68,0)'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ShieldOff className="w-7 h-7 text-red-500" />
                                </motion.div>

                                {/* Title */}
                                <div>
                                    <motion.h3
                                        className="font-heading text-2xl tablet:text-3xl text-red-500 uppercase tracking-wider mb-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        ACESSO NEGADO
                                    </motion.h3>
                                    <motion.div
                                        className="w-16 h-[1px] bg-red-500/30 mx-auto"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    />
                                </div>

                                {/* Message */}
                                <motion.p
                                    className="font-sans text-sm text-white/40 leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Protocolo Sauce em <span className="text-neon-green font-bold">Desenvolvimento</span>.
                                    <br />
                                    <span className="text-white/20 text-xs">A jornada está sendo construída. Em breve você terá acesso.</span>
                                </motion.p>

                                {/* HUD Label */}
                                <motion.div
                                    className="flex items-center gap-2 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="w-1.5 h-1.5 bg-red-500/50 animate-pulse" />
                                    <span className="font-sans text-[8px] text-white/15 uppercase tracking-[0.5em]">
                                        H.S.L_SECURITY_PROTOCOL
                                    </span>
                                </motion.div>

                                {/* Close CTA */}
                                <motion.button
                                    onClick={onClose}
                                    className="mt-2 px-8 py-3 border border-white/10 text-[10px] text-white/30 font-sans uppercase tracking-[0.3em] hover:border-neon-green/30 hover:text-neon-green transition-all"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Entendido
                                </motion.button>
                            </div>

                            {/* Glitch effect on open */}
                            <motion.div
                                className="absolute inset-0 bg-red-500/5 pointer-events-none"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
