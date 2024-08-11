import { strict as assert } from "assert";

// begin-snippet: non-extensible-constant
interface Expr {
    evaluate: () => number;
}

class Constant implements Expr {
    private readonly value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public evaluate(): number {
        return this.value;
    }
}
// end-snippet

// begin-snippet: non-extensible-addition
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
}
// end-snippet

// begin-snippet: non-extensible-usage
const four = new Addition(
    new Addition(new Constant(1), new Constant(1)),
    new Constant(2));

console.log(four.evaluate()); // prints "4"
// end-snippet

assert.equal(four.evaluate(), 4);
