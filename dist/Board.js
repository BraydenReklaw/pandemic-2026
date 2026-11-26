"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const Card_1 = require("./Card");
const CardLibrary_1 = require("./CardLibrary");
const City_1 = require("./City");
const BLUE = 0;
const YELLOW = 1;
const BLACK = 2;
const RED = 3;
class Board {
    cards;
    cities;
    cured;
    epidemicCount;
    infectionRate;
    infectionDeck;
    infectionDiscard;
    infectionCubes = {};
    PlayerDeck;
    players;
    infectionIndex;
    difficulty;
    constructor(cards, players, difficulty = 4) {
        this.cards = cards;
        this.players = players;
        this.cured = [false, false, false, false];
        this.epidemicCount = 0;
        this.infectionRate = [2, 2, 2, 3, 3, 4, 4];
        this.infectionIndex = 0;
        this.infectionDeck = [...cards];
        this.infectionDiscard = [];
        this.infectionCubes = {
            "blue": 24,
            "yellow": 24,
            "black": 24,
            "red": 24
        };
        this.PlayerDeck = CardLibrary_1.CardLibrary.generateEventCards();
        this.PlayerDeck = [...this.PlayerDeck, ...cards];
        this.difficulty = difficulty;
        const adjacency = {
            "San Francisco": ["Chicago", "Los Angeles", "Tokyo", "Manila"],
            Chicago: ["San Francisco", "Los Angeles", "Mexico City", "Atlanta", "Montreal"],
            Montreal: ["Chicago", "New York", "Washington D.C."],
            Atlanta: ["Chicago", "Miami", "Washington D.C."],
            "Washington D.C.": ["Atlanta", "Montreal", "New York", "Miami"],
            "New York": ["Montreal", "Washington D.C.", "London", "Madrid"],
            London: ["New York", "Madrid", "Essen", "Paris"],
            Madrid: ["New York", "London", "Paris", "Algiers", "Sao Paulo"],
            Paris: ["London", "Essen", "Milan", "Algiers", "Madrid"],
            Essen: ["London", "Paris", "Milan", "St. Petersburg"],
            Milan: ["Essen", "Paris", "Istanbul"],
            "St. Petersburg": ["Essen", "Istanbul", "Moscow"],
            "Los Angeles": ["San Francisco", "Chicago", "Mexico City", "Sydney"],
            "Mexico City": ["Los Angeles", "Chicago", "Miami", "Bogota", "Lima"],
            Miami: ["Atlanta", "Washington D.C.", "Mexico City", "Bogota"],
            Bogota: ["Mexico City", "Miami", "Lima", "Buenos Aires", "Sao Paulo"],
            Lima: ["Mexico City", "Bogota", "Santiago"],
            Santiago: ["Lima"],
            "Buenos Aires": ["Bogota", "Sao Paulo"],
            "Sao Paulo": ["Bogota", "Buenos Aires", "Madrid", "Lagos"],
            Lagos: ["Sao Paulo", "Khartoum", "Kinshasa"],
            Kinshasa: ["Lagos", "Khartoum", "Johannesburg"],
            Johannesburg: ["Kinshasa", "Khartoum"],
            Khartoum: ["Lagos", "Kinshasa", "Johannesburg", "Cairo"],
            Algiers: ["Madrid", "Paris", "Istanbul", "Cairo"],
            Istanbul: ["Milan", "St. Petersburg", "Moscow", "Baghdad", "Cairo", "Algiers"],
            Cairo: ["Algiers", "Istanbul", "Baghdad", "Riyadh", "Khartoum"],
            Baghdad: ["Istanbul", "Tehran", "Karachi", "Riyadh", "Cairo"],
            Riyadh: ["Cairo", "Baghdad", "Karachi"],
            Karachi: ["Tehran", "Baghdad", "Riyadh", "Mumbai", "Delhi"],
            Mumbai: ["Karachi", "Delhi", "Chennai"],
            Delhi: ["Tehran", "Karachi", "Mumbai", "Chennai", "Kolkata"],
            Chennai: ["Mumbai", "Delhi", "Kolkata", "Bangkok", "Jakarta"],
            Kolkata: ["Delhi", "Chennai", "Bangkok", "Hong Kong"],
            Tehran: ["Moscow", "Baghdad", "Karachi", "Delhi"],
            Moscow: ["St. Petersburg", "Istanbul", "Tehran"],
            Beijing: ["Seoul", "Shanghai"],
            Seoul: ["Beijing", "Shanghai", "Tokyo"],
            Tokyo: ["Seoul", "Osaka", "Shanghai", "San Francisco"],
            Osaka: ["Tokyo", "Taipei"],
            Taipei: ["Osaka", "Shanghai", "Hong Kong", "Manila"],
            Shanghai: ["Beijing", "Seoul", "Tokyo", "Taipei", "Hong Kong"],
            "Hong Kong": ["Kolkata", "Bangkok", "Ho Chi Minh City", "Shanghai", "Taipei", "Manila"],
            "Ho Chi Minh City": ["Bangkok", "Hong Kong", "Manila", "Jakarta"],
            Manila: ["Taipei", "Hong Kong", "Ho Chi Minh City", "Sydney", "San Francisco"],
            Sydney: ["Jakarta", "Manila", "Los Angeles"],
            Bangkok: ["Kolkata", "Chennai", "Jakarta", "Ho Chi Minh City", "Hong Kong"],
            Jakarta: ["Chennai", "Bangkok", "Ho Chi Minh City", "Sydney"],
        };
        const citiesByName = new Map();
        for (const name of Object.keys(adjacency)) {
            citiesByName.set(name, new City_1.City(name, this.cards.find((card) => card.name === name)?.color || ""));
        }
        this.cities = Array.from(citiesByName.values());
        for (const [name, neighborNames] of Object.entries(adjacency)) {
            const city = citiesByName.get(name);
            if (!city) {
                throw new Error(`Missing city definition for "${name}"`);
            }
            city.connectedCities = neighborNames.map((neighborName) => {
                const neighbor = citiesByName.get(neighborName);
                if (!neighbor) {
                    throw new Error(`Unknown neighboring city "${neighborName}" connected to "${name}"`);
                }
                return neighbor;
            });
        }
    }
    getCity(name) {
        const city = this.cities.find((c) => c.name === name);
        if (!city) {
            throw new Error(`City "${name}" not found on the board`);
        }
        return city;
    }
    getColorIndex(color) {
        if (color === "blue")
            return BLUE;
        if (color === "yellow")
            return YELLOW;
        if (color === "black")
            return BLACK;
        if (color === "red")
            return RED;
        throw new Error(`Unknown color "${color}"`);
    }
    endGame(message) {
        console.log(message);
        process.exit(0);
    }
    subtractInfectionCubes(color, amount) {
        this.infectionCubes[color] -= amount;
        if (this.infectionCubes[color] <= 0) {
            this.endGame(`Infection cubes of color ${color} have run out. Game over!`);
        }
    }
    outbreak(city, visited, color) {
        this.epidemicCount += 1;
        if (this.epidemicCount >= 8) {
            this.endGame("Too many outbreaks have occurred. Game over!");
        }
        for (const neighbor of city.connectedCities) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                neighbor.infectionLevel[color] += 1;
                this.subtractInfectionCubes(city.color, 1);
                if (neighbor.infectionLevel[color] > 3) {
                    neighbor.infectionLevel[color] = 3;
                    this.outbreak(neighbor, visited, color);
                }
            }
        }
    }
    infect(cityCard, amount, color) {
        const city = this.getCity(cityCard.name);
        city.infectionLevel[color] += amount;
        this.subtractInfectionCubes(cityCard.color, amount);
        if (city.infectionLevel[color] > 3) {
            city.infectionLevel[color] = 3;
            this.outbreak(city, new Set([city]), color);
        }
    }
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    initialize() {
        const atlanta = this.cities.find((city) => city.name === "Atlanta");
        atlanta.researchStation = true;
        // set up initial infection levels for cities
        this.infectionDeck = this.shuffle(this.infectionDeck);
        for (var i = 3; i > 0; i--) {
            for (var j = 0; j < 3; j++) {
                const city = this.infectionDeck.pop();
                const color = this.getColorIndex(city.color);
                this.infect(city, i, color);
                this.infectionDiscard.push(city);
            }
        }
        // set up player deck and deal hands to players
        this.PlayerDeck = this.shuffle(this.PlayerDeck);
        for (const player of this.players) {
            player.hand.push(this.PlayerDeck.pop());
            player.hand.push(this.PlayerDeck.pop());
            if (this.players.length === 2) {
                player.hand.push(this.PlayerDeck.pop());
                player.hand.push(this.PlayerDeck.pop());
            }
            else if (this.players.length === 3) {
                player.hand.push(this.PlayerDeck.pop());
            }
        }
        // Set up playerDeck with epidemic cards
        var epidemicDeck = [];
        for (let i = 0; i < this.difficulty; i++) {
            var deck = [];
            const epidemicCard = new Card_1.EventCard("Epidemic");
            deck.push(epidemicCard);
            epidemicDeck.push(deck);
        }
        while (this.PlayerDeck.length > 0) {
            for (let i = 0; i < epidemicDeck.length; i++) {
                if (this.PlayerDeck.length === 0) {
                    break;
                }
                epidemicDeck[i].push(this.PlayerDeck.pop());
            }
        }
        for (let i = 0; i < epidemicDeck.length; i++) {
            epidemicDeck[i] = this.shuffle(epidemicDeck[i]);
        }
        this.PlayerDeck = epidemicDeck.flat();
    }
}
exports.Board = Board;
//# sourceMappingURL=Board.js.map