import { StorageManager } from './src/utils/storage';
import { SeasonManager } from './src/utils/season';
import { Team, Position } from './src/types/baseball';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock Teams
const mockTeams: Team[] = Array(2).fill(null).map((_, i) => ({
    id: `t${i}`, name: `Team ${i}`, abbreviation: `T${i}`, color: '#000',
    roster: [], lineup: [], rotation: []
}));

console.log("Creating Season...");
const season = SeasonManager.createSeason(2024, mockTeams);

console.log("Testing Save...");
StorageManager.saveSeason(season);

if (StorageManager.hasSave()) {
    console.log("Save detected.");
} else {
    console.error("Save NOT detected.");
}

console.log("Testing Load...");
const loadedSeason = StorageManager.loadSeason();

if (loadedSeason && loadedSeason.year === 2024) {
    console.log("Season loaded successfully.");
} else {
    console.error("Failed to load season.");
}

console.log("Testing Clear...");
StorageManager.clearSave();
if (!StorageManager.hasSave()) {
    console.log("Save cleared successfully.");
} else {
    console.error("Save NOT cleared.");
}
