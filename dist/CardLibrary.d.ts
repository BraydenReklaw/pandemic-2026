import { CityCard } from "./Card";
export declare class CardLibrary {
    readonly cards: CityCard[];
    constructor(cards: CityCard[]);
    static fromFile(filePath: string): Promise<CardLibrary>;
}
//# sourceMappingURL=CardLibrary.d.ts.map