
interface Evaluatable {
    evaluate: () => number
}

interface ConstantAlgebra<E> {
    constant: (value: number) => E;
}

class EvaluatableConstant implements Evaluatable {
    private readonly value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public evaluate(): number {
        return this.value
    }
}
class EvaluatableConstantFactory implements ConstantAlgebra<Evaluatable> {
    public constant(value: number): EvaluatableConstant {
        return new EvaluatableConstant(value);
    }
}

// begin-snippet: example
interface ExpressionAlgebra<E> extends ConstantAlgebra<E> { /* ... */ }

class EvaluatableExpressionFactory extends EvaluatableConstantFactory {
    /* ... */
}
// end-snippet
