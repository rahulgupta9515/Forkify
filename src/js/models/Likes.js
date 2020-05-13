export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        //Presist the data in local storage
        this.presistData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

         //Presist the data in local storage
         this.presistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    //Store data in local storage
    presistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStotage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restore the like from localstorage
        if(storage) this.likes = storage;
    }
}