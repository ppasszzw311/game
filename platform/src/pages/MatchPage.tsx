import React, { useState } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { GameEngine } from '../utils/engine';
import { Scoreboard } from '../components/Scoreboard';
import { MatchResult } from '../components/MatchResult';
import type { GameState, Team } from '../types/baseball';
import { Position } from '../types/baseball';

// Mock Data for Demo
const mockHomeTeam: Team = {
    id: 'h1', name: 'Power Pros', abbreviation: 'PRO', color: '#0055aa',
    roster: [], lineup: [], rotation: []
};

const mockAwayTeam: Team = {
    id: 'a1', name: 'Rivals', abbreviation: 'RIV', color: '#dd2200',
    roster: [], lineup: [], rotation: []
};

const initialGameState: GameState = {
    inning: 1,
    isTop: true,
    score: { home: 0, away: 0 },
    outs: 0,
    balls: 0,
    strikes: 0,
    bases: [null, null, null],
    log: []
};

export const MatchPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState);

    const simulateInning = () => {
        const newState = GameEngine.simulateInning(gameState, mockHomeTeam, mockAwayTeam);
        setGameState({ ...newState });
    };

    const resetGame = () => {
        setGameState(initialGameState);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 p-4 flex flex-col items-center">
            {/* Header Bar */}
            <div className="w-full max-w-6xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-t-lg shadow-lg mb-4 flex justify-between items-center px-6 border-b-4 border-blue-800">
                <h1 className="text-2xl font-bold italic tracking-wider drop-shadow-md">MATCH RESULT</h1>
                <div className="text-sm font-mono bg-blue-800 px-3 py-1 rounded">EXHIBITION</div>
            </div>

            <div className="w-full max-w-6xl space-y-6">
                {/* Scoreboard */}
                <Scoreboard gameState={gameState} homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />

                {/* Main Game Area */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
                    {/* Game Canvas */}
                    <div className="bg-white p-2 rounded-xl shadow-xl border-4 border-white">
                        <GameCanvas gameState={gameState} />
                    </div>

                    {/* Controls & Log */}
                    <div className="bg-white/90 p-4 rounded-xl shadow-xl w-full max-w-md border-4 border-white h-[400px] flex flex-col">
                        <div className="flex justify-between mb-4">
                            <button
                                onClick={simulateInning}
                                className="bg-pawapuro-yellow text-black font-bold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-400 transform transition hover:scale-105 border-2 border-yellow-600"
                            >
                                Simulate Inning
                            </button>
                            <button
                                onClick={resetGame}
                                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-600 transform transition hover:scale-105 border-2 border-gray-700"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-100 rounded p-2 border-inner shadow-inner font-mono text-sm">
                            {gameState.log.length === 0 && <div className="text-gray-400 text-center mt-10">Game Start!</div>}
                            {gameState.log.map((log, i) => (
                                <div key={i} className="mb-1 border-b border-gray-200 pb-1">{log}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Match Result Panel */}
                <MatchResult gameState={gameState} homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />
            </div>
        </div>
    );
};
