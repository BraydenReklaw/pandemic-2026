import {Board} from "./Board"

export class Game {
    board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    play() {
        console.log("Starting the game...");
        // Implement the game loop here
    }
}