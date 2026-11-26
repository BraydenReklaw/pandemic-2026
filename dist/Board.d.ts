import { CityCard } from "./Card";
import { City } from "./City";
export declare class Board {
    cards: CityCard[];
    cities: City[];
    cured: Boolean[];
    epidemicCount: number;
    infectionRate: number[];
    infectionDeck: CityCard[];
    infectionDiscard: CityCard[];
    constructor(cards: CityCard[]);
    initialize(): void;
}
//# sourceMappingURL=Board.d.ts.map