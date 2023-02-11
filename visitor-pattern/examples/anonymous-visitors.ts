import { strict as assert } from "assert";

interface Tree<T> {
    accept: <U>(visitor: TreeVisitor<T, U>) => U
    acceptExternal: <U>(visitor: ExternalTreeVisitor<T, U>) => U,
}

interface TreeVisitor<TContents, TResult> {
    visitNode(left: TResult, right: TResult): TResult;
    visitLeaf(value: TContents): TResult;
}

interface ExternalTreeVisitor<TContents, TResult> {
    visitNode(left: Tree<TContents>, right: Tree<TContents>): TResult;
    visitLeaf(value: TContents): TResult;
}

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

    public acceptExternal<S>(visitor: ExternalTreeVisitor<T, S>): S {
        return visitor.visitNode(
	    this.#left,
	    this.#right);
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

    public acceptExternal<S>(visitor: ExternalTreeVisitor<T, S>): S {
        return visitor.visitLeaf(this.#value);
    }
}

const numTree = new Node(
    new Leaf(1),
    new Node(
        new Leaf(2),
	new Leaf(3)));

const strTree = new Node(
   new Leaf(""),
   new Leaf("asdf"));


// begin-snippet: inline-objects
const sum = numTree.accept<number>({
    visitNode: (x, y) => x + y,
    visitLeaf: x => x
});

const containsEmpty = strTree.acceptExternal<boolean>({
    visitNode: function(left, right){ return left.acceptExternal(this) || right.acceptExternal(this) },
    visitLeaf: x => x === ""
});

// Alternatively, for those who prefer to avoid using `this`:
const detectEmpty: ExternalTreeVisitor<string, boolean> = {
  visitNode: (left, right) => left.acceptExternal(detectEmpty) || right.acceptExternal(detectEmpty),
  visitLeaf: x => x === ""
};

const containsEmpty2 = strTree.acceptExternal(detectEmpty)
// end-snippet

assert.equal(sum, 6);
assert.equal(containsEmpty, true);
assert.equal(containsEmpty2, true);

const strTree2 = new Node(
   new Leaf("foo"),
   new Leaf("asdf"));

const containsEmpty3 = strTree2.acceptExternal<boolean>({
    visitNode: function(left, right){ return left.acceptExternal(this) || right.acceptExternal(this); },
    visitLeaf: x => x === ""
});

const containsEmpty4 = strTree2.acceptExternal(detectEmpty);

assert.equal(containsEmpty3, false);
assert.equal(containsEmpty4, false);

export {}