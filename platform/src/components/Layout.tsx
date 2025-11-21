import React from 'react';
import { Link } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app-shell">
            <div className="relative overflow-hidden">
                <nav className="nav-bar">
                    <div className="nav-inner">
                        <Link to="/" className="nav-brand">
                            <span style={{ fontSize: '24px' }}>⚾</span>
                            <span>Power Pros League</span>
                        </Link>
                        <div className="nav-links">
                            <Link to="/season" className="nav-link">Season</Link>
                            <Link to="/team" className="nav-link">Team</Link>
                            <Link to="/match" className="nav-primary">Play Match</Link>
                        </div>
                    </div>
                </nav>

                <main className="content-shell">
                    <div className="content-card">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
