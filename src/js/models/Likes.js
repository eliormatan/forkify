
export default class Likes{
    constructor(){
        this.list=[];
    }

    addLike(id,title,img,pub){
        const newLike={
            id,
            title,
            img,
            pub
        }
        this.list.push(newLike);
        this.updateStorage();
        return newLike;
    }

    deleteLike(id){
        const index=this.list.findIndex(e=>e.id===id);
        if(index!==-1){
            this.list.splice(index,1);
            this.updateStorage();
        }
    }

    isLiked(id){
        const index=this.list.findIndex(e=>e.id===id);
        return index===-1 ? false : true;
    }

    updateStorage(){
        window.localStorage.setItem('likes',JSON.stringify(this.list));
    }

    restoreLikes(){
        const st=JSON.parse(window.localStorage.getItem('likes'));
        if(st)
            this.list=st;
    }

}