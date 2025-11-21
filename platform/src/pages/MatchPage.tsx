import React, { useState } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { GameEngine } from '../utils/engine';
import { Scoreboard } from '../components/Scoreboard';
import { MatchResult } from '../components/MatchResult';
import type { GameState, Team, PitchType } from '../types/baseball';

// Mock Data for Demo
const buildPlayer = (id: string, firstName: string, lastName: string, power: number, contact: number, control = 55) => ({
    id,
    firstName,
    lastName,
    age: 26,
    primaryPosition: 'P' as const,
    secondaryPositions: [],
    attributes: {
        contact,
        power,
        vision: Math.max(50, contact - 5),
        speed: 60,
        fielding: 55,
        arm: 60,
        reaction: 58,
        velocity: 90,
        control,
        stamina: 70,
        breaking: 65
    },
    pitchTypes: ['FourSeam', 'Slider'] as PitchType[],
    condition: 3,
    fatigue: 10
});

const homeLineup = [
    buildPlayer('p1', 'Ken', 'Suzuki', 70, 65),
    buildPlayer('p2', 'Daiki', 'Mori', 60, 72),
    buildPlayer('p3', 'Ryo', 'Tanaka', 80, 68),
    buildPlayer('p4', 'Shin', 'Kato', 75, 62),
    buildPlayer('p5', 'Yuki', 'Sato', 55, 66),
    buildPlayer('p6', 'Tomo', 'Hayashi', 58, 60),
    buildPlayer('p7', 'Aoi', 'Kawamura', 52, 64),
    buildPlayer('p8', 'Jun', 'Okada', 50, 58),
    buildPlayer('p9', 'Leo', 'Nakamura', 48, 55)
];

const awayLineup = [
    buildPlayer('r1', 'Chris', 'Walker', 68, 63, 60),
    buildPlayer('r2', 'Alex', 'Lopez', 62, 70, 62),
    buildPlayer('r3', 'Brian', 'Kim', 78, 66, 58),
    buildPlayer('r4', 'Evan', 'Davis', 74, 64, 64),
    buildPlayer('r5', 'Tyler', 'Nguyen', 60, 62, 59),
    buildPlayer('r6', 'Owen', 'Fisher', 55, 60, 57),
    buildPlayer('r7', 'Mason', 'Hill', 58, 58, 56),
    buildPlayer('r8', 'Eli', 'Carter', 52, 57, 55),
    buildPlayer('r9', 'Noah', 'Price', 50, 55, 55)
];

const mockHomeTeam: Team = {
    id: 'h1', name: 'Power Pros', abbreviation: 'PRO', color: '#0055aa',
    roster: homeLineup,
    lineup: homeLineup.map(p => p.id),
    rotation: [homeLineup[0].id]
};

const mockAwayTeam: Team = {
    id: 'a1', name: 'Rivals', abbreviation: 'RIV', color: '#dd2200',
    roster: awayLineup,
    lineup: awayLineup.map(p => p.id),
    rotation: [awayLineup[0].id]
};

const initialGameState: GameState = {
    inning: 1,
    isTop: true,
    score: { home: 0, away: 0 },
    scoreByInning: { home: Array(9).fill(0), away: Array(9).fill(0) },
    stats: { home: { hits: 0, errors: 0 }, away: { hits: 0, errors: 0 } },
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
