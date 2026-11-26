import { CardLibrary } from "./CardLibrary";
import { Board } from "./Board";
import { Player } from "./Player";

async function main() {

    const cityLibrary = await CardLibrary.citiesFromFile("./cities.txt");

    const players = [new Player("Alice", 0), new Player("Bob", 1)];
    const board = new Board(cityLibrary.cards, players, 4);
    board.initialize();
    // const graphPath = await renderBoardGraph(board);
    // console.log(`Board graph visualization written to ${graphPath}`);

    console.log(board.cities);
    // console.log(board.infectionDeck)
    console.log(board.infectionDeck.length)
}
main().catch(console.error);