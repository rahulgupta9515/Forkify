import uniqid from 'uniqid';

export default class List{

    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredent){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredent
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);

        this.items.splice(index, 1);
    }

    upadteCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;

    }
} 