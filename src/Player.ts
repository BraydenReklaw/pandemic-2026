import { Card } from "./Card";

export class Player {
    name: string;
    type: number;
    hand: Card[];
    role: number;

    // type: 0 is human, 1 is AI
    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
        this.hand = [];
        this.role = -1;
    }
}