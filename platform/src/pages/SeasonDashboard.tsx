import React, { useState, useEffect } from 'react';
import { SeasonManager } from '../utils/season';
import { StorageManager } from '../utils/storage';
import type { Season, Team } from '../types/baseball';
import { Position } from '../types/baseball';

// Mock Teams for Season
const generateMockTeams = (count: number): Team[] => {
    return Array(count).fill(null).map((_, i) => ({
        id: `t${i}`, name: `Team ${String.fromCharCode(65 + i)}`, abbreviation: `T${String.fromCharCode(65 + i)}`, color: '#0055aa',
        roster: Array(9).fill(null).map((_, j) => ({
            id: `p${i}-${j}`, firstName: 'Player', lastName: `${j}`, age: 20,
            primaryPosition: Position.P, secondaryPositions: [],
            attributes: { contact: 50 + Math.random() * 50, power: 50 + Math.random() * 50, vision: 50, speed: 50, fielding: 50, arm: 50, reaction: 50, velocity: 150, control: 50, stamina: 50, breaking: 50 },
            pitchTypes: [], condition: 3, fatigue: 0
        })),
        lineup: [], rotation: []
    }));
};

export const SeasonDashboard: React.FC = () => {
    const [season, setSeason] = useState<Season | null>(null);

    useEffect(() => {
        // Try loading first
        const savedSeason = StorageManager.loadSeason();
        if (savedSeason) {
            setSeason(savedSeason);
        } else {
            // Initialize New Season
            const teams = generateMockTeams(4); // 4 Teams
            const newSeason = SeasonManager.createSeason(2024, teams);
            setSeason(newSeason);
            StorageManager.saveSeason(newSeason);
        }
    }, []);

    const handleSimulateDay = () => {
        if (season) {
            const updatedSeason = SeasonManager.simulateDay(season);
            setSeason(updatedSeason);
            StorageManager.saveSeason(updatedSeason); // Auto-save
        }
    };

    if (!season) return <div>Loading Season...</div>;

    const sortedStandings = Object.entries(season.standings).sort(([, a], [, b]) => b.wins - a.wins);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-power-blue">Season {season.year}</h2>
                <div className="text-xl font-bold">Day {season.currentDay}</div>
                <button
                    onClick={handleSimulateDay}
                    className="bg-power-red text-white px-6 py-2 rounded-full font-bold shadow hover:bg-red-600 transition"
                >
                    Simulate Day
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Standings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Standings</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="pb-2">Team</th>
                                <th className="pb-2">W</th>
                                <th className="pb-2">L</th>
                                <th className="pb-2">T</th>
                                <th className="pb-2">PCT</th>
                                <th className="pb-2">RS</th>
                                <th className="pb-2">RA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStandings.map(([teamId, stats]) => {
                                const team = season.teams.find(t => t.id === teamId);
                                const totalGames = stats.wins + stats.losses + stats.ties;
                                const pct = totalGames > 0 ? (stats.wins / totalGames).toFixed(3) : '.000';
                                return (
                                    <tr key={teamId} className="border-t border-gray-100">
                                        <td className="py-3 font-bold">{team?.name}</td>
                                        <td className="py-3">{stats.wins}</td>
                                        <td className="py-3">{stats.losses}</td>
                                        <td className="py-3">{stats.ties}</td>
                                        <td className="py-3">{pct}</td>
                                        <td className="py-3">{stats.runsScored}</td>
                                        <td className="py-3">{stats.runsAllowed}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Schedule / Recent Results */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Schedule</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {season.schedule.filter(g => g.day <= season.currentDay).reverse().map(game => {
                            const home = season.teams.find(t => t.id === game.homeTeamId);
                            const away = season.teams.find(t => t.id === game.awayTeamId);
                            return (
                                <div key={game.id} className={`p-3 rounded border ${game.isPlayed ? 'bg-gray-50' : 'bg-white border-power-blue'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Day {game.day}</span>
                                        {game.isPlayed ? (
                                            <span className="font-bold text-power-blue">FINAL</span>
                                        ) : (
                                            <span className="text-sm text-green-600 font-bold">UPCOMING</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="font-bold">{away?.abbreviation}</div>
                                        <div className="text-xl font-mono">
                                            {game.isPlayed ? `${game.score?.away} - ${game.score?.home}` : 'vs'}
                                        </div>
                                        <div className="font-bold">{home?.abbreviation}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
