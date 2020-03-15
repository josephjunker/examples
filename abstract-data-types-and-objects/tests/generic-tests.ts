import "mocha";

import { assert } from "chai";

export interface WrappedSet<A> {
  empty: () => A;
  has: (set: A, n: number) => boolean;
  add: (set: A, n: number) => A;
  union: (left: A, right: A) => A;
  isEmpty: (set: A) => boolean;
}

export default function runTests<A>(
  suiteName: string,
  { empty, has, add, union, isEmpty }: WrappedSet<A>
) {
  const of = (n: number) => add(empty(), n);

  suite(suiteName, () => {
    test("empty is empty", () => {
      assert.isTrue(isEmpty(empty()));
    });

    test("add is not empty", () => {
      assert.isFalse(isEmpty(of(1)));
    });

    test("add has an element", () => {
      assert.isTrue(has(add(empty(), 1), 1));
      assert.isTrue(has(add(of(1), 2), 1));
      assert.isTrue(has(add(of(2), 2), 2));
    });

    test("add only has added elements", () => {
      assert.isFalse(has(of(1), 2));
    });

    test("union with isEmpty", () => {
      assert.isTrue(isEmpty(union(empty(), empty())));
      assert.isFalse(isEmpty(union(of(1), empty())));
      assert.isFalse(isEmpty(union(empty(), of(1))));
      assert.isFalse(isEmpty(union(of(1), of(1))));
    });

    test("union with has", () => {
      assert.isFalse(has(union(empty(), empty()), 1));
      assert.isFalse(has(union(of(2), of(3)), 1));

      assert.isTrue(has(union(of(1), empty()), 1));
      assert.isTrue(has(union(empty(), of(1)), 1));
      assert.isTrue(has(union(of(1), of(1)), 1));
    });

    test("union of unions", () => {
      const has1 = (set: A) => assert.isTrue(has(set, 1));

      has1(union(of(1), union(empty(), empty())));
      has1(union(empty(), union(of(1), empty())));
      has1(union(empty(), union(empty(), of(1))));

      has1(union(of(1), union(empty(), empty())));
      has1(union(empty(), union(of(1), empty())));
      has1(union(empty(), union(empty(), of(1))));

      assert.isTrue(isEmpty(union(empty(), union(empty(), empty()))));
    });

    test("adding to a union", () => {
      const emptyUnion = union(empty(), empty());
      const unionWithOne = union(of(1), empty());

      assert.isFalse(isEmpty(add(emptyUnion, 1)));
      assert.isTrue(has(add(emptyUnion, 1), 1));
      assert.isTrue(has(add(unionWithOne, 1), 1));
      assert.isFalse(has(add(unionWithOne, 2), 3));
    });
  });
}
