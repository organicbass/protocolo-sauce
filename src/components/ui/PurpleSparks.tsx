"use client";

import React, { useEffect, useRef } from 'react';

export const PurpleSparks = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            color: string;

            constructor() {
                const w = canvas?.width || window.innerWidth;
                const h = canvas?.height || window.innerHeight;
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2.5 + 1;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * -2 - 0.5;
                this.opacity = Math.random() * 0.8 + 0.4;
                this.color = `hsla(${270 + Math.random() * 50}, 95%, 70%, ${this.opacity})`;
            }

            update() {
                const w = canvas?.width || window.innerWidth;
                const h = canvas?.height || window.innerHeight;
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.y < -20) {
                    this.y = h + 20;
                    this.x = Math.random() * w;
                }
                if (this.x < -20) this.x = w + 20;
                if (this.x > w + 20) this.x = -20;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
            }
        }

        const init = () => {
            particles = [];
            const particleCount = Math.min(60, Math.floor(window.innerWidth / 15));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.shadowBlur = 0;
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 pointer-events-none opacity-80"
        />
    );
};
