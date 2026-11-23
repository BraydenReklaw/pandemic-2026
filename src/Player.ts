import { Card } from "./Card";

export class Player {
    name: string;
    type: string;
    hand: Card[];
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
        this.hand = [];
    }
}