import { strict as assert } from "assert";

// begin-snippet: non-extensible-full


interface Expr {
    evaluate: () => number;
    print: () => string;
}

class Constant implements Expr {
    private readonly value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public evaluate(): number {
        return this.value;
    }

    public print(): string {
        return `${this.value}`;
    }
}

class Addition implements Expr {
    private readonly left: Expr;
    private readonly right: Expr;

    public constructor (left: Expr, right: Expr) {
        this.left = left;
        this.right = right;
    }

    public evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
    }

    public print(): string {
        return `${this.left.print()} + ${this.right.print()}`;
    }
}
// end-snippet

// test cases

const four = new Addition(
    new Addition(new Constant(1), new Constant(1)),
    new Constant(2));

assert.equal(four.evaluate(), 4);
assert.equal(four.print(), "1 + 1 + 2");
