// BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
       }
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length> 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new iteam based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            // the arrays are called exp and inc so we can use type to select the correct array
            // Push it into our data structure
            data.allItems[type].push(newItem)
            // return the new element
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    };

})();

// UI CONTROLLER
var UIController = (function(){
    //  store all query selectors etc in here
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // reads value of .add__type class (either inc or exp)
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function(){
            // exposing the DOMstrings object to the public.
            return DOMstrings;
        }


    }

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
           // adds the Event Listener to the global
        document.addEventListener('keypress', function(event){
         //    .which is for older browsers
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            //    console.log('ENTER was pressed');
            }
        });
    }

    var ctrlAddItem = function(){

        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. Add the item to the  UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: function(){
            setupEventListeners();
        }
    }

})(budgetController, UIController); // this controller knows about the other 2 modules as we have called them as arguments.

controller.init();