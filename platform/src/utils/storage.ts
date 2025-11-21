import type { Season } from '../types/baseball';

const STORAGE_KEY = 'power_pros_season';

export const StorageManager = {
    saveSeason: (season: Season): void => {
        try {
            const json = JSON.stringify(season);
            localStorage.setItem(STORAGE_KEY, json);
            console.log('Season saved successfully.');
        } catch (error) {
            console.error('Failed to save season:', error);
        }
    },

    loadSeason: (): Season | null => {
        try {
            const json = localStorage.getItem(STORAGE_KEY);
            if (!json) return null;
            return JSON.parse(json) as Season;
        } catch (error) {
            console.error('Failed to load season:', error);
            return null;
        }
    },

    hasSave: (): boolean => {
        return !!localStorage.getItem(STORAGE_KEY);
    },

    clearSave: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
