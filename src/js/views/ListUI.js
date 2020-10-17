import {elements} from '../index';  

export const addItem=item=>{
    const html=
    `
    <li class="shopping__item" data-id=${item.id}>
    <div class="shopping__count">
        <input type="number" value="${Math.trunc(item.count)+1}" step="${Math.trunc(item.count)+1}" min="0">
        <p>${item.units}</p>
    </div>
    <p class="shopping__description">${item.text}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
    </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend',html);
}

export const removeItem=id=>{
    const item=document.querySelector(`[data-id="${id}"]`);
    if(item)
        item.parentElement.removeChild(item);      
    
};

export const removeAllItems=list=>{
    list.forEach(e => {
        removeItem(e.id);
    });
};