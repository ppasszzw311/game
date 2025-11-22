import React, { useEffect, useRef } from 'react';
import type { GameState } from '../types/baseball';

interface GameCanvasProps {
    gameState: GameState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Field (Simplified)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f5132');
        gradient.addColorStop(1, '#198754');
        ctx.fillStyle = gradient; // Grass gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Infield Dirt
        ctx.fillStyle = '#885522';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height - 100, 150, 0, Math.PI * 2);
        ctx.fill();

        // Bases
        const bases = [
            { x: canvas.width / 2 + 60, y: canvas.height - 160 }, // 1st
            { x: canvas.width / 2, y: canvas.height - 220 },      // 2nd
            { x: canvas.width / 2 - 60, y: canvas.height - 160 }, // 3rd
            { x: canvas.width / 2, y: canvas.height - 100 }       // Home
        ];

        ctx.fillStyle = 'white';
        bases.forEach((base, index) => {
            ctx.fillRect(base.x - 10, base.y - 10, 20, 20);

            // Draw runner if base is occupied
            // Note: gameState.bases is [1st, 2nd, 3rd]
            if (index < 3 && gameState.bases[index]) {
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.arc(base.x, base.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white'; // Reset for next base
            }
        });

        // Home plate highlight
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.strokeRect(bases[3].x - 12, bases[3].y - 12, 24, 24);

        // Draw Scoreboard
        ctx.fillStyle = 'rgba(15,23,42,0.85)';
        ctx.fillRect(10, 10, 200, 100);
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText(`HOME: ${gameState.score.home}`, 20, 35);
        ctx.fillText(`AWAY: ${gameState.score.away}`, 20, 55);
        ctx.fillText(`OUTS: ${Math.min(3, gameState.outs)}`, 20, 75);
        ctx.fillText(`${gameState.isTop ? 'TOP' : 'BOT'} ${gameState.inning}`, 20, 95);
        ctx.fillText(`Bases: ${gameState.bases.map(b => (b ? '●' : '○')).join(' ')}`, 90, 75);

    }, [gameState]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-4 border-white shadow-2xl rounded-lg bg-field-green"
        />
    );
};
