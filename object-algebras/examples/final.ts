import { strict as assert } from "assert";

function compose<F1 extends Record<string,unknown>,
                 F2 extends Record<string, unknown>>(left: F1, right: F2): F1 & F2 {
                   return Object.assign({}, left, right);
                 }

// begin-snippet: example
// Algebraic signatures

type ConstantAlgebra<E> = {
    constant: (value: number) => E;
}

type AdditionAlgebra<E> = {
    addition: (left: E, right: E) => E;
}

type ExpressionAlgebra<E> = ConstantAlgebra<E> & AdditionAlgebra<E>;

// Evaluation logic

const evaluateConstant = (value: number) => value;
const evaluateAddition = (left: number, right: number) => left + right;

const evaluatableConstantFactory = {
    constant: evaluateConstant
}

const evaluatableAdditionFactory = {
    addition: evaluateAddition
}

const evaluatableExpressionFactory = compose(
    evaluatableConstantFactory,
    evaluatableAdditionFactory);

// Stringification logic

const stringifyConstant = (value: number) => String(value);
const stringifyAddition = (left: string, right: string) => `${left} + ${right}`;

const stringifiableExpressionFactory = {
    constant: stringifyConstant,
    addition: stringifyAddition
}

// Usage example

function makeFour<E>(factory: ExpressionAlgebra<E>): E {
    return factory.addition(
        factory.addition(factory.constant(1), factory.constant(1)),
	factory.constant(2));
}

console.log(makeFour(evaluatableExpressionFactory))   // prints "4"
console.log(makeFour(stringifiableExpressionFactory)) // prints "1 + 1 + 2"
//end-snippet

assert.equal(makeFour(evaluatableExpressionFactory), 4);
assert.equal(makeFour(stringifiableExpressionFactory), "1 + 1 + 2");
