
// begin-snippet: add
function add(n: number, m: number): number {
  return n + m;
}
// end-snippet

// begin-snippet: add-cps
function addCPS<T>(n: number, m: number, k: (sum: number) => T): T {
  return k(n + m);
}
// end-snippet

// begin-snippet: log-add-cps
console.log(addCPS(1, 2, sum => sum * sum)); // 9
console.log(addCPS(1, 2, sum => `The sum is: ${sum}`)); // The sum is: 3
console.log(addCPS(1, 2, (sum) => addCPS(sum, 3, x => x))); // 6
// end-snippet