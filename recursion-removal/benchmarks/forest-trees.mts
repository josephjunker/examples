export type Tree<T> =
    | {
          tag: "Empty";
      }
    | {
          tag: "Node";
          value: T;
          forest: Forest<T>;
      };

export type Forest<T> =
    | {
          tag: "Nil";
      }
    | {
          tag: "Cons";
          head: Tree<T>;
          tail: Forest<T>;
      };

export function empty<T>(): Tree<T> {
    return {
        tag: "Empty",
    };
}

export function node<T>(value: T, forest: Forest<T>): Tree<T> {
    return {
        tag: "Node",
        value,
        forest,
    };
}

export function nil<T>(): Forest<T> {
    return {
        tag: "Nil",
    };
}

export function cons<T>(head: Tree<T>, tail: Forest<T>): Forest<T> {
    return {
        tag: "Cons",
        head,
        tail,
    };
}
