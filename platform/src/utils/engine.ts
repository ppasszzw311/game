import type { Player, GameState, Team } from '../types/baseball';

export interface AtBatResult {
    type: 'OUT' | 'HIT' | 'WALK' | 'HR';
    detail: string; // e.g., "Groundout", "Double", "Strikeout"
    runs: number;
    outs: number;
}

export interface GameSimulationResult {
    score: { home: number; away: number };
    batting: { [playerId: string]: { atBats: number; hits: number; rbi: number } };
    pitching: { [playerId: string]: { inningsPitched: number; runsAllowed: number; strikeouts: number } };
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

    private static advanceRunners(bases: (string | null)[], batterId: string, basesToAdvance: number) {
        let runs = 0;
        // Advance existing runners from third to first to avoid double-moves
        for (let i = 2; i >= 0; i--) {
            const runner = bases[i];
            if (!runner) continue;
            const target = i + basesToAdvance;
            bases[i] = null;
            if (target >= 3) {
                runs++;
            } else {
                bases[target] = runner;
            }
        }

        // Place batter
        const batterTarget = basesToAdvance - 1;
        if (batterTarget >= 3) {
            runs++;
        } else {
            bases[batterTarget] = batterId;
        }

        return runs;
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

            log.push(`${batter.lastName}: ${result.detail}`);

            if (result.type === 'OUT') {
                outs += result.outs;
                if (result.detail === 'Strikeout') {
                    log.push(`Strikeout recorded. Outs: ${outs}`);
                }
            } else if (result.type === 'HR') {
                inningHits++;
                inningRuns += 1 + bases.filter(b => b !== null).length;
                bases[0] = bases[1] = bases[2] = null;
                log.push(`Bases cleared! Total runs this half: ${inningRuns}`);
            } else if (result.type === 'HIT') {
                inningHits++;
                const basesToAdvance = result.detail === 'Double' ? 2 : 1;
                const runsScored = this.advanceRunners(bases, batter.id, basesToAdvance);
                inningRuns += runsScored;
                log.push(`Runners advance ${basesToAdvance} base(s), ${runsScored} run(s) score.`);
            }

            const outsAfterPlay = Math.min(3, outs);
            const baseState = bases.map((b, idx) => `${idx + 1}B:${b ? '●' : '○'}`).join(' ');
            log.push(`Outs: ${outsAfterPlay} | ${baseState}`);
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
            outs,
            bases: [...bases],
            log: [...gameState.log, ...log]
        };
    }

    static simulateGame(homeTeam: Team, awayTeam: Team): GameSimulationResult {
        const awayOffense = this.simulateTeamOffense(awayTeam, homeTeam);
        const homeOffense = this.simulateTeamOffense(homeTeam, awayTeam);

        return {
            score: { home: homeOffense.runs, away: awayOffense.runs },
            batting: { ...awayOffense.batting, ...homeOffense.batting },
            pitching: { ...awayOffense.pitching, ...homeOffense.pitching }
        };
    }

    private static simulateTeamOffense(battingTeam: Team, defenseTeam: Team) {
        const batting: { [playerId: string]: { atBats: number; hits: number; rbi: number } } = {};
        const pitching: { [playerId: string]: { inningsPitched: number; runsAllowed: number; strikeouts: number } } = {};

        const lineup = battingTeam.lineup.length > 0 ? battingTeam.lineup : battingTeam.roster.map(p => p.id);
        const pitcher = defenseTeam.roster.find(p => p.id === defenseTeam.rotation[0]) || defenseTeam.roster[0];
        if (pitcher) {
            pitching[pitcher.id] = { inningsPitched: 0, runsAllowed: 0, strikeouts: 0 };
        }

        let runs = 0;
        let outs = 0;
        let batterIndex = 0;
        const bases: (string | null)[] = [null, null, null];

        for (let inning = 0; inning < 9; inning++) {
            outs = 0;
            bases[0] = bases[1] = bases[2] = null;

            while (outs < 3) {
                const batterId = lineup[batterIndex % Math.max(1, lineup.length)];
                const batter = battingTeam.roster.find(p => p.id === batterId) || battingTeam.roster[0];
                batterIndex++;

                if (!batter) {
                    outs++;
                    continue;
                }

                if (!batting[batter.id]) batting[batter.id] = { atBats: 0, hits: 0, rbi: 0 };

                const result = this.simulateAtBat(pitcher || batter, batter);
                batting[batter.id].atBats += result.type === 'OUT' || result.type === 'HIT' || result.type === 'HR' ? 1 : 0;

                if (result.type === 'OUT') {
                    outs += result.outs;
                    if (pitcher && result.detail === 'Strikeout') {
                        pitching[pitcher.id].strikeouts += 1;
                    }
                } else if (result.type === 'HR') {
                    const runnersOn = bases.filter(Boolean).length;
                    const rbis = 1 + runnersOn;
                    batting[batter.id].hits += 1;
                    batting[batter.id].rbi += rbis;
                    runs += rbis;
                    bases[0] = bases[1] = bases[2] = null;
                } else if (result.type === 'HIT') {
                    const basesToAdvance = result.detail === 'Double' ? 2 : 1;
                    const runsScored = this.advanceRunners(bases, batter.id, basesToAdvance);
                    batting[batter.id].hits += 1;
                    batting[batter.id].rbi += runsScored;
                    runs += runsScored;
                }
            }

            if (pitcher) {
                pitching[pitcher.id].inningsPitched += 1;
                pitching[pitcher.id].runsAllowed = runs;
            }
        }

        return { runs, batting, pitching };
    }
}
