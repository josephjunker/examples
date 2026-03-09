import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as fc from 'fast-check';

// begin-snippet: tree-forest-definitions
type Tree<T> =
    | {
          tag: "Empty";
      }
    | {
          tag: "Node";
          value: T;
          forest: Forest<T>;
      };

type Forest<T> =
    | {
          tag: "Nil";
      }
    | {
          tag: "Cons";
          head: Tree<T>;
          tail: Forest<T>;
      };

function empty<T>(): Tree<T> {
    return {
        tag: "Empty",
    };
}

function node<T>(value: T, forest: Forest<T>): Tree<T> {
    return {
        tag: "Node",
        value,
        forest,
    };
}

function nil<T>(): Forest<T> {
    return {
        tag: "Nil",
    };
}

function cons<T>(head: Tree<T>, tail: Forest<T>): Forest<T> {
    return {
        tag: "Cons",
        head,
        tail,
    };
}
// end-snippet

// begin-snippet: sample-tree
const exampleTree = node(
    1,
    cons(
        node(2, cons(node(3, nil()), nil())),
        cons(
            node(4, cons(
                        empty(), 
                        cons(node(6, nil()), nil()))),
            nil()),
    ),
);
// end-snippet

// begin-snippet: fold-tree-forest
function foldTree<S, T>(
    accumulator: S,
    tree: Tree<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (tree.tag === "Empty") return accumulator;
    return foldForest(fn(accumulator, tree.value), tree.forest, fn);
}

function foldForest<S, T>(
    accumulator: S,
    forest: Forest<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (forest.tag === "Nil") return accumulator;
    const newAcc = foldTree(accumulator, forest.head, fn);
    return foldForest(newAcc, forest.tail, fn);
}
// end-snippet

// begin-snippet: collect-recursive
function collectRecursive<T>(tree: Tree<T>): Array<T> {
    return foldTree([] as Array<T>, tree, (acc, value) => [
        ...acc,
        value,
    ]);
}

console.dir(collectRecursive(exampleTree));
// outputs: [ 1, 2, 3, 4, 6 ]
// end-snippet

test("collectRecursive works on exampleTree", () => {
    assert.equal(collectRecursive(exampleTree), [1, 2, 3, 4, 6]);
});


// begin-snippet: fold-tree-frame-type
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
// end-snippet

// begin-snippet: fold-forest-frame-type
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
// end-snippet

// begin-snippet: stack-frame-type
type ExternalCaller<S, T> = {
    tag: "ExternalCaller";
    topFrame: FoldTreeFrame<S, T> | null;
};

type StackFrame<S, T> =
    | FoldTreeFrame<S, T>
    | FoldForestFrame<S, T>
    | ExternalCaller<S, T>;
// end-snippet

// begin-snippet: helper-functions
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

function externalCaller<S, T>(
): ExternalCaller<S, T> {
    return {
        tag: "ExternalCaller",
        topFrame: null,
    };
}
// end-snippet

// begin-snippet: fold-tree-iterative-full
function foldTreeIterative<S, T>(
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
// end-snippet

// begin-snippet: arbitraries
const arbitraries = fc.letrec((tie) => ({
    empty: fc.constant({ tag: "Empty" }),
    node: fc.record({
        tag: fc.constant("Node"),
        value: fc.nat(),
        forest: tie("forest"),
    }),
    tree: fc.oneof(tie("empty"), {
        arbitrary: tie("node"),
        weight: 5,
    }),
    nil: fc.constant({ tag: "Nil" }),
    cons: fc.record({
        tag: fc.constant("Cons"),
        head: tie("tree"),
        tail: tie("forest"),
    }),
    forest: fc.oneof({ depthSize: "medium" }, tie("nil"), {
        arbitrary: tie("cons"),
        weight: 5,
    }),
}));
// end-snippet

// begin-snippet: arbitraries-statistics
fc.statistics(
    arbitraries.tree as fc.Arbitrary<Tree<number>>,
    (tree) => {
        const nodeCount = foldTree(0, tree, (acc, node) => acc + 1);
        if (nodeCount < 5) return "Under 5 nodes";
        if (nodeCount < 10) return "5 to 10 nodes";
        return "10 nodes or more";
    },
    { numRuns: 5000 },
);
// end-snippet

// begin-snippet: equivalence-test
test("Equivalence", () => {
    fc.assert(
        fc.property(arbitraries.tree as fc.Arbitrary<Tree<number>>, (tree) => {
            function foldingFn(
                acc: Array<number>,
                value: number,
            ): Array<number> {
                return [...acc, value];
            }

            const recursiveResult = foldTree(
                [] as Array<number>,
                tree,
                foldingFn,
            );

            const iterativeResult = foldTreeIterative(
                [] as Array<number>,
                tree,
                foldingFn,
            );

            assert.equal(recursiveResult, iterativeResult);
        }),
        { numRuns: 500 },
    );
});

test.run();
// end-snippet