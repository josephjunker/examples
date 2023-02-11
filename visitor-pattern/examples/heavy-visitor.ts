import { strict as assert } from "assert";

// begin-snippet heavy-visitor-interface-1
interface TreeVisitor<TContents, TResult> {
    visitNode(left: TResult, right: TResult): TResult;
    visitLeaf(value: TContents): TResult;
}
// end-snippet

// begin-snippet visitorified-tree-1
interface Tree<T> {
    accept<S>(visitor: TreeVisitor<T, S>): S;
}
// end-snippet

// begin-snippet node-leaf-classes-1
class Node<T> implements Tree<T> {
    #left: Tree<T>;
    #right: Tree<T>;
    public constructor(left: Tree<T>, right: Tree<T>) {
    	this.#left = left;
	    this.#right = right;
    }

    public accept<S>(visitor: TreeVisitor<T, S>): S {
        return visitor.visitNode(
            this.#left.accept(visitor),
            this.#right.accept(visitor));
    }
}

class Leaf<T> implements Tree<T> {
    #value: T;
    public constructor(value: T) {
        this.#value = value;
    }

    public accept<S>(visitor: TreeVisitor<T, S>): S {
        return visitor.visitLeaf(this.#value);
    }
}
// end-snippet

// begin-snippet sum-tree-1
class SumTree implements TreeVisitor<number, number> {
    visitNode(left: number, right: number): number {
        return left + right;
    }
    visitLeaf(value: number): number {
        return value;
    }
}
// end-snippet

// begin-snippet detect-empty
class DetectEmpty implements TreeVisitor<string, boolean> {
    visitNode(left: boolean, right: boolean): boolean {
        return left || right;
    }
    visitLeaf(value: string): boolean {
        return value.length === 0;
    }
}
// end-snippet

// begin-snippet construct-trees
const numTree = new Node(
    new Leaf(1),
    new Node(
        new Leaf(2),
        new Leaf(3)));

const six = numTree.accept(new SumTree());

const strTree = new Node(
   new Leaf(""),
   new Leaf("asdf"));

const tru = strTree.accept(new DetectEmpty());
// end-snippet

assert.equal(six, 6);
assert.equal(tru, true);

export {}