// begin-snippet: apple-blackberry
class Apple {}
class Blackberry {}
// end-snippet

// begin-snippet: fruit-type
type Fruit = Apple | Blackberry;
// end-snippet

// begin-snippet: dessert-type
class Pie {}
class Tart {}
class Dumpling {}

type Recipe = Pie | Tart | Dumpling;

class Dessert {
  fruit: Fruit;
  recipe: Recipe;
  constructor(fruit: Fruit, recipe: Recipe) {
    this.fruit = fruit;
    this.recipe = recipe;
  }
}
// end-snippet

// begin-snippet: apple-tart
const appleTart = new Dessert(new Apple(), new Tart());
// end-snippet

// begin-snippet: fruit-recipe-to-string
function fruitToString(fruit: Fruit): string {
  return fruit instanceof Apple ? "apple" : "blackberry";
}

function recipeToString(recipe: Recipe): string {
  // prettier-ignore
  return recipe instanceof Pie  ? "pie"
  :      recipe instanceof Tart ? "tart"
  :      /* it's a Dumpling */ "dumpling";
}
// end-snippet

// begin-snippet: dessert-to-string
function dessertToString(d: Dessert): string {
  return `a ${fruitToString(d.fruit)} ${recipeToString(
    d.recipe
  )}`;
}
// end-snippet

// begin-snippet: price
function price(d: Dessert): number {
  // prettier-ignore
  return (  
    d.fruit instanceof Apple && d.recipe instanceof Pie ? 10  
  : d.fruit instanceof Apple && d.recipe instanceof Tart ? 4  
  : d.fruit instanceof Apple && d.recipe instanceof Dumpling ? 2  
  : d.fruit instanceof Blackberry && d.recipe instanceof Pie ? 12  
  : d.fruit instanceof Blackberry && d.recipe instanceof Tart ? 5  
  : /* we have a blackberry dumpling */ 3);
}
// end-snippet

export {};
