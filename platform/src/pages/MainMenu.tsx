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
        <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
                <div className="pill-tag">
                    <span style={{ fontSize: '18px' }}>⚾</span>
                    <span>Arcade Simulation</span>
                </div>
                <h1 className="hero-title">
                    Power Pros<br />Baseball League
                </h1>
                <p className="hero-text">
                    快速建立球隊、模擬球季與比賽，感受街機風格的棒球對戰。選擇你的模式，立即帶領球隊進入球場！
                </p>

                <div className="cta-row">
                    <button onClick={handleNewGame} className="btn-main">
                        開始新賽季
                    </button>
                    {hasSave && (
                        <Link to="/season" className="btn-ghost">
                            繼續遊戲
                        </Link>
                    )}
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="panel-subtitle">模式</div>
                        <div className="text-xl font-bold">季賽模擬</div>
                        <p className="mt-1 text-slate-200">自動生成賽程、戰績與每日結果。</p>
                    </div>
                    <div className="feature-card">
                        <div className="panel-subtitle">隊伍</div>
                        <div className="text-xl font-bold">客製球員</div>
                        <p className="mt-1 text-slate-200">調整先發名單、投手輪值與能力值。</p>
                    </div>
                    <div className="feature-card">
                        <div className="panel-subtitle">比賽</div>
                        <div className="text-xl font-bold">快速對戰</div>
                        <p className="mt-1 text-slate-200">一鍵模擬半局，立即查看比數與戰況。</p>
                    </div>
                </div>
            </div>

            <div className="mode-panel">
                <h2 className="text-2xl font-bold text-white mb-1">模式選單</h2>
                <button onClick={handleNewGame} className="mode-card" style={{ background: 'linear-gradient(120deg,#ef4444,#f97316)', color: '#fff' }}>
                    <div>
                        <small>Season</small>
                        <h3>New Season</h3>
                    </div>
                    <span className="icon">▶</span>
                </button>

                {hasSave && (
                    <Link to="/season" className="mode-card" style={{ background: 'linear-gradient(120deg,#0ea5e9,#2563eb)', color: '#fff' }}>
                        <div>
                            <small>Season</small>
                            <h3>Continue</h3>
                        </div>
                        <span className="icon">▶</span>
                    </Link>
                )}

                <Link to="/team" className="mode-card" style={{ background: 'linear-gradient(120deg,#facc15,#fcd34d)', color: '#1f2937' }}>
                    <div>
                        <small>Team</small>
                        <h3>Edit Roster</h3>
                    </div>
                    <span className="icon">⚙️</span>
                </Link>

                <Link to="/match" className="mode-card" style={{ background: 'linear-gradient(120deg,#10b981,#059669)', color: '#fff' }}>
                    <div>
                        <small>Exhibition</small>
                        <h3>Quick Match</h3>
                    </div>
                    <span className="icon">🎮</span>
                </Link>

                <Link to="/settings" className="mode-card" style={{ background: 'linear-gradient(120deg,#475569,#334155)', color: '#fff' }}>
                    <div>
                        <small>System</small>
                        <h3>Settings</h3>
                    </div>
                    <span className="icon">⚙️</span>
                </Link>

                <div className="info-grid">
                    <div className="info-chip">
                        <div className="text-slate-300">快速提示</div>
                        <div className="font-semibold">先模擬一個賽季檢視戰績</div>
                    </div>
                    <div className="info-chip">
                        <div className="text-slate-300">儲存狀態</div>
                        <div className="font-semibold">{hasSave ? '已有存檔，可續玩' : '尚無存檔，立即開始'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
