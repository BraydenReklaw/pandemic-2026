export class Card {
    name: string
    constructor(name: string) {
        this.name = name;
    }
}

export class EventCard extends Card {
    constructor(name: string) {
        super(name);
    }
}

export class CityCard extends Card {
    color: string

    constructor(name: string, color: string) {
        super(name);
        this.color = color
    }
}