// begin-snippet: concrete-implementation
type NumberSet = Array<number>;

export function empty(): NumberSet {
  return [];
}

export function add(n: number, set: NumberSet): NumberSet {
  let i = 0;

  while (n < set[i] && i < set.length) {
    i++;
  }

  if (set[i] === n) return set;

  return set
    .slice(0, i)
    .concat(n)
    .concat(set.slice(i));
}

export function isEmpty(set: NumberSet): boolean {
  return set.length === 0;
}

export function has(n: number, set: NumberSet): boolean {
  for (const num of set) {
    if (num === n) return true;
  }

  return false;
}

export function union(
  set1: NumberSet,
  set2: NumberSet
): NumberSet {
  let newSet = [];

  let i = 0,
    j = 0;

  while (true) {
    if (i === set1.length) {
      newSet = newSet.concat(set2.slice(j));
      break;
    }

    if (i === set2.length) {
      newSet = newSet.concat(set1.slice(i));
      break;
    }

    if (set1[i] === set2[j]) {
      newSet.push(set1[i]);
      i++;
      j++;
    } else if (set1[i] < set2[j]) {
      newSet.push(set1[i]);
      i++;
    } else {
      newSet.push(set2[j]);
      j++;
    }
  }

  return newSet;
}
// end-snippet

// begin-snippet: size
export function size(set: NumberSet): number {
  return set.length;
}
// end-snippet

// begin-snippet: smallest-integer-above
function smallestIntegerAbove(
  n: number,
  set: NumberSet
): number | null {
  for (const num of set) {
    if (num > n) return num;
  }

  return null;
}
// end-snippet
