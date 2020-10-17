import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import {
  displayRecipes,
  removeButtons,
  removeRecipes,
  boldRecipe,
} from "./views/SearchUI";
import {
  displayRecipe,
  removeRecipe,
  updateRecipeView,
} from "./views/RecipeUI";
import { addItem, removeItem, removeAllItems } from "./views/ListUI";
import {
  toggleRecipeLike,
  toggleListLike,
  deleteLike,
  addLike,
} from "./views/LikesUI";

//base for all elements and labels 
export const elements = {
    searchField: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    recipesList: document.querySelector(".results__list"),
    pagesButtons: document.querySelector(".results__pages"),
    recipesListParent: document.querySelector(".results"),
    recipeClass: document.querySelector(".recipe"),
    shoppingList: document.querySelector(".shopping__list"),
    likesList: document.querySelector(".likes__list"),
    likesField: document.querySelector(".likes__field"),
    clearBtn: document.querySelector(".clear_btn"),
  };
  export const labels = {
    loader: "loader",
    loaderIcon: "img/icons.svg#icon-cw",
    prev: "img/icons.svg#icon-triangle-left",
    next: "img/icons.svg#icon-triangle-right",
    activeRecipe: "results__link--active",
    shoppingItem: "shopping__item",
    shoppingDelete: "shopping__delete",
    shoppingCount: "shopping__count",
    btnInline: "btn-inline",
    btnMinus: "btn-minus",
    btnPlus: "btn-plus",
    recipeBtn: "recipe__btn",
    recipeLove: "recipe__love",
  };
  


const state = {};

//-----------loader----------------

export const displayLoader = (parent) => {
  const htmlLoader = `
    <div class=${labels.loader}>
        <svg>
            <use href=${labels.loaderIcon}></use>
        </svg>
    </div>
    `;
  parent.insertAdjacentHTML("afterbegin", htmlLoader);
};

export const removeLoader = () => {
  const loader = document.querySelector(`.${labels.loader}`);
  if (loader) loader.parentNode.removeChild(loader);
};

//---------------search ctrl----------------------

const ctrlSearch = async () => {
  //get input
  const query = elements.searchField.value;

  if (query) {
    state.search = new Search(query);

    //clear UI for current query
    displayLoader(elements.recipesListParent);
    removeButtons();
    removeRecipes();

    try {
      //search and display recipe
      await state.search.getResult();
      displayRecipes(state.search.recipes);
    } catch (err) {
      alert(err);
      removeLoader();
    }

    //clear input and loader
    removeLoader();
    elements.searchField.value = "";
  }
};

//event listener for search
elements.searchForm.addEventListener("click", (event) => {
  event.preventDefault();
  ctrlSearch();
});

//event listener for pages
elements.pagesButtons.addEventListener("click", (event) => {
  const button = event.target.closest(`.${labels.btnInline}`);
  if (button) {
    const nextPage = parseInt(button.dataset.goto);
    removeButtons();
    removeRecipes();
    displayRecipes(state.search.recipes, nextPage);
  }
});

// --------------recipe ctrl----------------

const recipeCtrl = async () => {
  //get recipe id from hashcode
  const rid = window.location.hash.replace("#", "");

  if (rid) {
    state.recipe = new Recipe(rid);

    //clear UI (and bold recipe) for current recipe
    displayLoader(elements.recipeClass);
    if (state.search) boldRecipe(rid);
    removeRecipe();

    try {
      //get data of the recipe and display it to UI
      await state.recipe.getRecipe(rid);
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      displayRecipe(state.recipe, state.likes.isLiked(rid));
      removeLoader();
    } catch (err) {
      alert(err);
      removeLoader();
    }
  }
};

//event listener for loading the recipe
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, recipeCtrl)
);

//event listener to handle the recipe events
elements.recipeClass.addEventListener("click", (e) => {
  if (e.target.matches(`.${labels.btnMinus}, .${labels.btnMinus} *`)) {
    //decrease servings
    if (state.recipe.serv > 1) state.recipe.updateRecipe("minus");
    updateRecipeView(state.recipe);
  } else if (e.target.matches(`.${labels.btnPlus}, .${labels.btnPlus} *`)) {
    //increase servings
    state.recipe.updateRecipe("plus");
    updateRecipeView(state.recipe);
  } else if (e.target.matches(`.${labels.recipeBtn}, .${labels.recipeBtn} *`)) {
    //add shopping
    listCtrl();
  } else if (
    e.target.matches(`.${labels.recipeLove}, .${labels.recipeLove} *`)
  ) {
    //add like
    likesCtrl();
  }
});

// --------------list ctrl----------------

const listCtrl = () => {
  //create and display shopping list
  state.recipe.ing.forEach((e) => {
    const newItem = state.list.addItem(e.count, e.units, e.text);
    addItem(newItem);
  });
};

//event listener to handle the shopping events
elements.shoppingList.addEventListener("click", (e) => {
  const item = e.target.closest(`.${labels.shoppingItem}`);
  if (item) {
    if (
      e.target.matches(`.${labels.shoppingDelete}, .${labels.shoppingDelete} *`)
    ) {
      //remove item
      state.list.removeItem(item.dataset.id);
      removeItem(item.dataset.id);
    } else if (
      e.target.matches(`.${labels.shoppingCount}, .${labels.shoppingCount} *`)
    ) {
      //update count item
      state.list.updateCount(item.dataset.id, parseFloat(e.target.value, 10));
    }
  }
});

//event listener to remove all shoping list
elements.clearBtn.addEventListener("click", () => {
  if (state.list.shop) {
    removeAllItems(state.list.shop);
    state.list.removeAllItems();
  }
});

// --------------likes ctrl----------------

const likesCtrl = () => {
  const r = state.recipe;
  const isLiked = state.likes.isLiked(r.rid);

  //already liked
  if (isLiked) {
    //remove like from the recipe   
    toggleRecipeLike(false);
    state.likes.deleteLike(r.rid);
    deleteLike(r.rid);
  } else {
    //add like to the recipe   
    toggleRecipeLike(true);
    const newLike = state.likes.addLike(r.rid, r.title, r.img, r.pub);
    addLike(newLike);
  }

  //toggle like list icon
  toggleListLike(state.likes.list.length);
};
// ------------------------------------------

//event listener to restore data when loading the page
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.list = new List();

  state.likes.restoreLikes();
  toggleListLike(state.likes.list.length);
  state.likes.list.forEach((e) => addLike(e));

  state.list.restoreList();
  state.list.shop.forEach((e) => addItem(e));
});


