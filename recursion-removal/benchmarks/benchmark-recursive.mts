import { readFileSync } from "node:fs";
import { run, bench, boxplot, summary, do_not_optimize } from "mitata";
import { foldTreeDepthFirst, foldIterative } from "./mutual-recursion-5.mts";

const input = JSON.parse(readFileSync("benchmark-input.json", "utf-8"));

function collect(acc: Array<number>, x: number): Array<number> {
    acc.push(x);
    return acc;
}

boxplot(() => {
    summary(() => {
        bench("Recursive", function* run(state: any) {
            const tree = state.get("tree");
            yield () =>
                do_not_optimize(
                    foldTreeDepthFirst([] as Array<number>, tree, collect),
                );
        })
            .gc("inner")
            .args("tree", input);
    });
});

await run();
