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
        ctx.fillStyle = '#228822'; // Grass
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
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(base.x, base.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white'; // Reset for next base
            }
        });

        // Draw Scoreboard
        ctx.fillStyle = 'black';
        ctx.fillRect(10, 10, 150, 80);
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText(`HOME: ${gameState.score.home}`, 20, 30);
        ctx.fillText(`AWAY: ${gameState.score.away}`, 20, 50);
        ctx.fillText(`OUTS: ${gameState.outs}`, 20, 70);
        ctx.fillText(`${gameState.isTop ? 'TOP' : 'BOT'} ${gameState.inning}`, 80, 70);

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
