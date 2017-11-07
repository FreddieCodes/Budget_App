// BUDGET CONTROLLER
var budgetController = (function(){
    
})();



// UI CONTROLLER
var UIController = (function(){
    // some code
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
        // 1. Get the field input data

        // 2. Add the item to the budget controller

        // 3. Add the item to the  UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
        
       console.log('it works');
    }

   document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

   // adds the Event Listener to the global
   document.addEventListener('keypress', function(event){
    //    .which is for older browsers
       if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
           console.log('ENTER was pressed');
       }
   });

})(budgetController, UIController); // this controller knows about the other 2 modules as we have called them as arguments.