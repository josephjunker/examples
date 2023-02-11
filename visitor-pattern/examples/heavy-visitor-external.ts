import { strict as assert } from "assert";

// begin-snippet external-visitor
interface ExternalVisitor<TContents, TResult> {
    visitNode(left: Tree<TContents>, right: Tree<TContents>): TResult;
    visitLeaf(value: TContents): TResult;
}

interface Tree<T> {
    acceptExternal<S>(visitor: ExternalVisitor<T, S>): S;
}

class Node<T> implements Tree<T> {
    #left: Tree<T>;
    #right: Tree<T>;
    public constructor(left: Tree<T>, right: Tree<T>) {
    	this.#left = left;
	    this.#right = right;
    }

    public acceptExternal<S>(visitor: ExternalVisitor<T, S>): S {
        return visitor.visitNode(this.#left, this.#right);
    }
}

class Leaf<T> implements Tree<T> {
    #value: T;
    public constructor(value: T) {
        this.#value = value;
    }

    public acceptExternal<S>(visitor: ExternalVisitor<T, S>): S {
        return visitor.visitLeaf(this.#value);
    }
}

class DetectEmptyOptimized implements ExternalVisitor<string, boolean> {
    visitNode(left: Tree<string>, right: Tree<string>): boolean {
        return left.acceptExternal(this) || right.acceptExternal(this);
    }
    visitLeaf(value: string): boolean {
        return value === ""
    }
}

const strTree = new Node(
   new Leaf(""),
   new Leaf("asdf"));

const hasEmpty = strTree.acceptExternal(new DetectEmptyOptimized());
// end-snippet

const strTree2 = new Node(
   new Leaf("foo"),
   new Leaf("asdf"));

assert.equal(strTree.acceptExternal(new DetectEmptyOptimized()), true);
assert.equal(strTree2.acceptExternal(new DetectEmptyOptimized()), false);

// Show that we never try to evaluate the second leaf if the first one is empty
// If we did try to evaluate it, this would throw due to a missing acceptExternal method

const strTree3 = new Node(
    new Leaf(""),
    undefined as any);

strTree3.acceptExternal(new DetectEmptyOptimized());

export {}