import type { Forest, Tree } from "./forest-trees.mts";

export function foldTreeRecursive<S, T>(
    accumulator: S,
    tree: Tree<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (tree.tag === "Empty") return accumulator;
    return foldForestRecursive(fn(accumulator, tree.value), tree.forest, fn);
}

function foldForestRecursive<S, T>(
    accumulator: S,
    forest: Forest<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (forest.tag === "Nil") return accumulator;
    const newAcc = foldTreeRecursive(accumulator, forest.head, fn);
    return foldForestRecursive(newAcc, forest.tail, fn);
}

type FoldTreeFrame<S, T> = {
    tag: "FoldTreeFrame";
    accumulator: S;
    tree: Tree<T>;
    fn: (accumulator: S, value: T) => S;
    child: FoldForestFrame<S, T> | null;
    returnValue: null | {
        value: S;
    };
    parent: StackFrame<S, T>;
};

type FoldForestFrame<S, T> = {
    tag: "FoldForestFrame";
    accumulator: S;
    forest: Forest<T>;
    fn: (accumulator: S, value: T) => S;
    treeChild: FoldTreeFrame<S, T> | null;
    forestChild: FoldForestFrame<S, T> | null;
    returnValue: null | {
        value: S;
    };
    parent: StackFrame<S, T>;
};

type ExternalCaller<S, T> = {
    tag: "ExternalCaller";
    topFrame: FoldTreeFrame<S, T> | null;
};

type StackFrame<S, T> =
    | FoldTreeFrame<S, T>
    | FoldForestFrame<S, T>
    | ExternalCaller<S, T>;

function callFoldTree<S, T>(
    accumulator: S,
    tree: Tree<T>,
    fn: (accumulator: S, value: T) => S,
    parent: FoldForestFrame<S, T> | ExternalCaller<S, T>,
): FoldTreeFrame<S, T> {
    return {
        tag: "FoldTreeFrame",
        accumulator,
        fn,
        tree,
        child: null,
        returnValue: null,
        parent,
    };
}

function callFoldForest<S, T>(
    accumulator: S,
    forest: Forest<T>,
    fn: (accumulator: S, value: T) => S,
    parent: FoldTreeFrame<S, T> | FoldForestFrame<S, T>,
): FoldForestFrame<S, T> {
    return {
        tag: "FoldForestFrame",
        accumulator,
        forest,
        fn,
        treeChild: null,
        forestChild: null,
        returnValue: null,
        parent,
    };
}

function externalCaller<S, T>(): ExternalCaller<S, T> {
    return {
        tag: "ExternalCaller",
        topFrame: null,
    };
}

export function foldTreeIterative<S, T>(
    accumulator: S,
    tree: Tree<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    const caller: ExternalCaller<S, T> = externalCaller();

    const topFrame = callFoldTree(accumulator, tree, fn, caller);
    caller.topFrame = topFrame;

    let frame: StackFrame<S, T> = topFrame;

    while (frame.tag !== "ExternalCaller") {
        if (frame.tag === "FoldTreeFrame") {
            if (frame.tree.tag === "Empty") {
                frame.returnValue = { value: frame.accumulator };
                frame = frame.parent;
            } else {
                if (frame.child?.returnValue) {
                    frame.returnValue = {
                        value: frame.child.returnValue.value,
                    };
                    frame.child = null;
                    frame = frame.parent;
                } else {
                    const newAccumulator = fn(
                        frame.accumulator,
                        frame.tree.value,
                    );
                    frame.child = callFoldForest(
                        newAccumulator,
                        frame.tree.forest,
                        frame.fn,
                        frame,
                    );

                    frame = frame.child;
                }
            }
        } else if (frame.tag === "FoldForestFrame") {
            if (frame.forest.tag === "Nil") {
                frame.returnValue = { value: frame.accumulator };
                frame = frame.parent;
            } else {
                if (frame.forestChild?.returnValue) {
                    frame.returnValue = {
                        value: frame.forestChild.returnValue.value,
                    };
                    frame.treeChild = null;
                    frame.forestChild = null;
                    frame = frame.parent;
                } else if (frame.treeChild?.returnValue) {
                    frame.forestChild = callFoldForest(
                        frame.treeChild.returnValue.value,
                        frame.forest.tail,
                        frame.fn,
                        frame,
                    );

                    frame = frame.forestChild;
                } else {
                    frame.treeChild = callFoldTree(
                        frame.accumulator,
                        frame.forest.head,
                        frame.fn,
                        frame,
                    );

                    frame = frame.treeChild;
                }
            }
        }
    }

    return frame.topFrame?.returnValue?.value!;
}
