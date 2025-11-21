import React, { useState } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { GameEngine } from '../utils/engine';
import { Scoreboard } from '../components/Scoreboard';
import { MatchResult } from '../components/MatchResult';
import type { GameState, Team } from '../types/baseball';

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
        <div style={{ minHeight: '80vh', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '100%', maxWidth: '1080px', background: 'linear-gradient(120deg,#2563eb,#0ea5e9)', color: '#fff', padding: '12px 24px', borderRadius: '18px', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontStyle: 'italic', letterSpacing: '0.08em' }}>MATCH RESULT</h1>
                <div style={{ fontFamily: 'monospace', background: 'rgba(15,23,42,0.4)', padding: '6px 12px', borderRadius: '10px' }}>EXHIBITION</div>
            </div>

            <div style={{ width: '100%', maxWidth: '1080px', display: 'grid', gap: '18px' }}>
                <Scoreboard gameState={gameState} homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', boxShadow: '0 18px 40px rgba(0,0,0,0.2)' }}>
                        <GameCanvas gameState={gameState} />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.92)', padding: '16px', borderRadius: '16px', boxShadow: '0 18px 40px rgba(0,0,0,0.2)', border: '3px solid #e2e8f0', height: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            <button onClick={simulateInning} className="btn-main" style={{ flex: 1 }}>Simulate Inning</button>
                            <button onClick={resetGame} className="btn-ghost" style={{ flex: 1 }}>Reset</button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', borderRadius: '12px', padding: '10px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                            {gameState.log.length === 0 && <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '24px' }}>Game Start!</div>}
                            {gameState.log.map((log, i) => (
                                <div key={i} style={{ marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>{log}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <MatchResult gameState={gameState} homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />
            </div>
        </div>
    );
};
