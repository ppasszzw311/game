import React from 'react';
import type { GameState, Team } from '../types/baseball';

interface ScoreboardProps {
    gameState: GameState;
    homeTeam: Team;
    awayTeam: Team;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, homeTeam, awayTeam }) => {
    const innings = Array.from({ length: 9 }, (_, i) => i + 1);

    const getScore = (teamId: string, inning: number) => {
        // This is a placeholder. In a real implementation, GameState would track score per inning.
        // For now, we'll just distribute the total score randomly for demo purposes if the game is over,
        // or show 0s.
        // TODO: Update GameState to track per-inning scores.
        return 0;
    };

    return (
        <div className="bg-black/80 rounded-lg border-2 border-gray-600 p-2 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-[100px_repeat(9,1fr)_50px_50px_50px] gap-y-1 text-center font-bold text-white font-mono">
                {/* Header */}
                <div className="bg-gray-800 rounded-l text-yellow-400 flex items-center justify-center">TEAM</div>
                {innings.map(inn => (
                    <div key={inn} className="bg-gray-800 flex items-center justify-center">{inn}</div>
                ))}
                <div className="bg-gray-800 text-yellow-400 flex items-center justify-center">R</div>
                <div className="bg-gray-800 text-yellow-400 flex items-center justify-center">H</div>
                <div className="bg-gray-800 rounded-r text-yellow-400 flex items-center justify-center">E</div>

                {/* Away Team */}
                <div className="bg-gray-900/90 rounded-l flex items-center justify-center text-lg tracking-wider">{awayTeam.abbreviation}</div>
                {innings.map(inn => (
                    <div key={inn} className="bg-gray-900/90 flex items-center justify-center text-xl">
                        {gameState.inning >= inn ? (gameState.score.away > 0 && inn === 1 ? gameState.score.away : 0) : ''}
                    </div>
                ))}
                <div className="bg-gray-900/90 text-yellow-300 text-xl flex items-center justify-center">{gameState.score.away}</div>
                <div className="bg-gray-900/90 text-xl flex items-center justify-center">0</div>
                <div className="bg-gray-900/90 rounded-r text-xl flex items-center justify-center">0</div>

                {/* Home Team */}
                <div className="bg-gray-900/90 rounded-l flex items-center justify-center text-lg tracking-wider">{homeTeam.abbreviation}</div>
                {innings.map(inn => (
                    <div key={inn} className="bg-gray-900/90 flex items-center justify-center text-xl">
                        {gameState.inning >= inn || (gameState.inning === inn && gameState.isTop === false) ? (gameState.score.home > 0 && inn === 1 ? gameState.score.home : 0) : ''}
                    </div>
                ))}
                <div className="bg-gray-900/90 text-yellow-300 text-xl flex items-center justify-center">{gameState.score.home}</div>
                <div className="bg-gray-900/90 text-xl flex items-center justify-center">0</div>
                <div className="bg-gray-900/90 rounded-r text-xl flex items-center justify-center">0</div>
            </div>
        </div>
    );
};
