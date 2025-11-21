import React, { useState } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import type { Team } from '../types/baseball';

interface LineupEditorProps {
    team: Team;
    onSave: (newLineup: string[]) => void;
    onCancel: () => void;
}

export const LineupEditor: React.FC<LineupEditorProps> = ({ team, onSave, onCancel }) => {
    const [lineupIds, setLineupIds] = useState<string[]>(team.lineup.length > 0 ? team.lineup : team.roster.slice(0, 9).map(p => p.id));
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const getPlayer = (id: string) => team.roster.find(p => p.id === id);

    const handleSlotClick = (index: number) => {
        if (selectedSlot === null) {
            setSelectedSlot(index);
        } else {
            // Swap
            const newLineup = [...lineupIds];
            const temp = newLineup[selectedSlot];
            newLineup[selectedSlot] = newLineup[index];
            newLineup[index] = temp;
            setLineupIds(newLineup);
            setSelectedSlot(null);
        }
    };

    const handleBenchClick = (playerId: string) => {
        if (selectedSlot !== null) {
            // Swap bench player into lineup
            if (lineupIds.includes(playerId)) {
                alert("Player already in lineup!");
                return;
            }
            const newLineup = [...lineupIds];
            newLineup[selectedSlot] = playerId;
            setLineupIds(newLineup);
            setSelectedSlot(null);
        }
    };

    const benchPlayers = team.roster.filter(p => !lineupIds.includes(p.id) && p.primaryPosition !== 'P');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-power-blue text-white rounded-t-lg">
                    <h2 className="text-2xl font-bold">Edit Lineup</h2>
                    <div className="space-x-2">
                        <button onClick={onCancel} className="px-4 py-2 rounded hover:bg-blue-700">Cancel</button>
                        <button onClick={() => onSave(lineupIds)} className="bg-power-yellow text-black px-6 py-2 rounded font-bold hover:bg-yellow-400">Save</button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Batting Order */}
                    <div className="w-1/2 p-4 overflow-y-auto border-r bg-gray-50">
                        <h3 className="font-bold text-lg mb-4">Batting Order</h3>
                        <div className="space-y-2">
                            {lineupIds.map((playerId, index) => {
                                const player = getPlayer(playerId);
                                if (!player) return null;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSlotClick(index)}
                                        className={`flex items-center p-2 rounded cursor-pointer border-2 transition ${selectedSlot === index ? 'border-power-red bg-red-50' : 'border-transparent hover:bg-white hover:shadow'}`}
                                    >
                                        <div className="w-8 font-bold text-gray-500 text-xl">{index + 1}</div>
                                        <div className="flex-1">
                                            <PlayerCard player={player} compact />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bench */}
                    <div className="w-1/2 p-4 overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4">Bench</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {benchPlayers.map(player => (
                                <div
                                    key={player.id}
                                    onClick={() => handleBenchClick(player.id)}
                                    className="cursor-pointer hover:shadow-md transition"
                                >
                                    <PlayerCard player={player} compact />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
