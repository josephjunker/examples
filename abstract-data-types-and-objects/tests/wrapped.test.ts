import runTests from "./generic-tests";

import * as adtNs from "../examples/number-set-abstract-data-type";
import ClassNS from "../examples/number-set-abstract-data-type-class";
import * as objectNS from "../examples/number-set-objects";

runTests("abstract data type, concrete implementation", {
  empty: adtNs.empty,
  has: (set, n) => adtNs.has(n, set),
  add: (set, n) => adtNs.add(n, set),
  union: adtNs.union,
  isEmpty: adtNs.isEmpty
});

runTests("abstract data type, class implementation", {
  empty: () => new ClassNS(),
  has: (set, n) => set.has(n),
  add: (set, n) => set.add(n),
  union: (left, right) => left.union(right),
  isEmpty: set => set.isEmpty()
});

runTests("objects", {
  empty: () => new objectNS.Empty(),
  has: (set, n) => set.has(n),
  add: (set, n) => set.add(n),
  union: (left, right) => left.union(right),
  isEmpty: set => set.isEmpty()
});
