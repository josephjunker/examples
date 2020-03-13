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
  add(n: number) {
    return new Insert(n, this);
  }
  isEmpty() {
    return true;
  }
  has(n: number) {
    return false;
  }
  union(set: NumberSetI) {
    return set;
  }
}
// end-snippet

// begin-snippet: insert
class Insert implements NumberSetI {
  n: number;
  set: NumberSetI;
  constructor(n: number, set: NumberSetI) {
    this.n = n;
    this.set = set;
  }
  add(n: number) {
    return new Insert(n, this);
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return n === this.n || this.set.has(n);
  }
  union(set: NumberSetI) {
    return new Union(this, set);
  }
}
// end-snippet

// begin-snippet: union
class Union implements NumberSetI {
  set1: NumberSetI;
  set2: NumberSetI;
  constructor(set1: NumberSetI, set2: NumberSetI) {
    this.set1 = set1;
    this.set2 = set2;
  }
  add(n: number) {
    return new Insert(n, this);
  }
  isEmpty() {
    return this.set1.isEmpty() && this.set2.isEmpty();
  }
  has(n: number) {
    return this.set1.has(n) || this.set2.has(n);
  }
  union(set: NumberSetI) {
    return new Union(this, set);
  }
}
// end-snippet

// begin-snippet: infinite
export class Everything implements NumberSetI {
  add(n: number) {
    return this;
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return true;
  }
  union(set: NumberSetI) {
    return this;
  }
}

export class Even implements NumberSetI {
  add(n: number) {
    return new Insert(n, this);
  }
  isEmpty() {
    return false;
  }
  has(n: number) {
    return n % 2 === 0;
  }
  union(set: NumberSetI) {
    return new Union(this, set);
  }
}
// end-snippet
