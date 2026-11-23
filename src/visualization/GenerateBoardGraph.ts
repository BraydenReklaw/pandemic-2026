import { resolve } from "node:path";
import { Board } from "../Board";
import { CardLibrary } from "../CardLibrary";
import { renderBoardGraph } from "./RenderBoardGraph";

async function main(): Promise<void> {
    const cardLibrary = await CardLibrary.fromFile(resolve(process.cwd(), "cities.txt"));
    const board = new Board(cardLibrary.cards);
    const outputPath = await renderBoardGraph(board);
    console.log(`Board graph visualization written to ${outputPath}`);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
