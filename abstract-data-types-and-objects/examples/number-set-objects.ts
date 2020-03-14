// begin-snippet: interface
export interface NumberSetI {
  add(n: number): NumberSetI;
  isEmpty(): boolean;
  has(n: number): boolean;
  union(n: NumberSetI): NumberSetI;
}
// end-snippet

// begin-snippet: empty
export class Empty implements NumberSetI {
  add(n: number): NumberSetI {
    return new Insert(n, this);
  }
  isEmpty() {
    return true;
  }
  has(n: number) {
    return false;
  }
  union(set: NumberSetI): NumberSetI {
    return set;
  }
}
// end-snippet

// begin-snippet: insert
export class Insert implements NumberSetI {
  n: number;
  set: NumberSetI;
  constructor(n: number, set: NumberSetI) {
    this.n = n;
    this.set = set;
  }
  add(n: number): NumberSetI {
    return new Insert(n, this);
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return n === this.n || this.set.has(n);
  }
  union(set: NumberSetI): NumberSetI {
    return new Union(this, set);
  }
}
// end-snippet

// begin-snippet: union
export class Union implements NumberSetI {
  left: NumberSetI;
  right: NumberSetI;
  constructor(left: NumberSetI, right: NumberSetI) {
    this.left = left;
    this.right = right;
  }
  add(n: number): NumberSetI {
    return new Insert(n, this);
  }
  isEmpty() {
    return this.left.isEmpty() && this.right.isEmpty();
  }
  has(n: number) {
    return this.left.has(n) || this.right.has(n);
  }
  union(set: NumberSetI): NumberSetI {
    return new Union(this, set);
  }
}
// end-snippet

// begin-snippet: infinite
export class Everything implements NumberSetI {
  add(n: number): NumberSetI {
    return this;
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return true;
  }
  union(set: NumberSetI): NumberSetI {
    return this;
  }
}

export class Even implements NumberSetI {
  add(n: number): NumberSetI {
    return new Insert(n, this);
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return n % 2 === 0;
  }
  union(set: NumberSetI): NumberSetI {
    return new Union(this, set);
  }
}
// end-snippet
