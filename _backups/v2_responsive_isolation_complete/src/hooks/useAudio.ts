'use client'
import { useEffect, useRef, useState } from 'react'

export default function useBackgroundMusic(url: string) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const audio = new Audio(url)
        audio.loop = true
        audio.volume = 0.4 // Comfort volume
        audioRef.current = audio

        return () => {
            audio.pause()
            audio.src = ""
        }
    }, [url])

    const play = () => {
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => {
                setIsPlaying(true)
            }).catch(e => {
                console.warn("Audio playback blocked or failed:", e)
            })
        }
    }

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }

    return { play, stop, isPlaying }
}
