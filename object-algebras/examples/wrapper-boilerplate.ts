import { strict as assert } from "assert";

// begin-snippet: example
function evaluateConstant(value: number): number {
    return value;
}

function evaluateAddition(left: number, right: number): number {
    return left + right;
}

function stringifyConstant(value: number): string {
    return String(value);
}

function stringifyAddition(left: string, right: string): string {
    return `${left} + ${right}`;
}
// end-snippet

assert.equal(evaluateAddition(
    evaluateConstant(1),
    evaluateConstant(2)), 3);

assert.equal(stringifyAddition(
    stringifyConstant(1),
    stringifyConstant(2)), "1 + 2");
