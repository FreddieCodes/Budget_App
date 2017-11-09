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

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    }

    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
       },
        budget: 0,
        percentage: -1 // -1 = non existant
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
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
            // [1,2,4,6,8]
            // index = 3  (if targeting id of 6)
            // map creates a new array
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            // finds the ids index in new array ids
            index = ids.indexOf(id);

            if (index !== -1) {
                // deletes the array with the index with the matching id
                data.allItems[type].splice(index, 1);
            }
            

        },

        calculateBudget: function(){
            //  calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //  calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //  calculate the percentage of income that we spent if income is greater than 0
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }
            
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'  
            } else {
                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },

        deleteListItem: function(selectorID){
            var el;
            el = document.getElementById(selectorID);
            // you can only remove Child so you have to target the ParentNode first
            el.parentNode.removeChild(el);

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

        displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
           
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    }

    var updateBudget = function(){
        var budget;

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
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


    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        // going to use event.target to target the node that is clicked and then use DOM traversing
        // to target it's parent Nodes, parent nodes, parents node id.
        // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. update and show the new budget
            updateBudget();
        }


    }


    return {
        init: function(){
            console.log('application has started');
            setupEventListeners();
            // set's UI elements to 0 at the start
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
        }
    }

})(budgetController, UIController); // this controller knows about the other 2 modules as we have called them as arguments.

controller.init();