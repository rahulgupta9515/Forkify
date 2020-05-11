import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
            alert(error);
        }
    }
    
    calcTime(){
        //Assuming we need 15 min for every 3 ingredient
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng/3);
        this.time = period * 15;
    }

    calcServing() {
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoons', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            //1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient =  ingredient.replace(unit, unitShort[i]);
            });
            //2.Remove Parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Prase ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;

            if(unitIndex > -1){
                //There is a unit
                // 4 1/2 cups are count [4, 1/2] --> eval(4 + 1/2) = 4.5
                const arrCount  = arrIng.slice(0, unitIndex); 

                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count =  eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng ={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };


            }else if(parseInt(arrIng[0], 10)){
                //There is a number but no unit
                objIng ={
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };

            }else if(unitIndex == -1){
                //There is no unit and no number in 1st position
                objIng ={
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type){ //type for inc or dec
        //Servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

        //Ingreidents
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });


        this.servings = newServings;
    }
}