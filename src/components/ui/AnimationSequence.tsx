"use client";

import React, { useEffect, useRef, useState } from 'react';

interface AnimationSequenceProps {
    frameCount: number;
    basePath: string;
    fps?: number;
    className?: string;
    onLoaded?: () => void;
}

export const AnimationSequence: React.FC<AnimationSequenceProps> = ({
    frameCount,
    basePath,
    fps = 24,
    className = "",
    onLoaded
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const requestRef = useRef<number>(undefined as any);
    const lastTimeRef = useRef<number>(undefined as any);
    const hasNotifiedLoaded = useRef(false);

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let count = 0;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, '0');
            img.src = `${basePath}${frameNumber}.jpg`;
            img.onload = () => {
                count++;
                if (count >= Math.min(5, frameCount) && !hasNotifiedLoaded.current) {
                    hasNotifiedLoaded.current = true;
                    onLoaded?.();
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [frameCount, basePath, onLoaded]);

    const animate = (time: number) => {
        if (lastTimeRef.current === undefined) {
            lastTimeRef.current = time;
        }

        const deltaTime = time - lastTimeRef.current;
        const interval = 1000 / fps;

        if (deltaTime >= interval) {
            const nextIndex = (currentIndex + 1) % frameCount;
            if (images[nextIndex] && images[nextIndex].complete) {
                setCurrentIndex(nextIndex);
                lastTimeRef.current = time;
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [frameCount, fps, currentIndex, images]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0 || !images[currentIndex]) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[currentIndex];
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';

        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }, [currentIndex, images]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
                style={{
                    filter: "brightness(0.6) contrast(1.1) saturate(0.8)",
                }}
            />
        </div>
    );
};
