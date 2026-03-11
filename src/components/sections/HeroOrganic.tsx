"use client";

import React, { useState, useEffect } from 'react';
import { AnimationSequence } from '@/components/ui/AnimationSequence';
import { PurpleSparks } from '@/components/ui/PurpleSparks';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const HeroOrganic = () => {
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const moveX = useSpring(useTransform(mouseX, [-400, 400], [-10, 10]), springConfig);
  const moveY = useSpring(useTransform(mouseY, [-400, 400], [-10, 10]), springConfig);

  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-2, 2]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const videos = [
    {
      id: "1172193123",
      title: "Ayybo B2 Odd Mob",
      url: "https://player.vimeo.com/video/1172193123?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479",
      thumb: "https://vumbnail.com/1172193123.jpg"
    },
    {
      id: "1172193209",
      title: "YOUniverse",
      url: "https://player.vimeo.com/video/1172193209?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479",
      thumb: "https://vumbnail.com/1172193209.jpg"
    },
    {
      id: "1172193306",
      title: "Ayybo",
      url: "https://player.vimeo.com/video/1172193306?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479",
      thumb: "https://vumbnail.com/1172193306.jpg"
    }
  ];

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-start px-4 lg:px-0"
      style={{ perspective: "1000px" }}
    >

      {/* ANIMAÇÃO DE FUNDO */}
      <div className="absolute inset-0 z-0">
        <AnimationSequence
          frameCount={300}
          basePath="/ogbass/Animação hero/"
          fps={24}
          onLoaded={() => setIsBackgroundReady(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

        {/* SAUCE PROTOCOL: PURPLE SPARKS */}
        <PurpleSparks />
      </div>

      <AnimatePresence>
        {isBackgroundReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full h-full flex flex-col items-start z-20"
            style={{
              x: moveX,
              y: moveY,
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d"
            } as any}
          >
            <div className="mt-12 w-full max-w-[1200px] mx-auto relative h-full flex flex-col items-start">
              <div className="flex flex-col items-start transition-all duration-300 max-md:ml-[-43px] md:max-lg:ml-[-35px] lg:ml-[-27px]">

                <div className="flex flex-col items-start">
                  <h1
                    onMouseEnter={() => setIsHoveringTitle(true)}
                    onMouseLeave={() => setIsHoveringTitle(false)}
                    className="cursor-default text-white font-[950] leading-[0.82] tracking-tighter uppercase mt-1 flex flex-col items-start"
                  >
                    <div className="relative inline-block">
                      <span className="absolute -top-[21px] left-1/2 -translate-x-1/2 font-sans text-white/90 font-black tracking-[4px]
                        max-md:text-[14px] md:max-lg:text-[18px] lg:text-[22px] z-30 whitespace-nowrap">
                        OUÇA
                      </span>

                      <span className={`inline-block transition-transform duration-500 ease-out origin-left
                        max-md:text-[70px] md:max-lg:text-[100px] lg:text-[135px]
                        ${isHoveringTitle ? 'scale-[1.05]' : 'scale-100'}`}>
                        JAZZ
                      </span>
                    </div>
                    <span className={`inline-block transition-transform duration-500 ease-out origin-left
                      max-md:text-[70px] md:max-lg:text-[100px] lg:text-[135px]
                      ${isHoveringTitle ? 'scale-[1.02]' : 'scale-100'}`}>
                      SYNTH
                    </span>
                  </h1>
                </div>

                <div className="mt-8 text-white/95 leading-snug font-medium max-w-[480px]
                  max-md:text-[14px] md:max-lg:text-[16px] lg:text-[17px]">
                  <p>Em parceria com <span className="text-white font-black">Navarro</span>, lançado pela <span className="text-white font-black">Hub Records</span></p>
                  <p>com suporte de Ayybo (Ayybo b2 com Odd Mob na Elrow)</p>
                  <p>YOUniverse e +.</p>
                </div>

                <div className="mt-6 w-full max-w-[400px]">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/track/369YFoaESKhLikdxPfdNMZ?utm_source=generator"
                    width="100%"
                    height="152"
                    frameBorder={0}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-[110px] left-0 w-full flex justify-center px-4">
              <nav className="flex items-center gap-10 px-8 py-3 bg-black/30 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl">
                <div className="flex gap-8">
                  <div className="relative group">
                    <a href="#" className="text-[11px] font-black uppercase tracking-[2px] text-white/70 hover:text-white transition-all">Sobre</a>
                    <ComingSoonBadge />
                  </div>
                  <div className="relative group">
                    <a href="#" className="text-[11px] font-black uppercase tracking-[2px] text-white/70 hover:text-white transition-all">Contato</a>
                    <ComingSoonBadge />
                  </div>
                </div>
                <div className="relative group">
                  <button className="bg-white text-black px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[2px] hover:scale-105 transition-all">
                    Playlist
                  </button>
                  <ComingSoonBadge isButton />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeVideoIndex !== null && (
        <div
          className="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setActiveVideoIndex(null)}
        >
          <div
            className="relative h-[65vh] aspect-[9/16] rounded-xl border border-white/20 shadow-2xl bg-black overflow-hidden transition-transform duration-500 ease-out scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoIndex(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <iframe
              src={videos[activeVideoIndex].url}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title={videos[activeVideoIndex].title}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-black/60 via-black/40 to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default HeroOrganic;
