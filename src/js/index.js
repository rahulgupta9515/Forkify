import Search from './models/Search';
import * as searchView from './Views/searchView';
import {elements, renderloader, clearLoader} from './Views/base';

/**Global state
 * search obj
 * Curent recipes obj
 * Shopping list obj
 * Linked Recipes
 * */

const state = {

}

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

        //4. search for recipes
        await state.search.getResults();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
