import axios from 'axios';
import { elements } from '..';

export default class Recipe{
    constructor(rid){
        this.rid=rid;
    }

    async getRecipe(rid){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${rid}`);
            const r=res.data.recipe;
            this.img=r.image_url;
            this.ing=r.ingredients;
            this.pub=r.publisher;
            this.url = r.source_url;
            this.title=r.title;
        }catch(err){
            alert(err);
        }
    }

    calcTime(){
        this.time=Math.ceil(this.ing.length/3)*15;  //assume every 3 ing is 15 min
    }

    calcServings(){
        this.serv= (this.ing.length>6 ? 4 : 2);     //assume more than 6 ing = 4 servings
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];


        //replace units
        this.ing=this.ing.map(el => {
                let curr=el.toLowerCase();
                unitsLong.forEach((u,i)=>{
                        curr=curr.replace(u,unitsShort[i]);
                })
                curr = curr.replace(/ *\([^)]*\) */g, ' ');     //Remove text between parentheses
                const currArr=curr.split(' ');
                const index=currArr.findIndex(e=>units.includes(e));

                let retObj={
                    count:1,
                    units:'',
                };
                if(index>-1){                                                    //example: 1 1/2 cup   
                    const countArr=currArr.slice(0,index);
                    if(countArr.length===1 && countArr[0]==='') retObj.count;  
                    else if(countArr.length===1) retObj.count=parseFloat(eval(countArr[0].replace('-','+')).toFixed(2));
                    else retObj.count=parseFloat(eval(countArr.join('+')).toFixed(2));
                    retObj.units=currArr[index];
                    retObj.text=currArr.slice(index+1).join(' ');
                }
                else if((parseInt(currArr[0],10))){                           //example: 1/2 pizza
                    retObj.count=parseFloat(eval(currArr[0]).toFixed(2));
                    retObj.text=currArr.slice(1).join(' ');
                }
                else if(index===-1){                                    //example: pizza
                    retObj.text=curr;                                                                 
                }               
                return retObj;
            });
    }

    updateRecipe(type){
        const lastServ=this.serv;
        this.serv = (type==='minus' ? this.serv-1 : this.serv+1);
        this.ing.forEach(e=>{
            e.count*= (this.serv/lastServ); 
        });
    }
}

