import React from 'react';
import type { GameState, Team } from '../types/baseball';

interface MatchResultProps {
    gameState: GameState;
    homeTeam: Team;
    awayTeam: Team;
}

export const MatchResult: React.FC<MatchResultProps> = ({ gameState, homeTeam, awayTeam }) => {
    // Mock Data for demo purposes (since GameState doesn't track specific pitchers yet)
    const winningPitcher = gameState.score.home > gameState.score.away ? "Pitcher A" : "Pitcher B";
    const losingPitcher = gameState.score.home > gameState.score.away ? "Pitcher B" : "Pitcher A";
    const savePitcher = "Closer X";
    const homeRunPlayer = "Slugger Y";

    const ResultRow = ({ label, labelColor, teamIcon, playerName, detail }: any) => (
        <div className="flex items-center bg-white/90 rounded-lg p-2 mb-2 shadow-sm">
            <div className={`w-20 text-center text-white font-bold rounded px-2 py-1 text-sm mr-2 ${labelColor} shadow-inner border border-black/10`}>
                {label}
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 border border-gray-300">
                {/* Team Icon Placeholder */}
                <span className="text-xs font-bold text-gray-600">{teamIcon}</span>
            </div>
            <div className="flex-1 font-bold text-gray-800 text-lg">
                {playerName}
            </div>
            {detail && (
                <div className="text-gray-600 font-mono font-bold mr-2">
                    {detail}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white/95 rounded-xl border-4 border-blue-300 p-4 shadow-2xl max-w-4xl mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pitching Results */}
                <div>
                    <ResultRow
                        label="WIN"
                        labelColor="bg-pawapuro-red"
                        teamIcon={gameState.score.home > gameState.score.away ? homeTeam.abbreviation[0] : awayTeam.abbreviation[0]}
                        playerName={winningPitcher}
                    />
                    <ResultRow
                        label="SAVE"
                        labelColor="bg-pawapuro-pink"
                        teamIcon={gameState.score.home > gameState.score.away ? homeTeam.abbreviation[0] : awayTeam.abbreviation[0]}
                        playerName={savePitcher}
                    />
                    <ResultRow
                        label="LOSS"
                        labelColor="bg-blue-500"
                        teamIcon={gameState.score.home > gameState.score.away ? awayTeam.abbreviation[0] : homeTeam.abbreviation[0]}
                        playerName={losingPitcher}
                    />
                </div>

                {/* Batting Results */}
                <div>
                    <ResultRow
                        label="HR"
                        labelColor="bg-pawapuro-yellow text-black"
                        teamIcon={homeTeam.abbreviation[0]}
                        playerName={homeRunPlayer}
                        detail="7th Solo"
                    />
                    <ResultRow
                        label="HR"
                        labelColor="bg-pawapuro-yellow text-black"
                        teamIcon={awayTeam.abbreviation[0]}
                        playerName="Batter Z"
                        detail="9th 3-Run"
                    />
                </div>
            </div>
        </div>
    );
};
