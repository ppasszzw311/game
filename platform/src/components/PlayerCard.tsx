import React from 'react';
import type { Player } from '../types/baseball';

interface PlayerCardProps {
    player: Player;
    compact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, compact = false }) => {
    const getGrade = (value: number) => {
        if (value >= 90) return { label: 'S', color: 'text-yellow-500' };
        if (value >= 80) return { label: 'A', color: 'text-red-500' };
        if (value >= 70) return { label: 'B', color: 'text-orange-500' };
        if (value >= 60) return { label: 'C', color: 'text-green-500' };
        if (value >= 50) return { label: 'D', color: 'text-blue-500' };
        if (value >= 40) return { label: 'E', color: 'text-gray-500' };
        return { label: 'F', color: 'text-gray-400' };
    };

    const AttributeRow = ({ label, value }: { label: string, value: number }) => {
        const grade = getGrade(value);
        return (
            <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-600 w-16">{label}</span>
                <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${value >= 80 ? 'bg-power-red' : 'bg-power-blue'}`}
                        style={{ width: `${Math.min(100, value)}%` }}
                    />
                </div>
                <span className={`font-bold w-6 text-center ${grade.color}`}>{grade.label}</span>
                <span className="text-xs text-gray-400 w-6 text-right">{Math.round(value)}</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                    {player.firstName[0]}{player.lastName[0]}
                </div>
                <div>
                    <h4 className="font-bold text-lg leading-tight">{player.firstName} {player.lastName}</h4>
                    <div className="text-sm text-gray-500 font-mono">
                        {player.primaryPosition} | Age: {player.age}
                    </div>
                </div>
            </div>

            {!compact && (
                <div className="space-y-1">
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
