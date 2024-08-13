import { strict as assert } from "assert";

// begin-snippet: separate-algebras
// One algebra for constants

type ConstantAlgebra2<E> = {
    constant: (value: number) => E;
}

const evaluateConstant2 = (value: number) => value;

const evaluatableConstantFactory = {
    constant: evaluateConstant2
}

// Separate algebra for addition

type AdditionAlgebra2<E> = {
    addition: (left: E, right: E) => E;
}

const evaluateAddition2 = (left: number, right: number) => left + right;

const evaluatableAdditionFactory = {
    addition: evaluateAddition2
}
// end-snippet


// begin-snippet: do-composition
type ExpressionAlgebra2<E> = ConstantAlgebra2<E> & AdditionAlgebra2<E>;

const evaluatableExpressionFactory = Object.assign({},
    evaluatableConstantFactory,
    evaluatableAdditionFactory);
// end-snippet

function makeFour<E>(factory: ExpressionAlgebra2<E>): E {
    return factory.addition(
        factory.addition(factory.constant(1), factory.constant(1)),
        factory.constant(2));
}

const four = makeFour(evaluatableExpressionFactory);
assert.equal(four, 4);

