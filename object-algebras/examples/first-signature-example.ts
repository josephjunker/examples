
// begin-snippet: signature-example
interface ExprAlgebra<E> {
    constant: (value: number) => E;
    addition: (left: E, right: E) => E;
}
// end-snippet
