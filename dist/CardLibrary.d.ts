import { CityCard, EventCard } from "./Card";
export declare class CardLibrary {
    readonly cards: CityCard[];
    constructor(cards: CityCard[]);
    static citiesFromFile(filePath: string): Promise<CardLibrary>;
    static generateEventCards(): EventCard[];
}
//# sourceMappingURL=CardLibrary.d.ts.map