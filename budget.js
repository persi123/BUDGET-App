var BudgetControllers = (function() {
  var Expenses = function(id, discription, value) {
    this.id = id;
    this.discription = discription;
    this.value = value;
    this.percentage = -1;
  };
  Expenses.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentage = function() {
    return this.percentage;
  };
  var Income = function(id, discription, value) {
    this.id = id;
    this.discription = discription;
    this.value = value;
  };

  var CalculateTotals = function(type) {
    var sum = 0;
    data.AllItems[type].forEach(function(cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    AllItems: {
      exp: [],
      Inc: []
    },
    totals: {
      exp: 0,
      Inc: 0
    },
    budget: 0,
    Percentage: -1
  };

  return {
    AddItem: function(type, des, val) {
      var newItem, Id;
      // create an id to access the items in the array to add more items in that array.
      if (data.AllItems[type].length > 0) {
        Id = data.AllItems[type][data.AllItems[type].length - 1].id + 1;
      } else {
        Id = 0;
      }

      if (type === "Inc") {
        newItem = new Income(Id, des, val);
      } else if (type === "exp") {
        newItem = new Expenses(Id, des, val);
      }
      data.AllItems[type].push(newItem);

      return newItem;
    },
    CalculateBudget: function(type) {
      CalculateTotals("Inc");
      CalculateTotals("exp");
      ////calulate remain budget
      data.budget = data.totals.Inc - data.totals.exp;

      ////calculate percentage
      if (data.totals.Inc > 0) {
        data.Percentage = Math.round((data.totals.exp / data.totals.Inc) * 100);
      } else {
        data.Percentage = -1;
      }
    },
    calculatePercentage: function() {
      data.AllItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.Inc);
        console.log(cur);
      });
    },

    getPercentage: function() {
      var allPerc = data.AllItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function() {
      return {
        budget: data.budget,
        percentage: data.Percentage,
        totalInc: data.totals.Inc,
        totalexp: data.totals.exp
      };
    },
    deleteItemfromBudget: function(type, ide) {
      var ids, index;

      ids = data.AllItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(ide);
      if (index !== -1) {
        data.AllItems[type].splice(index, 1);
      }
    },
    testing: function() {
      console.log(data);
    }
  };
})();

var UiController = (function() {
  var DomStrings = {
    InputTypes: ".Types",
    DataSub: ".data_sub",
    InputValue: ".value",
    Donebtn: ".done",
    incomeContainer: ".Income_list",
    ExpensesContainer: ".Expences_list",
    Budgetlable: ".total_budget",
    incomeLable: ".profit",
    expenceLable: ".loss",
    percentageLable: ".percentage",
    container: ".discription",
    expPercentage: ".exp_percentage"
  };
  return {
    getData: function() {
      return {
        Type: document.querySelector(DomStrings.InputTypes).value,
        discription: document.querySelector(DomStrings.DataSub).value,
        Value: parseFloat(document.querySelector(DomStrings.InputValue).value)
      };
    },
    addListItem: function(obj, type /*, per*/) {
      var html, newHtml, element;

      // create html string with placehoplder tag
      if (type === "Inc") {
        element = DomStrings.incomeContainer;
        html =
          '<div class="list_block" id="Inc-%d%"><h3 class="data_discription">%discription%</h3><div class="data_value">%value%</div><div class="delete_btn"><button><i class="fa fa-times-circle"></i></button></div></div>';
      } else if (type === "exp") {
        element = DomStrings.ExpensesContainer;
        html =
          '<div class="list_block" id="exp-%d%"><h3 class="data_discription">%discription%</h3><div class="data_value">%value%</div>  <p class="exp_percentage">%percentage%</p><div class="delete_btn"><button><i class="fa fa-times-circle"></i></button></div></div>';
      }
      console.log(obj.value);
      newHtml = html.replace("%d%", obj.id);
      newHtml = newHtml.replace("%discription%", obj.discription);
      newHtml = newHtml.replace("%value%", obj.value);
      // newHtml = newHtml.replace("%percentage%", per);
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deletelist: function(selectedId) {
      console.log(selectedId);
      var el = document.getElementById(selectedId);
      el.parentNode.removeChild(el);
    },

    ClearValue: function() {
      var fields, fieldArr;
      fields = document.querySelectorAll(
        DomStrings.DataSub + ", " + DomStrings.InputValue
      );
      console.log(fields);
      fieldArr = Array.prototype.slice.call(fields);
      console.log(fieldArr);
      fieldArr.forEach(function(current) {
        current.value = "";
      });
    },
    displayBudget: function(obj) {
      document.querySelector(DomStrings.Budgetlable).textContent = obj.budget;
      document.querySelector(DomStrings.incomeLable).textContent = obj.totalInc;
      document.querySelector(DomStrings.expenceLable).textContent =
        obj.totalexp;
      document.querySelector(DomStrings.percentageLable).textContent =
        obj.percentage + "%";
    },
    displayPercentage: function(percentages) {
      var allFields = document.querySelectorAll(DomStrings.expPercentage);
      console.log("hlo");
      var nodeList = function(list, callback) {
        for (i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      nodeList(allFields, function(current, index) {
        console.log(current);
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "--";
        }
      });
    },
    DomString: function() {
      return DomStrings;
    }
  };
})();

var Controller = (function(UiCtrl, budgetCtrl) {
  var SetupEventListners = function() {
    var Dom = UiCtrl.DomString();
    document.querySelector(Dom.Donebtn).addEventListener("click", CtrlAdd);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        CtrlAdd();
      }
    });
    document
      .querySelector(Dom.container)
      .addEventListener("click", delete_data);
  };

  var UpdateBudget = function(type) {
    budgetCtrl.CalculateBudget(type);

    var budget = budgetCtrl.getBudget();
    //call for display the items in ui
    UiCtrl.displayBudget(budget);
    console.log(budget);
  };
  var updatePercentages = function() {
    //calculate budget
    budgetCtrl.calculatePercentage();

    //read persentage from the budget controller
    var percentage = budgetCtrl.getPercentage();

    console.log(percentage);
    ///update the ui of percentages
    UiCtrl.displayPercentage(percentage);
  };
  var CtrlAdd = function() {
    //here getInput is and object which contains the getData object.
    var Input = UiCtrl.getData();
    console.log(Input);
    if (Input.discription !== "" && !isNaN(Input.Value) && Input.Value > 0) {
      //Add the item to the budget controller
      var newItem = budgetCtrl.AddItem(
        Input.Type,
        Input.discription,
        Input.Value
      );
      console.log(newItem);
      // var buddy = budgetCtrl.getBudget();
      //add the data in the ui list
      UiCtrl.addListItem(newItem, Input.Type /* ,buddy.percentage*/);

      //call the function to clear after submit
      UiCtrl.ClearValue();

      //call update budget
      UpdateBudget(Input.Type);

      //call and update percentages
      updatePercentages();
    }
  };

  var delete_data = function(event) {
    var itemId;
    itemId = event.target.parentNode.parentNode.parentNode.id;
    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      Id = parseInt(splitId[1]);
      UiCtrl.deletelist(itemId);
      budgetCtrl.deleteItemfromBudget(type, Id);
      UpdateBudget();
    }
  };
  return {
    init: function() {
      SetupEventListners();
    }
  };
})(UiController, BudgetControllers);

Controller.init();
BudgetControllers.testing();
