import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Board } from "../Board";
import { createBoardGraphHtml } from "./BoardGraph";

export async function renderBoardGraph(board: Board): Promise<string> {
    const outputPath = resolve(process.cwd(), "src", "visualization", "board-graph.html");
    await writeFile(outputPath, createBoardGraphHtml(board), "utf8");
    return outputPath;
}
