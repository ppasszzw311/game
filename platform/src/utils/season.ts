import type { Team, Season, GameSchedule, TeamStats } from '../types/baseball';
import { GameEngine } from './engine';

export class SeasonManager {

    static createSeason(year: number, teams: Team[]): Season {
        const schedule = this.generateRoundRobinSchedule(teams);
        const standings: { [teamId: string]: TeamStats } = {};

        teams.forEach(team => {
            standings[team.id] = {
                wins: 0, losses: 0, ties: 0, gamesBack: 0,
                runsScored: 0, runsAllowed: 0
            };
        });

        return {
            id: `season-${year}`,
            year,
            currentDay: 1,
            teams,
            schedule,
            standings
        };
    }

    static generateRoundRobinSchedule(teams: Team[]): GameSchedule[] {
        const schedule: GameSchedule[] = [];
        const numTeams = teams.length;
        if (numTeams % 2 !== 0) return []; // Simplified: require even teams

        // Simple Round Robin Algorithm
        // Rotate teams array (keep first fixed)
        const teamIds = teams.map(t => t.id);
        const rounds = numTeams - 1;
        const gamesPerRound = numTeams / 2;

        let currentTeamIds = [...teamIds];

        const matchups: { home: string; away: string }[] = [];

        for (let round = 0; round < rounds; round++) {
            for (let i = 0; i < gamesPerRound; i++) {
                const home = currentTeamIds[i];
                const away = currentTeamIds[numTeams - 1 - i];

                matchups.push({ home, away });
            }

            // Rotate (keep index 0 fixed, rotate rest)
            const fixed = currentTeamIds[0];
            const rotated = currentTeamIds.slice(1);
            rotated.unshift(rotated.pop()!);
            currentTeamIds = [fixed, ...rotated];
        }

        // Repeat matchups until we reach 100 games
        let day = 1;
        while (schedule.length < 100) {
            matchups.forEach((matchup, idx) => {
                if (schedule.length < 100) {
                    schedule.push({
                        id: `g-${day}-${idx}`,
                        day,
                        homeTeamId: matchup.home,
                        awayTeamId: matchup.away,
                        isPlayed: false
                    });
                }
            });
            day++;
        }

        return schedule;
    }

    static simulateDay(season: Season): Season {
        const todaysGames = season.schedule.filter(g => g.day === season.currentDay && !g.isPlayed);
        const newStandings = { ...season.standings };

        todaysGames.forEach(game => {
            const homeTeam = season.teams.find(t => t.id === game.homeTeamId)!;
            const awayTeam = season.teams.find(t => t.id === game.awayTeamId)!;

            // Simulate Game (Quick Sim)
            const result = GameEngine.simulateGame(homeTeam, awayTeam); // Need to implement simulateGame in Engine first

            // Update Schedule
            game.isPlayed = true;
            game.score = { home: result.score.home, away: result.score.away };

            // Update Standings
            const homeStats = newStandings[game.homeTeamId];
            const awayStats = newStandings[game.awayTeamId];

            homeStats.runsScored += result.score.home;
            homeStats.runsAllowed += result.score.away;
            awayStats.runsScored += result.score.away;
            awayStats.runsAllowed += result.score.home;

            if (result.score.home > result.score.away) {
                homeStats.wins++;
                awayStats.losses++;
            } else if (result.score.away > result.score.home) {
                awayStats.wins++;
                homeStats.losses++;
            } else {
                homeStats.ties++;
                awayStats.ties++;
            }
        });

        return {
            ...season,
            currentDay: season.currentDay + 1,
            standings: newStandings
        };
    }
}
