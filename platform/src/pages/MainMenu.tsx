import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageManager } from '../utils/storage';

export const MainMenu: React.FC = () => {
    const navigate = useNavigate();
    const [hasSave, setHasSave] = useState(false);

    useEffect(() => {
        setHasSave(StorageManager.hasSave());
    }, []);

    const handleNewGame = () => {
        if (hasSave) {
            if (!confirm("Starting a new game will overwrite your existing save. Continue?")) return;
        }
        StorageManager.clearSave();
        navigate('/season');
    };

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
            <h1 className="text-6xl font-extrabold text-power-blue drop-shadow-md">
                POWER PROS BASEBALL
            </h1>
            <div className="grid grid-cols-1 gap-4 w-64">
                <button
                    onClick={handleNewGame}
                    className="bg-power-red hover:bg-red-600 text-white text-center py-4 rounded-lg text-xl font-bold shadow-lg transform transition hover:scale-105"
                >
                    NEW SEASON
                </button>

                {hasSave && (
                    <Link to="/season" className="bg-power-blue hover:bg-blue-600 text-white text-center py-4 rounded-lg text-xl font-bold shadow-lg transform transition hover:scale-105">
                        CONTINUE
                    </Link>
                )}

                <Link to="/team" className="bg-power-yellow hover:bg-yellow-500 text-black text-center py-4 rounded-lg text-xl font-bold shadow-lg transform transition hover:scale-105">
                    TEAM EDIT
                </Link>
                <Link to="/match" className="bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg text-xl font-bold shadow-lg transform transition hover:scale-105">
                    EXHIBITION
                </Link>
                <Link to="/settings" className="bg-gray-600 hover:bg-gray-700 text-white text-center py-4 rounded-lg text-xl font-bold shadow-lg transform transition hover:scale-105">
                    SETTINGS
                </Link>
            </div>
        </div>
    );
};
