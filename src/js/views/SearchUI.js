import {labels,elements} from '..';

const addHtmlRecipe=recipe=>{
    const newRecipe = `
    <li>
    <a class="results__link" href=#${recipe.recipe_id}>
        <figure class="results__fig">
            <img src=${recipe.image_url} alt=${shortenTitle(recipe.title)}>
        </figure>
        <div class="results__data">
            <h4 class="results__name">${shortenTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;

    elements.recipesList.insertAdjacentHTML('afterbegin',newRecipe);
};

export const displayRecipes=(recipes,page=1,recipesPerPage=10)=>{
    const start=(page-1)*recipesPerPage;
    const end=recipesPerPage*page;
    recipes.slice(start,end).forEach(recipe => {
        addHtmlRecipe(recipe);
    });
    pagination(recipes.length,recipesPerPage,page);
};

export const pagination=(recipesNum,recipesPerPage=10,currPage=1)=>{
    const pagesNum=Math.ceil(recipesNum/recipesPerPage);
    if(currPage===1 && pagesNum>1){
        addButton('next',2);
    } else if(currPage===pagesNum){
        addButton('prev',pagesNum-1);
    } else if(currPage>1 && currPage<pagesNum){
        addButton('prev',currPage-1);
        addButton('next',currPage+1);
    }
};
  
const addButton=(type,page)=>{
    const button=`
    <button class="btn-inline results__btn--${type}" data-goto=${page}>
        <svg class="search__icon">
            <use href=${type==='prev'? labels.prev : labels.next}></use>
        </svg>
        <span>Page ${page}</span>
    </button>
    `;

    elements.pagesButtons.insertAdjacentHTML('afterbegin',button);
};

export const removeButtons=()=>{
    elements.pagesButtons.innerHTML='';
};

export const removeRecipes=()=>{
    elements.recipesList.innerHTML='';
};

export const shortenTitle=(title,limit=17)=>{
    let newTitle,index=0;
    if(title<=limit){
        newTitle=title;
    }
    else{
        title.split(' ').reduce((acc,curr)=>{
            if(acc+curr.length<=limit){
                index++;
            }
            return acc+curr.length;
        },0);
        newTitle=title.split(' ').slice(0,index).join(' ')+'...';
    }
    return newTitle;
};

export const boldRecipe=(id)=>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove(labels.activeRecipe);
    });
  
    const active=document.querySelector(`.results__link[href*="${id}"]`);
    if(active){
        active.classList.add(labels.activeRecipe);
    }
};
