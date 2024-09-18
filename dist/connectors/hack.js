"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackConnector = void 0;
class HackConnector {
    constructor(settings) {
        this.settings = settings;
    }
    async getBalance() {
        if (!this.settings.url) {
            throw new Error("URL is required");
        }
        const response = await fetch(this.settings.url);
        const data = await response.json();
        return {
            value: data.value,
            cost: data.cost,
        };
    }
}
exports.HackConnector = HackConnector;
