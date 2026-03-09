import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as fc from 'fast-check';

// begin-snippet: linked-list-definition
type LinkedList<T> = { 
    tag: "Cons",
    head: T,
    tail: LinkedList<T> } | {
        tag: "Nil"
    };

function cons<T>(head: T, tail: LinkedList<T>): LinkedList<T> {
    return { tag: "Cons", head, tail };
}

function nil<T>(): LinkedList<T> {
    return {
        tag: "Nil"
    }
}

const exampleList = cons(1, cons(2, cons(3, nil())));
// end-snippet

// begin-snippet: sum-list
function sumList(list: LinkedList<number>): number {
    if (list.tag === "Nil") return 0;
    return list.head + sumList(list.tail);
}
// end-snippet

// begin-snippet: sum-list-iterative
function sumListIterative(list: LinkedList<number>): number {
    let sum = 0;
    let pointer = list;
    while (pointer.tag !== "Nil") {
        sum += pointer.head;
        pointer = pointer.tail;
    }
    return sum;
}
// end-snippet

const listArb = fc.letrec((tie) => ({
    nil: fc.constant(nil()),
    cons: fc.record({
        tag: fc.constant("Cons"),
        head: fc.nat(),
        tail: tie("list")
    }),
    list: fc.oneof({ depthSize: "large" }, tie("nil"), tie("cons"))
})).list as fc.Arbitrary<LinkedList<number>>

test("list function equality", () => {
    fc.assert(
        fc.property(listArb, l => assert.equal(sumList(l), sumListIterative(l)))
    )
});

test.run();