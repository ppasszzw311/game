import { GameEngine } from './src/utils/engine';
import { Player, Position, Team } from './src/types/baseball';

// Mock Data
const mockPitcher: Player = {
    id: 'p1', firstName: 'Shohei', lastName: 'Ohtani', age: 29,
    primaryPosition: 'P', secondaryPositions: [],
    attributes: {
        contact: 95, power: 99, vision: 90, speed: 85,
        fielding: 80, arm: 95, reaction: 85,
        velocity: 165, control: 90, stamina: 95, breaking: 90
    },
    pitchTypes: ['FourSeam', 'Slider'],
    condition: 3, fatigue: 0
};

const mockBatter: Player = {
    id: 'b1', firstName: 'Mike', lastName: 'Trout', age: 32,
    primaryPosition: 'CF', secondaryPositions: [],
    attributes: {
        contact: 90, power: 95, vision: 85, speed: 90,
        fielding: 90, arm: 90, reaction: 90,
        velocity: 0, control: 0, stamina: 0, breaking: 0
    },
    pitchTypes: [],
    condition: 3, fatigue: 0
};

console.log("Simulating 10 At-Bats:");
for (let i = 0; i < 10; i++) {
    const result = GameEngine.simulateAtBat(mockPitcher, mockBatter);
    console.log(`At-Bat ${i + 1}: ${result.detail} (${result.type})`);
}
