import { Player } from './Player';

export class City {
    name: string;
    infectionLevel: number;
    players: Player[];
    researchStation: boolean;
    connectedCities: City[];
    constructor(name: string, infectionLevel: number) {
        this.name = name;
        this.infectionLevel = infectionLevel;
        this.players = [];
        this.researchStation = false;
        this.connectedCities = [];
    }
}