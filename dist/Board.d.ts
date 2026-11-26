import { Card, CityCard } from "./Card";
import { City } from "./City";
import { Player } from "./Player";
export declare class Board {
    cards: CityCard[];
    cities: City[];
    cured: Boolean[];
    epidemicCount: number;
    infectionRate: number[];
    infectionDeck: CityCard[];
    infectionDiscard: CityCard[];
    infectionCubes: Record<string, number>;
    PlayerDeck: Card[];
    players: Player[];
    infectionIndex: number;
    difficulty: number;
    constructor(cards: CityCard[], players: Player[], difficulty?: number);
    private getCity;
    private getColorIndex;
    endGame(message: string): void;
    subtractInfectionCubes(color: string, amount: number): void;
    outbreak(city: City, visited: Set<City>, color: number): void;
    infect(cityCard: CityCard, amount: number, color: number): void;
    shuffle<T extends Card>(array: T[]): T[];
    initialize(): void;
}
//# sourceMappingURL=Board.d.ts.map