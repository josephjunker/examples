// begin-snippet: nested-type
type Nested<T> = {
    head: T;
    tail: Nested<Array<T>>;
} | null;
// end-snippet

// begin-snippet: length
function length<T>(nested: Nested<T>): number {
    if (!nested) return 0;
    return 1 + length(nested.tail);
}
// end-snippet