import {CityCard} from "./Card";
import { City } from "./City";

export class Board {
    cards: CityCard[];
    cities: City[];
    cured: Boolean[];
    epidemicCount: number;

    constructor(cards: CityCard[]) {
        this.cards = cards;
        this.cured = [false, false, false, false];
        this.epidemicCount = 0;
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

    initialize(): void {
        const atlanta = this.cities.find((city) => city.name === "Atlanta");
        atlanta!.researchStation = true;
    }
}