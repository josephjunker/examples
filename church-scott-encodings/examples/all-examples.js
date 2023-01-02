"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const nil = { tag: "nil" };
function cons(head, tail) {
    return { tag: "cons", head, tail };
}
// end-snippet
// begin-snippet: one-two-three
const oneTwoThree = cons(1, cons(2, cons(3, nil)));
// end-snippet
// begin-snippet: consume-adt-list
if (oneTwoThree.tag === "cons") {
    console.log(`First item: ${oneTwoThree.head}`);
}
function listLength(list) {
    let i = 0;
    let l = list;
    while (l.tag !== "nil") {
        i++;
        l = l.tail;
    }
    return i;
}
// end-snippet
assert_1.strict.equal(listLength(oneTwoThree), 3);
const churchNil = ({ nil }) => nil();
function churchCons(head, tail) {
    return function encodedCons({ cons, nil }) {
        return cons(head, tail({ nil, cons }));
    };
}
const fourFiveSix = churchCons(4, churchCons(5, churchCons(6, churchNil)));
// end-snippet
// begin-snippet: sum-functions
function adtSum(list) {
    if (list.tag === "nil") {
        return 0;
    }
    return list.head + adtSum(list.tail);
}
function churchSum(list) {
    return list({
        cons: (x, y) => x + y,
        nil: () => 0
    });
}
// end-snippet
assert_1.strict.equal(adtSum(oneTwoThree), 6);
assert_1.strict.equal(churchSum(fourFiveSix), 15);
// begin-snippet: concat-functions
function concat(left, right) {
    if (left.tag === "nil") {
        return right;
    }
    return cons(left.head, concat(left.tail, right));
}
function churchConcat(left, right) {
    return function concattedList({ cons, nil }) {
        return left({ cons, nil: () => right({ cons, nil }) });
    };
}
// end-snippet
assert_1.strict.equal(adtSum(concat(oneTwoThree, oneTwoThree)), 12);
assert_1.strict.equal(adtSum(concat(nil, nil)), 0);
assert_1.strict.equal(adtSum(concat(nil, oneTwoThree)), 6);
assert_1.strict.equal(adtSum(concat(oneTwoThree, nil)), 6);
assert_1.strict.equal(churchSum(churchConcat(fourFiveSix, fourFiveSix)), 30);
assert_1.strict.equal(churchSum(churchConcat(churchNil, churchNil)), 0);
assert_1.strict.equal(churchSum(churchConcat(churchNil, fourFiveSix)), 15);
assert_1.strict.equal(churchSum(churchConcat(fourFiveSix, churchNil)), 15);
// begin-snippet: reduce-array
function arraySum(arr) {
    return arr.reduce((x, y) => x + y, 0);
}
// end-snippet
assert_1.strict.equal(arraySum([]), 0);
assert_1.strict.equal(arraySum([1, 2, 3]), 6);
// begin-snippet: church-encode-decode
function churchEncode(list) {
    return function encodedList({ cons, nil }) {
        function recursive(list) {
            if (list.tag === "nil") {
                return nil();
            }
            return cons(list.head, recursive(list.tail));
        }
        return recursive(list);
    };
}
function churchDecode(list) {
    return list({
        cons: (head, tail) => ({ tag: "cons", head, tail }),
        nil: () => ({ tag: "nil" })
    });
}
// end-snippet
assert_1.strict.deepEqual(churchDecode(churchEncode(oneTwoThree)), oneTwoThree);
assert_1.strict.equal(churchSum(churchEncode(churchDecode(fourFiveSix))), 15);
const scottNil = ({ nil }) => nil();
function scottCons(head, tail) {
    return function ({ cons }) {
        return cons(head, tail);
    };
}
const sevenEightNine = scottCons(7, scottCons(8, scottCons(9, scottNil)));
// end-snippet
// begin-snippet: scott-sum
function scottSum(list) {
    return list({
        cons: (head, tail) => head + scottSum(tail),
        nil: () => 0
    });
}
// end-snippet
assert_1.strict.equal(scottSum(sevenEightNine), 24);
assert_1.strict.equal(scottSum(scottNil), 0);
// begin-snippet: scott-sum-iterative
function scottSumIterative(list) {
    let sum = 0;
    let done = false;
    let l = list;
    while (!done) {
        l({
            cons: (head, tail) => {
                sum += head;
                l = tail;
                return undefined;
            },
            nil: () => {
                done = true;
            }
        });
    }
    return sum;
}
// end-snippet
assert_1.strict.equal(scottSumIterative(sevenEightNine), 24);
assert_1.strict.equal(scottSumIterative(scottNil), 0);
// begin-snippet: scott-foldl
function foldlScottList(list, accumulator, consFn) {
    let acc = accumulator;
    let done = false;
    let l = list;
    while (!done) {
        l({
            cons: (head, tail) => {
                acc = consFn(acc, head);
                l = tail;
                return undefined;
            },
            nil: () => {
                done = true;
            }
        });
    }
    return acc;
}
const summed = foldlScottList(sevenEightNine, 0, (x, y) => x + y);
// end-snippet
assert_1.strict.equal(summed, 24);
assert_1.strict.equal(foldlScottList(scottNil, 0, (x, y) => x + y), 0);
// begin-snippet: scott-foldr
function foldrScottList(list, consFn, accumulator) {
    const copiedArray = [];
    let done = false;
    let l = list;
    while (!done) {
        l({
            cons: (head, tail) => {
                copiedArray.push(head);
                l = tail;
                return undefined;
            },
            nil: () => {
                done = true;
            }
        });
    }
    let acc = accumulator;
    for (let i = copiedArray.length - 1; i >= 0; i--) {
        acc = consFn(copiedArray[i], acc);
    }
    return acc;
}
const summedAgain = foldrScottList(sevenEightNine, (x, y) => x + y, 0);
// end-snippet
assert_1.strict.equal(summedAgain, 24);
assert_1.strict.equal(foldrScottList(scottNil, (x, y) => x + y, 0), 0);
// begin-snippet: scott-concat
function scottConcat(left, right) {
    return function concatted({ cons, nil }) {
        return left({
            cons: (head, tail) => cons(head, scottConcat(tail, right)),
            nil: () => right({ cons, nil })
        });
    };
}
// end-snippet
assert_1.strict.equal(scottSum(scottConcat(sevenEightNine, sevenEightNine)), 48);
assert_1.strict.equal(scottSum(scottConcat(scottNil, scottNil)), 0);
assert_1.strict.equal(scottSum(scottConcat(scottNil, sevenEightNine)), 24);
assert_1.strict.equal(scottSum(scottConcat(sevenEightNine, scottNil)), 24);
// begin-snippet: scott-count
function count(start, increment) {
    return function counting({ cons, nil }) {
        return cons(start, count(start + increment, increment));
    };
}
const counter = count(0, 1);
const zero = counter({
    cons: (num, tail) => num,
    nil: () => -999 // some number to satisfy typechecker
});
const one = counter({
    cons: (num, tail) => tail({
        cons: (num, tail) => num,
        nil: () => -999
    }),
    nil: () => -999
});
// end-snippet
assert_1.strict.equal(zero, 0);
assert_1.strict.equal(one, 1);
// begin-snippet: scott-encode-decode
function scottEncode(list) {
    return function encodedList({ cons, nil }) {
        if (list.tag === "nil") {
            return nil();
        }
        return cons(list.head, scottEncode(list.tail));
    };
}
function scottDecode(list) {
    return list({
        cons: (head, tail) => cons(head, scottDecode(tail)),
        nil: () => nil
    });
}
// end-snippet
assert_1.strict.deepEqual(scottDecode(scottEncode(oneTwoThree)), oneTwoThree);
assert_1.strict.equal(scottSum(scottEncode(scottDecode(sevenEightNine))), 24);
// Check stack safety of some operations
function take(list, count) {
    return function taking({ cons, nil }) {
        return list({
            cons: (head, tail) => {
                if (count <= 0) {
                    return nil();
                }
                return cons(head, take(tail, count - 1));
            },
            nil
        });
    };
}
const infiniteOnes = count(1, 0);
const fiftyThousandOnes = take(infiniteOnes, 50000);
// If I change `scottSumIterative` to `scottSum` here, the stack overflows
assert_1.strict.equal(scottSumIterative(fiftyThousandOnes), 50000);
// Show that concatenating ScottLists won't cause the stack to overflow
assert_1.strict.equal(scottSumIterative(scottConcat(fiftyThousandOnes, fiftyThousandOnes)), 100000);
