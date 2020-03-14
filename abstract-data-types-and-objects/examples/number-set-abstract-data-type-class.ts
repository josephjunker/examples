// begin-snippet: implementation
export default class NumberSet {
  private contents: Array<number>;

  constructor() {
    this.contents = [];
  }

  private fromArray(numbers: Array<number>): NumberSet {
    const result = new NumberSet();
    result.contents = numbers;
    return result;
  }

  add(n: number): NumberSet {
    let i = 0;

    while (n < this.contents[i] && i < this.contents.length) {
      i++;
    }

    if (this.contents[i] === n) return this;

    return this.fromArray(
      this.contents
        .slice(0, i)
        .concat(n)
        .concat(this.contents.slice(i))
    );
  }

  isEmpty(): boolean {
    return this.contents.length === 0;
  }

  has(n: number): boolean {
    for (const num of this.contents) {
      if (num === n) return true;
    }

    return false;
  }

  union(other: NumberSet): NumberSet {
    let newSet = [];

    let i = 0,
      j = 0;

    while (true) {
      if (i === other.contents.length) {
        newSet = newSet.concat(this.contents.slice(j));
        break;
      }

      if (i === this.contents.length) {
        newSet = newSet.concat(other.contents.slice(i));
        break;
      }

      if (other.contents[i] === this.contents[j]) {
        newSet.push(other.contents[i]);
        i++;
        j++;
      } else if (other.contents[i] < this.contents[j]) {
        newSet.push(other.contents[i]);
        i++;
      } else {
        newSet.push(this.contents[j]);
        j++;
      }
    }

    return this.fromArray(newSet);
  }
}
// end-snippet
