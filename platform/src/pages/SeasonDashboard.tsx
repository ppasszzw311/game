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

    if (!season) return <div className="text-center text-slate-200">Loading Season...</div>;

    const sortedStandings = Object.entries(season.standings).sort(([, a], [, b]) => b.wins - a.wins);

    return (
        <div className="space-y-8">
            <div className="panel-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <div className="panel-subtitle">Season Overview</div>
                    <h2 style={{ margin: '4px 0', fontSize: '30px', color: '#fff' }}>Season {season.year}</h2>
                    <p style={{ color: '#d9e5ff' }}>即時查看戰績、賽程與每日模擬進度。</p>
                </div>
                <div className="cta-row">
                    <div className="info-chip" style={{ margin: 0 }}>
                        <div className="text-slate-300">Current Day</div>
                        <div className="text-2xl font-extrabold text-white">{season.currentDay}</div>
                    </div>
                    <button onClick={handleSimulateDay} className="btn-main">模擬下一天</button>
                </div>
            </div>

            <div className="season-grid">
                {/* Standings */}
                <div className="feature-card" style={{ borderRadius: '18px', height: '100%' }}>
                    <div className="panel-header" style={{ marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: '#fff' }}>戰績榜</h3>
                        <span className="pill-tag" style={{ letterSpacing: '0.18em', color: '#fff' }}>Updated</span>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>W</th>
                                <th>L</th>
                                <th>T</th>
                                <th>PCT</th>
                                <th>RS</th>
                                <th>RA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStandings.map(([teamId, stats]) => {
                                const team = season.teams.find(t => t.id === teamId);
                                const totalGames = stats.wins + stats.losses + stats.ties;
                                const pct = totalGames > 0 ? (stats.wins / totalGames).toFixed(3) : '.000';
                                return (
                                    <tr key={teamId}>
                                        <td className="font-bold">{team?.name}</td>
                                        <td>{stats.wins}</td>
                                        <td>{stats.losses}</td>
                                        <td>{stats.ties}</td>
                                        <td>{pct}</td>
                                        <td>{stats.runsScored}</td>
                                        <td>{stats.runsAllowed}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Schedule / Recent Results */}
                <div className="feature-card" style={{ borderRadius: '18px', height: '100%' }}>
                    <div className="panel-header" style={{ marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: '#fff' }}>賽程與結果</h3>
                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>比數、對戰與狀態</span>
                    </div>
                    <div style={{ display: 'grid', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
                        {season.schedule.filter(g => g.day <= season.currentDay).reverse().map(game => {
                            const home = season.teams.find(t => t.id === game.homeTeamId);
                            const away = season.teams.find(t => t.id === game.awayTeamId);
                            return (
                                <div key={game.id} className="schedule-card">
                                    <div className="panel-header" style={{ marginBottom: '6px' }}>
                                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Day {game.day}</span>
                                        {game.isPlayed ? (
                                            <span className="panel-subtitle" style={{ color: '#fbbf24' }}>FINAL</span>
                                        ) : (
                                            <span className="panel-subtitle" style={{ color: '#34d399' }}>UPCOMING</span>
                                        )}
                                    </div>
                                    <div className="schedule-row">
                                        <div>{away?.abbreviation}</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '18px' }}>
                                            {game.isPlayed ? `${game.score?.away} - ${game.score?.home}` : 'vs'}
                                        </div>
                                        <div>{home?.abbreviation}</div>
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
