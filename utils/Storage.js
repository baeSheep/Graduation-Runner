export default {
    saveBest(score){
        const best = localStorage.getItem("best") || 0;
        if(score > best){
            localStorage.setItem("best", score);
        }
    },

    getBest(){
        return localStorage.getItem("best") || 0;
    }
};