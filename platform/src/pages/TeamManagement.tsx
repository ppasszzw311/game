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

    if (!team) return <div className="text-center text-slate-200">Loading Team...</div>;

    const pitchers = team.roster.filter(p => p.primaryPosition === 'P');
    const fielders = team.roster.filter(p => p.primaryPosition !== 'P');
    const displayedPlayers = activeTab === 'pitchers' ? pitchers : fielders;

    return (
        <div className="space-y-6">
            {isEditingLineup && (
                <LineupEditor
                    team={team}
                    onSave={handleSaveLineup}
                    onCancel={() => setIsEditingLineup(false)}
                />
            )}

            <div className="panel-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <div className="panel-subtitle" style={{ marginBottom: '8px' }}>Team Control</div>
                    <h2 style={{ margin: 0, fontSize: '30px', color: '#fff' }}>{team.name}</h2>
                    <p style={{ color: '#d9e5ff', marginTop: '4px' }}>設定先發陣容、檢視投打能力，打造你的冠軍隊伍。</p>
                </div>
                <div className="cta-row">
                    <button onClick={() => setIsEditingLineup(true)} className="btn-main">編輯打線</button>
                    <button className="btn-ghost">編輯投手輪值</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-row">
                <button onClick={() => setActiveTab('fielders')} className={activeTab === 'fielders' ? 'active' : ''}>Fielders</button>
                <button onClick={() => setActiveTab('pitchers')} className={activeTab === 'pitchers' ? 'active' : ''}>Pitchers</button>
            </div>

            {/* Roster Grid */}
            <div className="grid-players">
                {displayedPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};
