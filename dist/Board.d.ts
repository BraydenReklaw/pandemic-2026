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
    private getCity;
    outbreak(city: City, visited: Set<City>): void;
    infect(cityCard: CityCard, amount: number): void;
    shuffle(array: CityCard[]): CityCard[];
    initialize(): void;
}
//# sourceMappingURL=Board.d.ts.map