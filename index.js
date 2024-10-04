const recipeForm = document.getElementById("recipe-form");
const app = document.getElementById("root");
const btn = document.getElementById("btn");
const container = document.createElement("div");
container.setAttribute("class", "container");
app.appendChild(container);
btn.addEventListener("click", function () {
  const existingRecipe = JSON.parse(localStorage.getItem("recipes"));
  const recipeInstance = new Recipe();
  const apiInstance = new Api(recipeInstance);
  apiInstance.fetchRecipes(existingRecipe);
});
recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { recipe } = recipeForm.elements;
  saveRecipesToLocalStorage(recipe.value);
  recipeForm.reset();
});

function saveRecipesToLocalStorage(recipe) {
  const existingRecipe = JSON.parse(localStorage.getItem("recipes"));
  if (existingRecipe) {
    existingRecipe.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(existingRecipe));
  } else {
    localStorage.setItem("recipes", JSON.stringify([recipe]));
  }
}
//Recipe class
class Recipe {
  recipes = [];

  storeAllTheRecipes(recipes) {
    this.recipes = recipes;
    const display = new Display(recipes);
    display.display();
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}

//API class
class Api {
  constructor(RecipeInstance) {
    this.storeAllTheRecipes =
      RecipeInstance.storeAllTheRecipes.bind(RecipeInstance);
  }
  #BASE_URL = "https://api.spoonacular.com";
  #API_KEY = "be63346fb44348528c05880bc7adc774";
  #END_POINT = "recipes/findByIngredients";

  async fetchRecipes(...recipes) {
    const allRecipes = await fetch(
      `${this.#BASE_URL}/${this.#END_POINT}?apiKey=${
        this.#API_KEY
      }&ingredients=${recipes}&number=2`
    );
    const results = await allRecipes.json();
    this.storeAllTheRecipes(results);
  }
}
class Display {
  recipes = [];
  constructor(recipes) {
    this.recipes = recipes;
  }
  display() {
    this.recipes.forEach((item) => {
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const h1 = document.createElement("h1");
      h1.textContent = item.title;
      card.appendChild(h1);
      //create used ingrediants desc
      item.usedIngredients.map((item) => {
        const p = document.createElement("p");
        p.textContent = `Used ingrediants ${item.name}`;

        card.appendChild(p);
      });

      //create unusedIngrediants desc

      item.unusedIngredients.map((item) => {
        const p = document.createElement("p");
        p.textContent = `Unused ingrediants  ${item.name}`;

        card.appendChild(p);
      });

      //create missing desc
      item.missedIngredients.map((item) => {
        const p = document.createElement("p");
        p.textContent = `Missing ingrediants  ${item.originalName}`;

        card.appendChild(p);
      });

      container.appendChild(card);
    });
    // this.clearLocalStorage();
  }
}
