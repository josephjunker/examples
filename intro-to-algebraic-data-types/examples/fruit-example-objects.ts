// begin-snippet: implementation

interface HasName {
  getName(): string;
}

interface Fruit extends HasName {}

interface Recipe extends HasName {}

interface MenuItem extends HasName {
  getPrice(): number | null;
}

class Apple implements Fruit {
  getName() {
    return "apple";
  }
}

class Blackberry implements Fruit {
  getName() {
    return "blackberry";
  }
}

class Pie implements Recipe {
  getName() {
    return "pie";
  }
}

class Tart implements Recipe {
  getName() {
    return "tart";
  }
}

class Dumpling implements Recipe {
  getName() {
    return "dumpling";
  }
}

class Dessert implements HasName {
  private fruit: Fruit;
  private recipe: Recipe;
  constructor(fruit: Fruit, recipe: Recipe) {
    this.fruit = fruit;
    this.recipe = recipe;
  }
  getName() {
    return `a ${this.fruit.getName()} ${this.recipe.getName()}`;
  }
  getPrice() {
    const fruit = this.fruit.getName(),
      recipe = this.recipe.getName();

    // prettier-ignore
    return (
      fruit === "apple" && recipe === "pie"           ? 10
    : fruit === "apple" && recipe === "tart"          ? 4
    : fruit === "apple" && recipe === "dumpling"      ? 2
    : fruit === "blackberry" && recipe === "pie"      ? 12
    : fruit === "blackberry" && recipe === "tart"     ? 5
    : fruit === "blackberry" && recipe === "dumpling" ? 3
    : /* we don't know the price of this item     */ null);
  }
}
// end-snippet

export {};
