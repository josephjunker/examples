
function stringifyConstant(value: number): string {
    return String(value);
}

function stringifyAddition(left: string, right: string): string {
    return `${left} + ${right}`;
}

// begin-snippet: factory
const stringifiableExpressionFactory = {
    constant: (value: number) => stringifyConstant(value),
    addition: (left: string, right: string) => stringifyAddition(left, right)
}
// end-snippet
