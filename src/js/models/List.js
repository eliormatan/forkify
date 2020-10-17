
export default class List{
    constructor(){
        this.shop=[];
        this.gen=this.uniqueId();
    }

    isEmpty(){
        return this.shop.length===0;
    }

    *uniqueId(id=-1) {
         while(true){
             yield (++id).toString();
         }
        
    }

    addItem(count,units,text){
        const toAdd={
            id: this.gen.next().value,
            count,
            units,
            text
        }
        this.shop.push(toAdd);
        this.updateStorage();
        return toAdd;
    }

    removeItem(id){
        const index=this.shop.findIndex(e=>e.id===id);
        if(index!==-1){
            this.shop.splice(index,1);
            this.updateStorage();
        }
    }

    removeAllItems(){
        this.shop=[];
        this.updateStorage();
    }

    updateCount(id,newCount){
        const index=this.shop.findIndex(e=>e.id===id);
        if(index!==-1)
        {
            this.shop[index].count=newCount;
            this.updateStorage();
        }
    }

    updateStorage(){
        window.localStorage.setItem('shop',JSON.stringify(this.shop));
    }

    restoreList(){
        const l=JSON.parse(window.localStorage.getItem('shop'));
        if(l)
            this.shop=l;

        if(!this.isEmpty())
            this.gen=this.uniqueId(l[l.length-1].id);
    }

}