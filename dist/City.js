"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
class City {
    name;
    color;
    infectionLevel;
    players;
    researchStation;
    connectedCities;
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.infectionLevel = [0, 0, 0, 0]; // blue, yellow, black, red
        this.players = [];
        this.researchStation = false;
        this.connectedCities = [];
    }
}
exports.City = City;
//# sourceMappingURL=City.js.map