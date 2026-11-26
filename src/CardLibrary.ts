import { readFile } from "node:fs/promises";
import { CityCard } from "./Card";

export class CardLibrary {
    readonly cards: CityCard[];

    constructor(cards: CityCard[]) {
        this.cards = cards;
    }

    static async citiesFromFile(filePath: string): Promise<CardLibrary> {
        const contents = await readFile(filePath, "utf8");
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

                return new CityCard(name, color);
            });

        return new CardLibrary(cards);
    }
}
