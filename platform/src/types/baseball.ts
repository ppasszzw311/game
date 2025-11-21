export type Position =
    | 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH';

export const Position = {
    P: 'P' as Position,
    C: 'C' as Position,
    FirstBase: '1B' as Position,
    SecondBase: '2B' as Position,
    ThirdBase: '3B' as Position,
    SS: 'SS' as Position,
    LF: 'LF' as Position,
    CF: 'CF' as Position,
    RF: 'RF' as Position,
    DH: 'DH' as Position
};

export type PitchType =
    | 'FourSeam' | 'TwoSeam' | 'Slider' | 'Curve' | 'Changeup' | 'Fork';

export const PitchType = {
    FourSeam: 'FourSeam' as PitchType,
    TwoSeam: 'TwoSeam' as PitchType,
    Slider: 'Slider' as PitchType,
    Curve: 'Curve' as PitchType,
    Changeup: 'Changeup' as PitchType,
    Fork: 'Fork' as PitchType
};

export interface PlayerAttributes {
    // Hitting
    contact: number; // 0-100
    power: number;   // 0-100
    vision: number;  // 0-100
    speed: number;   // 0-100

    // Fielding
    fielding: number; // 0-100
    arm: number;      // 0-100
    reaction: number; // 0-100

    // Pitching
    velocity: number; // km/h
    control: number;  // 0-100
    stamina: number;  // 0-100
    breaking: number; // 0-100
}

export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    primaryPosition: Position;
    secondaryPositions: Position[];
    attributes: PlayerAttributes;
    pitchTypes: PitchType[];

    // Dynamic stats
    condition: number; // 0-4 (Sad to Happy face)
    fatigue: number;   // 0-100
}

export interface Team {
    id: string;
    name: string;
    abbreviation: string;
    color: string;
    roster: Player[];
    lineup: string[]; // Player IDs in batting order
    rotation: string[]; // Player IDs in pitching rotation
}

export interface GameState {
    inning: number;
    isTop: boolean;
    outs: number;
    balls: number;
    strikes: number;
    bases: (string | null)[]; // Player IDs on 1st, 2nd, 3rd
    score: {
        home: number;
        away: number;
    };
    log: string[];
}

export interface GameSchedule {
    id: string;
    day: number;
    homeTeamId: string;
    awayTeamId: string;
    isPlayed: boolean;
    score?: {
        home: number;
        away: number;
    };
}

export interface Season {
    id: string;
    year: number;
    currentDay: number;
    teams: Team[];
    schedule: GameSchedule[];
    standings: { [teamId: string]: TeamStats };
}

export interface TeamStats {
    wins: number;
    losses: number;
    ties: number;
    gamesBack: number;
    runsScored: number;
    runsAllowed: number;
}
