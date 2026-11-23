"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLibrary = void 0;
const promises_1 = require("node:fs/promises");
const Card_1 = require("./Card");
class CardLibrary {
    cards;
    constructor(cards) {
        this.cards = cards;
    }
    static async fromFile(filePath) {
        const contents = await (0, promises_1.readFile)(filePath, "utf8");
        const cards = contents
            .split(/\r?\n/)
            .filter((line) => line.trim().length > 0)
            .map((line, index) => {
            const separator = line.lastIndexOf(",");
            if (separator === -1) {
                throw new Error(`Invalid card entry on line ${index + 1}: expected "city, color"`);
            }
            const name = line.slice(0, separator).trim();
            const color = line.slice(separator + 1).trim();
            if (name.length === 0 || color.length === 0) {
                throw new Error(`Invalid card entry on line ${index + 1}: city and color are required`);
            }
            return new Card_1.CityCard(name, color);
        });
        return new CardLibrary(cards);
    }
}
exports.CardLibrary = CardLibrary;
//# sourceMappingURL=CardLibrary.js.map