import React from 'react';
import type { Player } from '../types/baseball';

interface PlayerCardProps {
    player: Player;
    compact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, compact = false }) => {
    const getGrade = (value: number) => {
        if (value >= 90) return { label: 'S', color: '#fbbf24' };
        if (value >= 80) return { label: 'A', color: '#ef4444' };
        if (value >= 70) return { label: 'B', color: '#fb923c' };
        if (value >= 60) return { label: 'C', color: '#22c55e' };
        if (value >= 50) return { label: 'D', color: '#3b82f6' };
        if (value >= 40) return { label: 'E', color: '#9ca3af' };
        return { label: 'F', color: '#cbd5e1' };
    };

    const AttributeRow = ({ label, value }: { label: string, value: number }) => {
        const grade = getGrade(value);
        return (
            <div className="attr-row">
                <span className="label">{label}</span>
                <div className="bar"><span style={{ width: `${Math.min(100, value)}%` }} /></div>
                <span className="grade" style={{ color: grade.color }}>{grade.label}</span>
                <span style={{ width: '30px', textAlign: 'right', fontSize: '12px', color: '#cbd5e1' }}>{Math.round(value)}</span>
            </div>
        );
    };

    return (
        <div className="player-card">
            <div className="player-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="player-id">
                        {player.firstName[0]}{player.lastName[0]}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 800, margin: 0 }}>{player.firstName} {player.lastName}</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#cbd5e1', fontSize: '13px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}>{player.primaryPosition}</span>
                            <span>Age: {player.age}</span>
                        </div>
                    </div>
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Condition: {player.condition}/5</div>
            </div>

            {!compact && (
                <div className="space-y-1" style={{ display: 'grid', gap: '8px' }}>
                    {player.primaryPosition === 'P' ? (
                        <>
                            <AttributeRow label="VEL" value={player.attributes.velocity / 1.6} /> {/* Convert roughly to 0-100 scale for bar */}
                            <AttributeRow label="CTRL" value={player.attributes.control} />
                            <AttributeRow label="STM" value={player.attributes.stamina} />
                            <AttributeRow label="BRK" value={player.attributes.breaking} />
                        </>
                    ) : (
                        <>
                            <AttributeRow label="CON" value={player.attributes.contact} />
                            <AttributeRow label="POW" value={player.attributes.power} />
                            <AttributeRow label="SPD" value={player.attributes.speed} />
                            <AttributeRow label="FLD" value={player.attributes.fielding} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
