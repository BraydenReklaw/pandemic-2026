"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardLibrary_1 = require("./CardLibrary");
const Board_1 = require("./Board");
const Player_1 = require("./Player");
async function main() {
    const cityLibrary = await CardLibrary_1.CardLibrary.citiesFromFile("./cities.txt");
    const players = [new Player_1.Player("Alice", 0), new Player_1.Player("Bob", 1)];
    const board = new Board_1.Board(cityLibrary.cards, players, 4);
    board.initialize();
    // const graphPath = await renderBoardGraph(board);
    // console.log(`Board graph visualization written to ${graphPath}`);
    // console.log(board.cities);
    console.log(board.infectionDeck);
    // console.log(board.infectionDeck.length)
    console.log(board.players);
    console.log(board.PlayerDeck);
}
main().catch(console.error);
//# sourceMappingURL=Main.js.map