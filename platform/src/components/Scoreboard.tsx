import React from 'react';
import type { GameState, Team } from '../types/baseball';

interface ScoreboardProps {
    gameState: GameState;
    homeTeam: Team;
    awayTeam: Team;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, homeTeam, awayTeam }) => {
    const innings = Array.from({ length: 9 }, (_, i) => i + 1);

    return (
        <div style={{ background: 'rgba(0,0,0,0.8)', borderRadius: '14px', border: '2px solid #475569', padding: '8px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(9,1fr) 50px 50px 50px', gap: '4px', textAlign: 'center', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                <div style={{ background: '#1f2937', borderRadius: '8px 0 0 8px', color: '#facc15', display: 'grid', placeItems: 'center' }}>TEAM</div>
                {innings.map(inn => (
                    <div key={inn} style={{ background: '#1f2937', display: 'grid', placeItems: 'center' }}>{inn}</div>
                ))}
                <div style={{ background: '#1f2937', color: '#facc15', display: 'grid', placeItems: 'center' }}>R</div>
                <div style={{ background: '#1f2937', color: '#facc15', display: 'grid', placeItems: 'center' }}>H</div>
                <div style={{ background: '#1f2937', color: '#facc15', display: 'grid', placeItems: 'center', borderRadius: '0 8px 8px 0' }}>E</div>

                <div style={{ background: 'rgba(15,23,42,0.9)', borderRadius: '8px 0 0 8px', display: 'grid', placeItems: 'center', fontSize: '18px', letterSpacing: '0.08em' }}>{awayTeam.abbreviation}</div>
                {innings.map(inn => (
                    <div key={inn} style={{ background: 'rgba(15,23,42,0.9)', display: 'grid', placeItems: 'center', fontSize: '18px' }}>
                        {gameState.scoreByInning.away[inn - 1] !== undefined && (gameState.inning > inn || (gameState.inning === inn && !gameState.isTop)) ? gameState.scoreByInning.away[inn - 1] : (gameState.inning === inn && gameState.isTop ? gameState.scoreByInning.away[inn - 1] : '')}
                    </div>
                ))}
                <div style={{ background: 'rgba(15,23,42,0.9)', color: '#fbbf24', fontSize: '18px', display: 'grid', placeItems: 'center' }}>{gameState.score.away}</div>
                <div style={{ background: 'rgba(15,23,42,0.9)', fontSize: '18px', display: 'grid', placeItems: 'center' }}>{gameState.stats.away.hits}</div>
                <div style={{ background: 'rgba(15,23,42,0.9)', fontSize: '18px', display: 'grid', placeItems: 'center', borderRadius: '0 8px 8px 0' }}>{gameState.stats.away.errors}</div>

                <div style={{ background: 'rgba(15,23,42,0.9)', borderRadius: '8px 0 0 8px', display: 'grid', placeItems: 'center', fontSize: '18px', letterSpacing: '0.08em' }}>{homeTeam.abbreviation}</div>
                {innings.map(inn => (
                    <div key={inn} style={{ background: 'rgba(15,23,42,0.9)', display: 'grid', placeItems: 'center', fontSize: '18px' }}>
                        {gameState.scoreByInning.home[inn - 1] !== undefined && gameState.inning >= inn ? gameState.scoreByInning.home[inn - 1] : ''}
                    </div>
                ))}
                <div style={{ background: 'rgba(15,23,42,0.9)', color: '#fbbf24', fontSize: '18px', display: 'grid', placeItems: 'center' }}>{gameState.score.home}</div>
                <div style={{ background: 'rgba(15,23,42,0.9)', fontSize: '18px', display: 'grid', placeItems: 'center' }}>{gameState.stats.home.hits}</div>
                <div style={{ background: 'rgba(15,23,42,0.9)', fontSize: '18px', display: 'grid', placeItems: 'center', borderRadius: '0 8px 8px 0' }}>{gameState.stats.home.errors}</div>
            </div>
        </div>
    );
};
