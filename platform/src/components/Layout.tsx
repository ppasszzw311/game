import React from 'react';
import { Link } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
            <nav className="bg-power-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="font-bold text-xl tracking-wider">
                                ⚾ POWER PROS
                            </Link>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/season" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Season</Link>
                                <Link to="/team" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Team</Link>
                                <Link to="/match" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Play Match</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};
