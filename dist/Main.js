"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardLibrary_1 = require("./CardLibrary");
const Board_1 = require("./Board");
const RenderBoardGraph_1 = require("./visualization/RenderBoardGraph");
async function main() {
    const cityLibrary = await CardLibrary_1.CardLibrary.fromFile("./cities.txt");
    const board = new Board_1.Board(cityLibrary.cards);
    board.initialize();
    const graphPath = await (0, RenderBoardGraph_1.renderBoardGraph)(board);
    console.log(`Board graph visualization written to ${graphPath}`);
    console.log(board.cities);
}
main().catch(console.error);
//# sourceMappingURL=Main.js.map