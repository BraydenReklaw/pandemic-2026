import { Player } from './Player';

export class City {
    name: string;
    color: string;
    infectionLevel: number[];
    players: Player[];
    researchStation: boolean;
    connectedCities: City[];
    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.infectionLevel = [0, 0, 0, 0]; // blue, yellow, black, red
        this.players = [];
        this.researchStation = false;
        this.connectedCities = [];
    }
}