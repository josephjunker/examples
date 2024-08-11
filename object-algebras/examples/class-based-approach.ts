import { strict as assert } from "assert";

// begin-snippet: evaluatable-interface
interface Evaluatable {
    evaluate: () => number
}
// end-snippet

// begin-snippet: constant-algebra
interface ConstantAlgebra<E> {
    constant: (value: number) => E;
}
// end-snippet

// begin-snippet: evaluatable-constant
class EvaluatableConstant implements Evaluatable {
    private readonly value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public evaluate(): number {
        return this.value
    }
}
// end-snippet

// begin-snippet: evaluatable-constant-factory
class EvaluatableConstantFactory implements ConstantAlgebra<Evaluatable> {
    public constant(value: number): EvaluatableConstant {
        return new EvaluatableConstant(value);
    }
}
// end-snippet

// begin-snippet: evaluatable-constant-usage
function makeThree<E>(factory: ConstantAlgebra<E>): E {
    return factory.constant(3);
}

const three = makeThree(new EvaluatableConstantFactory());
console.log(three.evaluate()); // prints 3
// end-snippet

assert.equal(three.evaluate(), 3);

// begin-snippet: expression-algebra
interface ExpressionAlgebra<E> extends ConstantAlgebra<E> {
    addition: (left: E, right: E) => E
}
// end-snippet

// begin-snippet: evaluatable-expression
class EvaluatableAddition implements Evaluatable {
    private readonly left: Evaluatable;
    private readonly right: Evaluatable;

    public constructor(left: Evaluatable, right: Evaluatable) {
        this.left = left;
	this.right = right;
    }

    public evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
    }
}

class EvaluatableExpressionFactory
    extends EvaluatableConstantFactory
    implements ExpressionAlgebra<Evaluatable> {

    public addition(left: Evaluatable, right: Evaluatable): Evaluatable {
        return new EvaluatableAddition(left, right);
    }
}
// end-snippet


// begin-snippet: make-twelve
function makeTwelve<E>(factory: ExpressionAlgebra<E>): E {
    const three = makeThree(factory);
    const twelve = factory.addition(
    	three,
        factory.addition(
            factory.constant(4),
            factory.constant(5)));
    return twelve;
}

const twelve = makeTwelve(new EvaluatableExpressionFactory());
console.log(twelve.evaluate()); // prints 12
// end-snippet

assert.equal(twelve.evaluate(), 12);

// begin-snippet: stringifiable-interface
interface Stringifiable {
    stringify: () => string
}
// end-snippet

// begin-snippet: stringifiable-classes
class StringifiableConstant implements Stringifiable {
    private readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    public stringify(): string {
        return String(this.value);
    }
}

class StringifiableAddition implements Stringifiable {
    private readonly left: Stringifiable;
    private readonly right: Stringifiable;

    constructor(left: Stringifiable, right: Stringifiable) {
        this.left = left;
	this.right = right;
    }

    public stringify(): string {
        return `${this.left.stringify()} + ${this.right.stringify()}`;
    }
}
// end-snippet

// begin-snippet: stringifiable-factory
class StringifiableExpressionFactory implements ExpressionAlgebra<Stringifiable> {
    public constant(value: number): Stringifiable {
        return new StringifiableConstant(value);
    }

    public addition(left: Stringifiable, right: Stringifiable): Stringifiable {
        return new StringifiableAddition(left, right);
    }
}
// end-snippet

// begin-snippet: make-four
function makeFour<E>(factory: ExpressionAlgebra<E>): E {
    return factory.addition(factory.constant(2), factory.constant(2));
}

const four = makeFour(new StringifiableExpressionFactory());
console.log(four.stringify()); // prints "2 + 2"
// end-snippet

assert.equal(four.stringify(), "2 + 2");

// begin-snippet: stringify-twelve
const stringifiableTwelve = makeTwelve(new StringifiableExpressionFactory());
console.log(stringifiableTwelve.stringify()); // prints "3 + 4 + 5"
// end-snippet

assert.equal(stringifiableTwelve.stringify(), "3 + 4 + 5");
