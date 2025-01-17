import {labels,elements} from '..';
import {Fraction} from 'fractional';

export const displayRecipe=(recipe,isLiked)=>{
    const html=`
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
<div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.serv}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-minus">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-plus">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>
    </div>

    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
        </svg>
    </button>
</div>



<div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ing.map(e => addIngredient(e)).join('')}
        </ul>

    <button class="btn-small recipe__btn">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.pub}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href=${recipe.url} target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>
`;

elements.recipeClass.insertAdjacentHTML('afterbegin',html);

};

const addIngredient=e=>{
    return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatNumber(e.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${e.units}</span>
            ${e.text}
        </div>
    </li>
`;
};

export const removeRecipe=()=>{
    elements.recipeClass.innerHTML='';
};


export const updateRecipeView = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.serv;
    const elements = Array.from(document.querySelectorAll('.recipe__count'));
    elements.forEach((e, i) => {
        e.textContent = formatNumber(recipe.ing[i].count);
    });
};


const formatNumber = num => {
    if (num) {
        num = Math.round(num * 100) / 100;
        const [int, dec] = num.toString().split('.').map(el => parseInt(el, 10));

        if (!dec) return num;

        if (int === 0) {
            const fr = new Fraction(num);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(num - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};
