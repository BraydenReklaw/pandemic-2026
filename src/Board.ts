import {CityCard} from "./Card";
import { City } from "./City";

export class Board {
    cards: CityCard[];
    cities: City[];
    cured: Boolean[];
    epidemicCount: number;
    infectionRate: number[];
    infectionDeck: CityCard[];
    infectionDiscard: CityCard[];
    infectionCubes: Record<string, number> = {};


    constructor(cards: CityCard[]) {
        this.cards = cards;
        this.cured = [false, false, false, false];
        this.epidemicCount = 0;
        this.infectionRate = [2, 2, 2, 3, 3, 4, 4];
        this.infectionDeck = [...cards];
        this.infectionDiscard = [];
        this.infectionCubes = {
            "blue": 24,
            "yellow": 24,
            "black": 24,
            "red": 24
        };
        const adjacency: Record<string, string[]> = {
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

        const citiesByName = new Map<string, City>();
        for (const name of Object.keys(adjacency)) {
            citiesByName.set(name, new City(name, 0));
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

    private getCity(name: string): City {
        const city = this.cities.find((c) => c.name === name);
        if (!city) {
            throw new Error(`City "${name}" not found on the board`);
        }
        return city;
    }

    endGame(message: string): void {
        console.log(message);
        process.exit(0);
    }

    subtractInfectionCubes(color: string, amount: number): void {
        this.infectionCubes[color]! -= amount;
        if (this.infectionCubes[color]! <= 0) {
            this.endGame(`Infection cubes of color ${color} have run out. Game over!`);
        }
    }

    outbreak(city: City, visited: Set<City>, color: string): void {
        this.epidemicCount += 1;
        for (const neighbor of city.connectedCities) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                neighbor.infectionLevel += 1;
                this.subtractInfectionCubes(color, 1);
                if (neighbor.infectionLevel > 3) {
                    neighbor.infectionLevel = 3;
                    this.outbreak(neighbor, visited, color);
                }
            }
        }
    }

    infect(cityCard: CityCard, amount: number): void {
        const city = this.getCity(cityCard.name);
        city.infectionLevel += amount;
        this.subtractInfectionCubes(cityCard.color, amount);
        if (city.infectionLevel > 3) {
            city.infectionLevel = 3;
            this.outbreak(city, new Set<City>([city]), cityCard.color);
        }
    }

    shuffle(array: CityCard[]): CityCard[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
        }
        return shuffled;
    }

    initialize(): void {
        const atlanta = this.cities.find((city) => city.name === "Atlanta");
        atlanta!.researchStation = true;
        // set up initial infection levels for cities
        this.infectionDeck = this.shuffle(this.infectionDeck);
        for (var i = 3; i > 0; i--) {
            for (var j = 0; j < 3; j++) {
                const city = this.infectionDeck.pop();
                this.infect(city!, i); 
                this.infectionDiscard.push(city!);
            }
        }
    }
}