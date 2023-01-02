import { strict as assert } from "assert";

// begin-snippet: adt-list-definition
type List<A> = Cons<A> | Nil;

type Nil = {
    tag: "nil"
};

type Cons<A> = {
    tag: "cons",
    head: A,
    tail: List<A>
};

const nil: Nil = { tag: "nil" };

function cons<A>(head: A, tail: List<A>): List<A> {
    return { tag: "cons", head, tail };
}
// end-snippet

// begin-snippet: one-two-three
const oneTwoThree: List<number> = cons(1, cons(2, cons(3, nil)));
// end-snippet

// begin-snippet: consume-adt-list
if (oneTwoThree.tag === "cons") {
    console.log(`First item: ${oneTwoThree.head}`)
}

function listLength<A>(list: List<A>): number {
    let i = 0;
    let l = list;
    
    while(l.tag !== "nil") {
      i++;
      l = l.tail;
    }

    return i;
}
// end-snippet

assert.equal(listLength(oneTwoThree), 3);

// begin-snippet: church-list-type
type ChurchList<A> = <B>(choices: {
    cons: (head: A, tail: B) => B,
    nil: () => B
}) => B;
// end-snippet

// begin-snippet: church-list-implementation
// Convenience type, to reduce duplication below
type ChurchListArgs<A, B> = {
    cons: (a: A, b: B) => B,
    nil: () => B
};

const churchNil: ChurchList<never> =
    <B>({ nil }: ChurchListArgs<never, B>): B => nil();

function churchCons<A>(head: A, tail: ChurchList<A>): ChurchList<A> {
    return function encodedCons<B>({ cons, nil }: ChurchListArgs<A, B>): B {
        return cons(head, tail({ nil, cons }));
    }
}

const fourFiveSix = churchCons(4, churchCons(5, churchCons(6, churchNil)));
// end-snippet

// begin-snippet: sum-functions
function adtSum(list: List<number>): number {
    if (list.tag === "nil") {
        return 0;
    }
    return list.head + adtSum(list.tail);
}

function churchSum(list: ChurchList<number>): number {
    return list({
        cons: (x, y) => x + y,
        nil: () => 0
    })
}
// end-snippet

assert.equal(adtSum(oneTwoThree), 6);
assert.equal(churchSum(fourFiveSix), 15);

// begin-snippet: concat-functions
function concat<A>(left: List<A>, right: List<A>): List<A> {
    if (left.tag === "nil") {
        return right;
    }
    return cons(left.head, concat(left.tail, right));
}

function churchConcat<A>(left: ChurchList<A>, right: ChurchList<A>): ChurchList<A> {
    return function concattedList<B>({ cons, nil }: ChurchListArgs<A, B>): B {
        return left({ cons, nil: () => right({ cons, nil })});
    }
}
// end-snippet

assert.equal(adtSum(concat(oneTwoThree, oneTwoThree)), 12);
assert.equal(adtSum(concat(nil, nil)), 0);
assert.equal(adtSum(concat(nil, oneTwoThree)), 6);
assert.equal(adtSum(concat(oneTwoThree, nil)), 6);

assert.equal(churchSum(churchConcat(fourFiveSix, fourFiveSix)), 30);
assert.equal(churchSum(churchConcat(churchNil, churchNil)), 0);
assert.equal(churchSum(churchConcat(churchNil, fourFiveSix)), 15);
assert.equal(churchSum(churchConcat(fourFiveSix, churchNil)), 15);

// begin-snippet: reduce-array
function arraySum(arr: number[]): number {
    return arr.reduce(
    	(x, y) => x + y,
	0);
}
// end-snippet

assert.equal(arraySum([]), 0);
assert.equal(arraySum([1, 2, 3]), 6);

// begin-snippet: church-encode-decode
function churchEncode<A>(list: List<A>): ChurchList<A> {
    return function encodedList<B>({ cons, nil }: ChurchListArgs<A, B>): B {

        function recursive(list: List<A>): B {
            if (list.tag === "nil") {
                return nil();
            }
            return cons(list.head, recursive(list.tail));
        }

        return recursive(list);
    }
}

function churchDecode<A>(list: ChurchList<A>): List<A> {
    return list<List<A>>({
        cons: (head, tail) => ({ tag: "cons", head, tail }),
        nil: () => ({ tag: "nil" })
    })
}
// end-snippet

assert.deepEqual(churchDecode(churchEncode(oneTwoThree)), oneTwoThree);
assert.equal(churchSum(churchEncode(churchDecode(fourFiveSix))), 15);

// begin-snippet: scott-list-type
type ScottList<A> = <B>(choices: {
    cons: (head: A, tail: ScottList<A>) => B,
    nil: () => B
}) => B;
// end-snippet

// begin-snippet: scott-list-implementation
type ScottListArgs<A, B> = {
    nil: () => B,
    cons: (head: A, tail: ScottList<A>) => B
};

const scottNil: ScottList<never> =
    <B>({ nil }: ScottListArgs<never, B>): B => nil();

function scottCons<A>(head: A, tail: ScottList<A>): ScottList<A> {
    return function<B>({ cons }: ScottListArgs<A, B>): B {
        return cons(head, tail);
    }
}

const sevenEightNine = scottCons(7, scottCons(8, scottCons(9, scottNil)));
// end-snippet

// begin-snippet: scott-sum
function scottSum(list: ScottList<number>): number {
    return list({
        cons: (head, tail) => head + scottSum(tail),
	nil: () => 0
    });
}
// end-snippet

assert.equal(scottSum(sevenEightNine), 24);
assert.equal(scottSum(scottNil), 0);

// begin-snippet: scott-sum-iterative
function scottSumIterative(list: ScottList<number>): number {
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
	})
    }

    return sum;
}
// end-snippet

assert.equal(scottSumIterative(sevenEightNine), 24);
assert.equal(scottSumIterative(scottNil), 0);

// begin-snippet: scott-foldl
function foldlScottList<A, B>(list: ScottList<A>, accumulator: B, consFn: (acc: B, a: A) => B): B {
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
	})
    }

    return acc;
}

const summed = foldlScottList(sevenEightNine, 0, (x, y) => x + y);
// end-snippet

assert.equal(summed, 24);
assert.equal(foldlScottList(scottNil, 0, (x, y) => x + y), 0);

// begin-snippet: scott-foldr
function foldrScottList<A, B>(list: ScottList<A>, consFn: (a: A, acc: B) => B, accumulator: B): B {
    const copiedArray: A[] = [];
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

assert.equal(summedAgain, 24);
assert.equal(foldrScottList(scottNil, (x, y) => x + y, 0), 0);

// begin-snippet: scott-concat
function scottConcat<A>(left: ScottList<A>, right: ScottList<A>): ScottList<A> {
    return function concatted<B>({ cons, nil }: ScottListArgs<A, B>): B {
        return left({
            cons: (head, tail) => cons(head, scottConcat(tail, right)),
            nil: () => right({ cons, nil })
        });
    };
}
// end-snippet

assert.equal(scottSum(scottConcat(sevenEightNine, sevenEightNine)), 48);
assert.equal(scottSum(scottConcat(scottNil, scottNil)), 0);
assert.equal(scottSum(scottConcat(scottNil, sevenEightNine)), 24);
assert.equal(scottSum(scottConcat(sevenEightNine, scottNil)), 24);

// begin-snippet: scott-count
function count(start: number, increment: number): ScottList<number> {
    return function counting<B>({ cons, nil }: ScottListArgs<number, B>): B {
        return cons(start, count(start + increment, increment));
    }
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

assert.equal(zero, 0);
assert.equal(one, 1);

// begin-snippet: scott-encode-decode
function scottEncode<A>(list: List<A>): ScottList<A> {
    return function encodedList<B>({ cons, nil }: ScottListArgs<A, B>): B {
        if (list.tag === "nil") {
            return nil();
	}
	return cons(list.head, scottEncode(list.tail));
    }
}

function scottDecode<A>(list: ScottList<A>): List<A> {
    return list({
        cons: (head, tail) => cons(head, scottDecode(tail)),
	nil: () => nil
    });
}
// end-snippet

assert.deepEqual(scottDecode(scottEncode(oneTwoThree)), oneTwoThree);
assert.equal(scottSum(scottEncode(scottDecode(sevenEightNine))), 24);


// Check stack safety of some operations

function take<A>(list: ScottList<A>, count: number): ScottList<A> {
    return function taking<B>({ cons, nil }: ScottListArgs<A, B>): B {
        return list({
            cons: (head, tail) => {
                if (count <= 0) {
                    return nil();
                }
                return cons(head, take(tail, count - 1));
            },
            nil
        })
    } 
}


const infiniteOnes = count(1, 0);
const fiftyThousandOnes = take(infiniteOnes, 50000);
 
// If I change `scottSumIterative` to `scottSum` here, the stack overflows
assert.equal(scottSumIterative(fiftyThousandOnes), 50000);
    
// Show that concatenating ScottLists won't cause the stack to overflow
assert.equal(scottSumIterative(scottConcat(fiftyThousandOnes, fiftyThousandOnes)), 100000);

// Show that our fold functions on ScottList are stack safe
assert.equal(foldrScottList(fiftyThousandOnes, (x, y) => x + y, 0), 50000);
assert.equal(foldlScottList(fiftyThousandOnes, 0, (x, y) => x + y), 50000);
