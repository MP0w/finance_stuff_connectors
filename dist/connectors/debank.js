"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebankConnector = void 0;
class DebankConnector {
    constructor(settings) {
        this.settings = settings;
    }
    async getBalance() {
        throw new Error("Method not implemented.");
    }
}
exports.DebankConnector = DebankConnector;
