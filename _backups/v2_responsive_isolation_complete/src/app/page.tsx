'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import TerminalLoader from '@/components/TerminalLoader'
import ModulesSection from '@/components/ModulesSection'
import ModuleDetail from '@/components/ModuleDetail'
import TargetAudience from '@/components/TargetAudience'
import AccessDeniedPopup from '@/components/AccessDeniedPopup'
import useAdvancedAudio from '@/hooks/useAdvancedAudio'

type Scene = 'hero' | 'loading' | 'modules' | 'module-01' | 'module-02' | 'module-03' | 'audience'

const moduleData = [
  {
    id: '01',
    title: 'Implementação de Fluxo de\u00A0Trabalho',
    description: 'Chega de perder horas testando prompts ou pagando por ferramentas que você não usa. Aprenda a configurar seu próprio agente de IA e descubra o ecossistema exato para gerar resultados profissionais.',
    vslUrl: '',
    ctaText: 'QUERO GERAR RESULTADOS',
  },
  {
    id: '02',
    title: 'Design de Conversão',
    description: 'Multiplique sua capacidade de entrega. Aprenda a transformar referências em dezenas de artes de alta conversão em menos de 30 minutos, escalando seus contratos sem trabalhar horas a mais.',
    vslUrl: '',
    ctaText: 'QUERO ESCALAR MEUS RESULTADOS',
  },
  {
    id: '03',
    title: 'Mentoria 1x1',
    description: 'Acompanhamento direto para escala individual e refinamento de\u00A0operação.',
    vslUrl: '',
    ctaText: 'QUERO MEU ACOMPANHAMENTO',
  },
]

export default function LabPage() {
  const [scene, setScene] = useState<Scene>('hero')
  const [showDenied, setShowDenied] = useState(false)
  const { initContext, loadTrack, playTrack, setFilter, setVolume, stopTrack } = useAdvancedAudio()

  useEffect(() => {
    // Preload tracks
    const preload = async () => {
      try {
        await loadTrack('hero', '/hero.mp3')
        await loadTrack('modules', '/modules.mp3')
        await loadTrack('typing', '/typing.mp3')
      } catch (e) {
        console.warn("Failed to preload some audio tracks:", e)
      }
    }
    preload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTrack])

  const handleStart = () => {
    initContext()
    playTrack('hero')
    setScene('loading')
    setFilter('hero', 400, 1.5)
    setVolume('hero', 0.2, 1.5)
  }

  const handleLoadingComplete = () => {
    stopTrack('hero', 2)
    playTrack('modules')
    setVolume('modules', 0.5, 3)
    setScene('modules')
  }

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === '03') {
      // Mentoria — redirect to WhatsApp
      window.open(
        'https://wa.me/5571981768585?text=Quero%20saber%20mais%20sobre%20a%20mentoria',
        '_blank'
      )
    } else {
      // Modules 01 & 02 — show Access Denied popup
      setShowDenied(true)
    }
  }

  const handleAudienceClick = () => {
    setShowDenied(true)
  }

  useEffect(() => {
    const handleFirstInteraction = () => {
      initContext()
      window.removeEventListener('click', handleFirstInteraction)
    }
    window.addEventListener('click', handleFirstInteraction)
    return () => window.removeEventListener('click', handleFirstInteraction)
  }, [initContext])

  return (
    <main className="min-h-screen w-screen overflow-x-hidden overflow-y-auto bg-black relative">
      <AnimatePresence mode="wait">
        {scene === 'hero' && (
          <HeroSection key="hero" onStart={handleStart} />
        )}

        {scene === 'loading' && (
          <TerminalLoader key="loader" onComplete={handleLoadingComplete} />
        )}

        {scene === 'modules' && (
          <ModulesSection key="modules" onNext={handleAudienceClick} onModuleClick={handleModuleClick} />
        )}

        {moduleData.map(mod => (
          scene === `module-${mod.id}` && (
            <ModuleDetail
              key={`module-${mod.id}`}
              moduleId={mod.id}
              title={mod.title}
              description={mod.description}
              vslUrl={mod.vslUrl || undefined}
              ctaText={mod.ctaText}
              onBack={() => setScene('modules')}
            />
          )
        ))}

        {scene === 'audience' && (
          <TargetAudience key="audience" onNext={() => console.log('Next scene')} />
        )}
      </AnimatePresence>

      {/* Access Denied Popup (overlays any scene) */}
      <AccessDeniedPopup isOpen={showDenied} onClose={() => setShowDenied(false)} />
    </main>
  )
}
