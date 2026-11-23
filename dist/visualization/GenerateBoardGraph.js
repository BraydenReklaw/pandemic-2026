"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const Board_1 = require("../Board");
const CardLibrary_1 = require("../CardLibrary");
const RenderBoardGraph_1 = require("./RenderBoardGraph");
async function main() {
    const cardLibrary = await CardLibrary_1.CardLibrary.fromFile((0, node_path_1.resolve)(process.cwd(), "cities.txt"));
    const board = new Board_1.Board(cardLibrary.cards);
    const outputPath = await (0, RenderBoardGraph_1.renderBoardGraph)(board);
    console.log(`Board graph visualization written to ${outputPath}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=GenerateBoardGraph.js.map