import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearinput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    //Remove secetion from all the items
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`a[href = "#${id}"]`).classList.add('results__link--active');
}

//Pasts with tamato and spinish
const limitRecipeTitle = (title, limit = 17) => { 
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const reminderRecipe = recipe => {
    console.log(recipe.recipe_id);
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.recipe_id}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton  = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto = "${type == 'prev' ? page - 1 : page + 1}">
            <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>    
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;

const renderbutton = (page, numResults, resPerpage) => {
    const pages = Math.ceil(numResults / resPerpage);

    let button;

    if(page === 1 && pages > 1){
        //only Button tongo on next page
       button = createButton(page, 'next');

    }else if(page < pages){
        //both button
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
            `;

    }else if(page === pages && pages > 1){   
        //only button to go to prev page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page

    const start  = (page - 1)*resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach( (el) => reminderRecipe(el));

    //render results for pagination
    renderbutton(page, recipes.length, resPerPage);
};