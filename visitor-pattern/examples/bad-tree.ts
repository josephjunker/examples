import { strict as assert } from "assert";

// begin-snippet: bad-tree
interface Tree<T> {};

class Node<T> implements Tree<T> {
    #left: Tree<T> | undefined;
    #right: Tree<T> | undefined;
    public constructor(left: Tree<T> | undefined, right: Tree<T> | undefined) {
    	this.#left = left;
	this.#right = right;
    }
}

class Leaf<T> implements Tree<T> {
    #value: T;
    public constructor(value: T) {
        this.#value = value;
    }
}
// end-snippet

export {}