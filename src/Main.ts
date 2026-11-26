import { CardLibrary } from "./CardLibrary";
import { Board } from "./Board";
import { Player } from "./Player";
import { Game } from "./Game";

async function main() {

    const cityLibrary = await CardLibrary.citiesFromFile("./cities.txt");

    const players = [new Player("Alice", 0), new Player("Bob", 1)];
    const board = new Board(cityLibrary.cards, players, 4);
    board.initialize();
    // const graphPath = await renderBoardGraph(board);
    // console.log(`Board graph visualization written to ${graphPath}`);

    // console.log(board.cities);
    console.log(board.infectionDeck)
    // console.log(board.infectionDeck.length)
    console.log(board.players[0]!.hand)
    console.log(board.PlayerDeck)
    const game = new Game(board);
    game.play();
}
main().catch(console.error);