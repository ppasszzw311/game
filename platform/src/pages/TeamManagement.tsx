import React, { useState, useEffect } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { LineupEditor } from '../components/LineupEditor';
import type { Team } from '../types/baseball';
import { Position } from '../types/baseball';

// Mock Data Generator (Reused temporarily until we have a global state store)
const generateMockTeam = (): Team => {
    return {
        id: 't1', name: 'Power Pros', abbreviation: 'PRO', color: '#0055aa',
        roster: [
            ...Array(5).fill(null).map((_, i) => ({
                id: `p-p-${i}`, firstName: 'Pitcher', lastName: `${i + 1}`, age: 20 + i,
                primaryPosition: Position.P, secondaryPositions: [],
                attributes: { contact: 10, power: 10, vision: 10, speed: 50, fielding: 50, arm: 50, reaction: 50, velocity: 150 + i * 2, control: 60 + i * 5, stamina: 60 + i * 5, breaking: 60 + i * 5 },
                pitchTypes: [], condition: 3, fatigue: 0
            })),
            ...Array(9).fill(null).map((_, i) => ({
                id: `p-f-${i}`, firstName: 'Fielder', lastName: `${i + 1}`, age: 20 + i,
                primaryPosition: [Position.C, Position.FirstBase, Position.SecondBase, Position.ThirdBase, Position.SS, Position.LF, Position.CF, Position.RF, Position.DH][i],
                secondaryPositions: [],
                attributes: { contact: 60 + i * 3, power: 60 + i * 3, vision: 60, speed: 60 + i * 2, fielding: 60, arm: 60, reaction: 60, velocity: 0, control: 0, stamina: 0, breaking: 0 },
                pitchTypes: [], condition: 3, fatigue: 0
            }))
        ],
        lineup: [], rotation: []
    };
};

export const TeamManagement: React.FC = () => {
    const [team, setTeam] = useState<Team | null>(null);
    const [activeTab, setActiveTab] = useState<'pitchers' | 'fielders'>('fielders');
    const [isEditingLineup, setIsEditingLineup] = useState(false);

    useEffect(() => {
        // In a real app, we'd fetch from a store or context
        setTeam(generateMockTeam());
    }, []);

    const handleSaveLineup = (newLineup: string[]) => {
        if (team) {
            setTeam({ ...team, lineup: newLineup });
            setIsEditingLineup(false);
        }
    };

    if (!team) return <div>Loading Team...</div>;

    const pitchers = team.roster.filter(p => p.primaryPosition === 'P');
    const fielders = team.roster.filter(p => p.primaryPosition !== 'P');
    const displayedPlayers = activeTab === 'pitchers' ? pitchers : fielders;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {isEditingLineup && (
                <LineupEditor
                    team={team}
                    onSave={handleSaveLineup}
                    onCancel={() => setIsEditingLineup(false)}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-power-blue">{team.name} Management</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setIsEditingLineup(true)}
                        className="bg-power-yellow hover:bg-yellow-500 px-4 py-2 rounded font-bold text-black shadow transition"
                    >
                        Edit Lineup
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold text-gray-700">
                        Edit Rotation
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('fielders')}
                    className={`px-6 py-3 font-bold rounded-t-lg transition ${activeTab === 'fielders' ? 'bg-white border-t border-l border-r border-gray-300 text-power-blue' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    Fielders
                </button>
                <button
                    onClick={() => setActiveTab('pitchers')}
                    className={`px-6 py-3 font-bold rounded-t-lg transition ${activeTab === 'pitchers' ? 'bg-white border-t border-l border-r border-gray-300 text-power-blue' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    Pitchers
                </button>
            </div>

            {/* Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};
