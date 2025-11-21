import type { Player, GameState, Team } from '../types/baseball';

export interface AtBatResult {
    type: 'OUT' | 'HIT' | 'WALK' | 'HR';
    detail: string; // e.g., "Groundout", "Double", "Strikeout"
    runs: number;
    outs: number;
}

export class GameEngine {

    static simulateAtBat(pitcher: Player, batter: Player): AtBatResult {
        // Basic RNG model based on SRS
        // HitChance = (Contact + Vision*0.5) - (Pitcher.Control * 0.7)

        const contact = batter.attributes.contact;
        const vision = batter.attributes.vision;
        const control = pitcher.attributes.control;
        const power = batter.attributes.power;

        // Fatigue Effect: Fatigue > 70 increases mistake chance (simulated by reducing control)
        let effectiveControl = control;
        if (pitcher.fatigue > 70) {
            effectiveControl = Math.max(0, control - (pitcher.fatigue - 70) * 2);
        }

        // Base hit chance (simplified 0-100 scale)
        // Tuned so typical matchups hover around ~30% hit rate
        const rawHitChance = (contact * 0.3 + vision * 0.2) - (effectiveControl * 0.25);
        const hitChance = Math.max(5, Math.min(40, rawHitChance)); // Normalize to 5% - 40% range

        const roll = Math.random() * 100;

        if (roll < hitChance) {
            // It's a hit! Determine type based on Power
            const powerRoll = Math.random() * 100;
            const hrThreshold = Math.max(5, power * 0.4); // Higher power = higher HR chance

            if (powerRoll < hrThreshold) {
                return { type: 'HR', detail: 'Home Run', runs: 1, outs: 0 };
            } else if (powerRoll < hrThreshold + 15) {
                return { type: 'HIT', detail: 'Double', runs: 0, outs: 0 };
            } else {
                return { type: 'HIT', detail: 'Single', runs: 0, outs: 0 };
            }
        } else {
            // Out
            const outRoll = Math.random() * 100;
            if (outRoll < 25) {
                return { type: 'OUT', detail: 'Strikeout', runs: 0, outs: 1 };
            } else if (outRoll < 60) {
                return { type: 'OUT', detail: 'Groundout', runs: 0, outs: 1 };
            } else {
                return { type: 'OUT', detail: 'Flyout', runs: 0, outs: 1 };
            }
        }
    }

    static simulateInning(gameState: GameState, homeTeam: Team, awayTeam: Team): GameState {
        const isTop = gameState.isTop;
        const battingTeam = isTop ? awayTeam : homeTeam;
        const pitchingTeam = isTop ? homeTeam : awayTeam;

        let outs = 0;
        let inningRuns = 0;
        const log: string[] = [`${isTop ? 'Top' : 'Bottom'} ${gameState.inning}: ${battingTeam.name} at bat`];
        let batterIndex = 0;

        const bases: (string | null)[] = [null, null, null];

        let inningHits = 0;

        // Get current pitcher (simplified: assume first in rotation for now)
        // Fallback to a dummy pitcher if roster is empty (e.g. mock data)
        const pitcher = pitchingTeam.roster.find(p => p.id === pitchingTeam.rotation[0]) || pitchingTeam.roster[0];

        if (!pitcher && pitchingTeam.roster.length === 0) {
            // Handle empty roster case for demo
            log.push("Simulating against empty team...");
        }

        // Simulate until 3 outs
        // Safety break to prevent infinite loops if something goes wrong
        let safetyCounter = 0;
        while (outs < 3 && safetyCounter < 20) {
            safetyCounter++;

            // Get current batter using lineup order
            const batterId = battingTeam.lineup[batterIndex % Math.max(1, battingTeam.lineup.length)];
            const batter = battingTeam.roster.find(p => p.id === batterId) || battingTeam.roster[0];
            batterIndex++;

            if (!batter || !pitcher) {
                // Fallback for empty rosters
                outs++;
                log.push(`Auto-out (no players available) — outs: ${outs}`);
                continue;
            }

            const result = this.simulateAtBat(pitcher, batter);

            log.push(`${batter.lastName}: ${result.detail} (outs: ${outs + result.outs})`);

            if (result.type === 'OUT') {
                outs += result.outs;
            } else if (result.type === 'HR') {
                inningHits++;
                inningRuns += 1 + bases.filter(b => b !== null).length;
                bases[0] = bases[1] = bases[2] = null;
            } else if (result.type === 'HIT') {
                inningHits++;
                // Simplified base running: random chance to score
                if (Math.random() > 0.7) inningRuns += 1;
                // Move a random runner forward one base if available
                const runnerIndex = bases.findIndex(b => b !== null);
                if (runnerIndex !== -1) {
                    const target = runnerIndex + 1;
                    if (target >= 3) {
                        inningRuns += 1;
                        bases[runnerIndex] = null;
                    } else {
                        bases[target] = bases[runnerIndex];
                        bases[runnerIndex] = null;
                    }
                } else {
                    bases[0] = batter.id;
                }
            }
        }

        log.push(`Half-inning over — ${outs} outs recorded.`);

        if (inningRuns > 0) {
            log.push(`${battingTeam.name} scores ${inningRuns} run(s)!`);
        }

        // Update Score and Stats
        const newScore = { ...gameState.score };
        const newScoreByInning = { ...gameState.scoreByInning };
        const newStats = { ...gameState.stats };

        if (isTop) {
            newScore.away += inningRuns;
            newScoreByInning.away = [...gameState.scoreByInning.away];
            newScoreByInning.away[gameState.inning - 1] = inningRuns;
            newStats.away = { ...gameState.stats.away, hits: gameState.stats.away.hits + inningHits };
        } else {
            newScore.home += inningRuns;
            newScoreByInning.home = [...gameState.scoreByInning.home];
            newScoreByInning.home[gameState.inning - 1] = inningRuns;
            newStats.home = { ...gameState.stats.home, hits: gameState.stats.home.hits + inningHits };
        }

        // Switch Inning/Side
        let nextInning = gameState.inning;
        let nextIsTop = isTop;

        if (!isTop) {
            nextInning++;
        }
        nextIsTop = !isTop;

        return {
            ...gameState,
            inning: nextInning,
            isTop: nextIsTop,
            score: newScore,
            scoreByInning: newScoreByInning,
            stats: newStats,
            outs: 0,
            bases: [null, null, null],
            log: [...gameState.log, ...log]
        };
    }

    static simulateGame(homeTeam: Team, awayTeam: Team): { score: { home: number, away: number } } {
        // Quick simulation for season mode
        const homeStrength = homeTeam.roster.length > 0
            ? homeTeam.roster.reduce((acc, p) => acc + p.attributes.power + p.attributes.contact, 0) / homeTeam.roster.length
            : 50;
        const awayStrength = awayTeam.roster.length > 0
            ? awayTeam.roster.reduce((acc, p) => acc + p.attributes.power + p.attributes.contact, 0) / awayTeam.roster.length
            : 50;

        let homeScore = 0;
        let awayScore = 0;

        // Simulate 9 innings
        for (let i = 0; i < 9; i++) {
            // Simplified scoring chance per inning
            if (Math.random() * 100 < (homeStrength / 5)) homeScore++;
            if (Math.random() * 100 < (awayStrength / 5)) awayScore++;
        }

        return { score: { home: homeScore, away: awayScore } };
    }
}
