"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBoardGraph = renderBoardGraph;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const BoardGraph_1 = require("./BoardGraph");
async function renderBoardGraph(board) {
    const outputPath = (0, node_path_1.resolve)(process.cwd(), "src", "visualization", "board-graph.html");
    await (0, promises_1.writeFile)(outputPath, (0, BoardGraph_1.createBoardGraphHtml)(board), "utf8");
    return outputPath;
}
//# sourceMappingURL=RenderBoardGraph.js.map