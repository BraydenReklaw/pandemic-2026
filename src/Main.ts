import { CardLibrary } from "./CardLibrary";
import { Board } from "./Board";

async function main() {

    const cityLibrary = await CardLibrary.fromFile("./cities.txt");

    const board = new Board(cityLibrary.cards);
    board.initialize();
    // const graphPath = await renderBoardGraph(board);
    // console.log(`Board graph visualization written to ${graphPath}`);

    // console.log(board.cities);
    // console.log(board.infectionDeck)
    // console.log(board.infectionDeck.length)
}
main().catch(console.error);