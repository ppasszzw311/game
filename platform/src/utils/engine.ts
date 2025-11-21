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
        let hitChance = (contact + vision * 0.5) - (effectiveControl * 0.7);
        hitChance = Math.max(5, Math.min(60, hitChance + 25)); // Normalize to 5% - 60% range

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

    static simulateInning(gameState: GameState, battingTeam: Team, pitchingTeam: Team): GameState {
        let outs = 0;
        let inningRuns = 0;
        const log: string[] = [];
        let batterIndex = 0;

        const bases = [...gameState.bases];

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
                inningRuns += 1 + bases.filter(b => b !== null).length;
                bases[0] = bases[1] = bases[2] = null;
            } else if (result.type === 'HIT') {
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

        if (inningRuns > 0) {
            log.push(`${battingTeam.name} scores ${inningRuns} run(s)!`);
        }

        // Update Score
        const newScore = { ...gameState.score };
        if (gameState.isTop) {
            newScore.away += inningRuns;
        } else {
            newScore.home += inningRuns;
        }

        // Switch Inning/Side
        let nextInning = gameState.inning;
        let nextIsTop = gameState.isTop;

        if (!gameState.isTop) {
            nextInning++;
        }
        nextIsTop = !gameState.isTop;

        return {
            ...gameState,
            inning: nextInning,
            isTop: nextIsTop,
            score: newScore,
            outs,
            bases,
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
