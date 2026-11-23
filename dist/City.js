"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
class City {
    name;
    infectionLevel;
    players;
    researchStation;
    connectedCities;
    constructor(name, infectionLevel) {
        this.name = name;
        this.infectionLevel = infectionLevel;
        this.players = [];
        this.researchStation = false;
        this.connectedCities = [];
    }
}
exports.City = City;
//# sourceMappingURL=City.js.map