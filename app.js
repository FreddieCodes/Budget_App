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
            if (data.allItems[type].length > 0) {
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // reads value of .add__type class (either inc or exp)
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'  
            } else {
                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            // uses the array objects slice method on fields.
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array){
                //  clears all the .values in the array
                current.value = "";
            })
            // sets focus back to first element of array
            fieldsArr[0].focus()
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

    var updateBudget = function(){

        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget on the UI
    }

    var ctrlAddItem = function(){
    
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();
        // console.log(input);
        // if string description isn't empty and input value is a number and is greater than 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        
            // 3. Add the item to the  UI
            UICtrl.addListItem(newItem, input.type)
            // 4. Clear the fields
            UICtrl.clearFields()
        
            // 5. Calculate and update budget
            updateBudget()
        }

        
      
    }

    return {
        init: function(){
            console.log('application has started');
            setupEventListeners();
        }
    }

})(budgetController, UIController); // this controller knows about the other 2 modules as we have called them as arguments.

controller.init();