'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Advanced Audio Manager for multi-track playback, 
 * low-pass filtering, and volume crossfades.
 */
export default function useAdvancedAudio() {
    const audioContextRef = useRef<AudioContext | null>(null)
    const tracksRef = useRef<Map<string, { source: AudioBufferSourceNode | null, gain: GainNode, filter: BiquadFilterNode }>>(new Map())
    const [isInitialized, setIsInitialized] = useState(false)

    // Buffers cache
    const buffersRef = useRef<Map<string, AudioBuffer>>(new Map())

    const initContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            setIsInitialized(true)
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume()
        }
    }

    const loadTrack = async (name: string, url: string) => {
        if (!audioContextRef.current) initContext()
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)
        buffersRef.current.set(name, audioBuffer)
    }

    const playTrack = (name: string, loop: boolean = true) => {
        const ctx = audioContextRef.current
        if (!ctx) return

        const buffer = buffersRef.current.get(name)
        if (!buffer) return

        // Stop existing if any
        stopTrack(name)

        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = loop

        const gainNode = ctx.createGain()
        const filterNode = ctx.createBiquadFilter()
        filterNode.type = 'lowpass'
        filterNode.frequency.value = 20000 // Start fully open

        source.connect(filterNode)
        filterNode.connect(gainNode)
        gainNode.connect(ctx.destination)

        source.start(0)

        tracksRef.current.set(name, { source, gain: gainNode, filter: filterNode })
    }

    const stopTrack = (name: string, fadeOut: number = 0.5) => {
        const track = tracksRef.current.get(name)
        if (track && track.source) {
            const ctx = audioContextRef.current!
            track.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeOut)
            setTimeout(() => {
                track.source?.stop()
                tracksRef.current.delete(name)
            }, fadeOut * 1000)
        }
    }

    const setFilter = (name: string, frequency: number, rampTime: number = 1) => {
        const track = tracksRef.current.get(name)
        if (track) {
            const ctx = audioContextRef.current!
            track.filter.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + rampTime)
        }
    }

    const setVolume = (name: string, volume: number, rampTime: number = 1) => {
        const track = tracksRef.current.get(name)
        if (track) {
            const ctx = audioContextRef.current!
            track.gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), ctx.currentTime + rampTime)
        }
    }

    return {
        initContext,
        loadTrack,
        playTrack,
        stopTrack,
        setFilter,
        setVolume,
        isInitialized
    }
}
