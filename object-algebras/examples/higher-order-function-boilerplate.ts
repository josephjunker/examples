import { strict as assert } from "assert";

// begin-snippet: example
type Evaluatable = () => number;
type Stringifiable = () => string;

function evaluatableConstant(value: number): (() => number) {
    return () => value;
}

function evaluatableAddition(left: Evaluatable, right: Evaluatable): (() => number) {
    return () => left() + right();
}

function stringifiableConstant(value: number): (() => string) {
    return () => String(value);
}

function stringifiableAddition(
    left: Stringifiable,
    right: Stringifiable): (() => string) {

    return () => `${left()} + ${right()}`;
}
// end-snippet

assert.equal(evaluatableAddition(
    evaluatableConstant(1),
    evaluatableConstant(2))(), 3);

assert.equal(stringifiableAddition(
    stringifiableConstant(1),
    stringifiableConstant(2))(), "1 + 2");

