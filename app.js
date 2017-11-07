var budgetController = (function(){
    var x = 23;
    var add = function(a){
        return x + a;
    }

    // only public be available after the IIFE has retured but all of the variables
    // in the outerscope will remain avaiable to the publicTest function.
    return{
        publicTest: function(b) {
            return add(b); //28
        }
    }
})();

var UIController = (function(){
    // some code
})();

var controller = (function(budgetCtrl, UICtrl){
    var z = budgetCtrl.publicTest(5)

    return {
        anotherPublic: function(){
            console.log(z); // 28
        }
    }
})(budgetController, UIController); // this controller knows about the other 2 modules as we have called them as arguments.