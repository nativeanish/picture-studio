export default class LocalStorageService {
    static getItem(key: string) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error retrieving from local storage:', error);
            return null;
        }
    }

    static setItem(key: string, value: { value: string, type: "arconnect" | "arweave.app" }) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error storing to local storage:', error);
        }
    }

    static removeItem(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from local storage:', error);
        }
    }
}