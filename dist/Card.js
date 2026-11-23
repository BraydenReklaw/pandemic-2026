"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityCard = exports.EventCard = exports.Card = void 0;
class Card {
    name;
    constructor(name) {
        this.name = name;
    }
}
exports.Card = Card;
class EventCard extends Card {
    constructor(name) {
        super(name);
    }
}
exports.EventCard = EventCard;
class CityCard extends Card {
    color;
    constructor(name, color) {
        super(name);
        this.color = color;
    }
}
exports.CityCard = CityCard;
//# sourceMappingURL=Card.js.map