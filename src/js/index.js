import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './Views/searchView';
import * as recipeView from './Views/recipeView';
import * as listView from './Views/listView';
import * as likesView from './Views/likesView';
import {elements, renderloader, clearLoader} from './Views/base';

/**Global state
 * search obj
 * Curent recipes obj
 * Shopping list obj
 * Linked Recipes
 * */

const state = {};
window.state = state;

/**
 * Search Controller
 */
const controlSearch = async () => {
    //1. Get query from view
    const query = searchView.getInput();

    if(query){
        //2. new search obj and add it to state
        state.search = new Search(query);

        //3. prepare UI fro results
        searchView.clearinput();
        searchView.clearResults();
        renderloader(elements.searchResult);

        try{
             //4. search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(error){
            alert(error);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
    }
});


/**
 * Recipe Controller
 */

//  const res = new Recipe(47746);
//  res.getRecipe();
// console.log(res);

const controlRecipe = async () => {
    //Get ID from URl
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderloader(elements.recipe);

        //highlight selected search Item
        if(state.search) searchView.highlightSelected(id);


        //create new recipe object
        state.recipe = new Recipe(id);

        try{

            //get recipe data and parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculte serving and time
            state.recipe.calcTime();
            state.recipe.calcServing();
    
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        }catch(error){
            alert(error);
        }
       
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)) 

/*
*List Controller
*/

const controlList = () => {
    //Create new list if there is none yet
    if(!state.list) state.list = new List();
    
    //Add ingredient into list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};

//handle delete and update list item event
elements.shopping.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;

    //handle del event

    if(el.target.matches('.shopping__delete, .shopping__delete *')){
        //DEL from state 
        state.list.deleteItem(id);

        //DEL from ui
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.upadteCount(id, val);
    }


});

/*
*Like Controller
*/

//For Testing
state.likes = new Likes();
likesView.toggelLikeMenu(state.likes.getNumLikes());

const constrolLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currID = state.recipe.id;

    //User has not likes the current recipe
    if(!state.likes.isLiked(currID)){
        //Add Like to state
        const newLike = state.likes.addLike(
            currID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);

    //User has liked the current recipe    
    }else{

        //remove Like to state
        state.likes.deleteLike(currID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like to UI list
       likesView.deleteLike(currID);
    }
    likesView.toggelLikeMenu(state.likes.getNumLikes());
}
 

//Handling Recipe button clicks, All recipe evenet are handling here
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease btn clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServiceIngredient(state.recipe);
        }
    }

    if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase btn clicked
        state.recipe.updateServings('inc');
        recipeView.updateServiceIngredient(state.recipe);
    
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredient to shopping list
        controlList();
    
    }else if(e.target.matches('.recipe__love, .recipe__love *')){//* denotes that we are selecting childs as well
        //Like controller
        constrolLike();
    }
});

window.loc = new List();
