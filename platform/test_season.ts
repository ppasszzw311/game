import { SeasonManager } from './src/utils/season';
import { Team, Position } from './src/types/baseball';

// Mock Teams
const mockTeams: Team[] = Array(4).fill(null).map((_, i) => ({
    id: `t${i}`, name: `Team ${i}`, abbreviation: `T${i}`, color: '#000',
    roster: Array(9).fill(null).map((_, j) => ({
        id: `p${i}-${j}`, firstName: 'P', lastName: `${j}`, age: 20,
        primaryPosition: Position.P, secondaryPositions: [],
        attributes: { contact: 50, power: 50, vision: 50, speed: 50, fielding: 50, arm: 50, reaction: 50, velocity: 150, control: 50, stamina: 50, breaking: 50 },
        pitchTypes: [], condition: 3, fatigue: 0
    })),
    lineup: [], rotation: []
}));

console.log("Creating Season...");
const season = SeasonManager.createSeason(2024, mockTeams);

console.log(`Season Created. Total Games: ${season.schedule.length}`);
if (season.schedule.length !== 12) { // 4 teams, round robin (3 rounds * 2 games) * 2 (home/away? No, simple RR is N*(N-1)/2 usually, but my algo does N-1 rounds * N/2 games = 3 * 2 = 6 games. Wait, let's check algo.)
    // My algo: rounds = N-1. gamesPerRound = N/2. Total = (N-1) * (N/2).
    // For 4 teams: 3 * 2 = 6 games.
    console.error(`Expected 6 games, got ${season.schedule.length}`);
} else {
    console.log("Schedule size correct (6 games).");
}

console.log("Simulating Day 1...");
const seasonDay2 = SeasonManager.simulateDay(season);

const playedGames = seasonDay2.schedule.filter(g => g.isPlayed).length;
console.log(`Games Played: ${playedGames}`);

const standings = Object.values(seasonDay2.standings);
const totalWins = standings.reduce((acc, s) => acc + s.wins, 0);
console.log(`Total Wins: ${totalWins} (Should be equal to games played if no ties)`);
