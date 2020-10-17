import {elements} from '../index';
import {shortenTitle} from '../views/SearchUI'

export const addLike=obj=>{
    const html=
    `
    <li>
        <a class="likes__link" href=#${obj.id}>
            <figure class="likes__fig">
                <img src=${obj.img} alt=${obj.title}>
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${shortenTitle(obj.title)}</h4>
                <p class="likes__author">${obj.pub}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend',html);
};

export const deleteLike=id=>{
    const e=document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(e)
        e.parentElement.removeChild(e);  
};

export const toggleRecipeLike = isLiked => {
    const heartIcon = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${heartIcon}`);
};

export const toggleListLike = likesNum => {
    elements.likesField.style.visibility = likesNum > 0 ? 'visible' : 'hidden';
};
