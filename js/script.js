const expense_form = document.getElementById("expense-form");
const expense_list = document.getElementById("expense-list");

const db = createDatabase();
const expense_tracker = createExpenseTracker();

// display existing expense when window load
window.addEventListener("load", () => {
  expense_tracker.startApp();
});

// add expense when form is submited
expense_form.addEventListener("submit", (e) => {
  e.preventDefault();

  //   get user expense from form
  let user_expense = expense_tracker.extractFormData(expense_form);

  //   add the expense
  expense_tracker.addExpense(user_expense);
});

// delete expense when a delete button is clicked
document.addEventListener("click", (e) => {
  let clicked_ele = e.target;

  if (clicked_ele.classList.contains("delete-btn")) {
    let expense_id = clicked_ele.id;
    expense_tracker.deleteExpense(expense_id);
  }
});

function createExpenseTracker() {
  function startApp() {
    db.INITIALIZE();
    expense_tracker.displayExpenses();
  }

  //get user expense from expense form
  function extractFormData(html_form) {
    // get all existing expenses from db
    let expenses = db.FIND();

    let user_expense = {};

    // get form data
    let form_data = new FormData(html_form);

    // loop through form data and get the key and value for each form field
    form_data.forEach((ele, key) => {
      user_expense[key] = ele;
    });

    // add expense id
    user_expense.id = expenses.length + 1;

    return user_expense;
  }

  //validate user expense, return 1 if there's error and 0 if there's none
  function validateExpense(expense = {}) {
    if (!expense.name || expense.name.trim() === "") {
      alert("Expense name is required");

      return false;
    }

    if (!expense.amount || expense.amount.trim() === "") {
      alert("Amount name is required");
      return false;
    }

    if (!expense.date || expense.date.trim() === "") {
      alert("Expense date is required");
      return false;
    }

    return true;
  }

  //add new expense to database
  function addExpense(new_expense) {
    // validate new expense
    let isValid = validateExpense(new_expense);

    if (isValid) {
      reloadSreen();

      // add new expense to database
      db.CREATE(new_expense);

      //display expenses
      displayExpenses();

      // clear the old values from form input
      clearForm();
    }
  }

  //display all existing expenses
  function displayExpenses() {
    // get expenses from database
    let expenses = db.FIND();

    reloadSreen();

    if (expenses.length === 0) {
      // create and style a new element
      let ele = document.createElement("p");
      ele.textContent = "You don't any expense..";
      ele.style.color = "gray";

      // display in DOM
      expense_list.insertAdjacentElement("beforeend", ele);
    } else {
      expenses.forEach((ele) => {
        let formated_ele = formatData(ele);
        expense_list.insertAdjacentHTML(
          "beforeend",
          `<li>
              <span><strong>${formated_ele.name}</strong> - ${formated_ele.amount} - ${formated_ele.date}</span>
              <button class="delete-btn" id=${formated_ele.id}>x</button>
            </li>`
        );
      });
    }
  }

  //delete an existing expense
  function deleteExpense(id) {
    db.DELETE(id);

    reloadSreen();
    displayExpenses();
  }

  // rerender the DOM
  function reloadSreen() {
    expense_list.replaceChildren("");
  }

  // clear form inputs
  function clearForm() {
    expense_form.reset();
  }

  // form expenses before display on DOM
  function formatData(expense = {}) {
    // let formated_data = {};

    expense.amount = `$${expense.amount}`;
    expense.date = new Date(expense.date).toDateString();

    return expense;
  }

  return {
    startApp,
    extractFormData,
    validateExpense,
    addExpense,
    deleteExpense,
    displayExpenses,
  };
}

// manages localStorage
function createDatabase() {
  return {
    // add an empty object to localStorage
    INITIALIZE() {
      // get all expenses from local storage
      let expenses = JSON.parse(localStorage.getItem("expenses"));

      // create expenses array in local storage if it doesn't alreay exist
      if (!expenses) {
        localStorage.setItem("expenses", JSON.stringify([]));
        console.log("create expenses array...");
      }
    },

    // get values from local storage
    FIND() {
      let expenses = JSON.parse(localStorage.getItem("expenses"));
      return expenses;
    },

    // add value to local storage
    CREATE(new_expense) {
      if (new_expense) {
        // get expenses from localStorage
        let expenses = JSON.parse(localStorage.getItem("expenses"));

        // add new expense to existing expenses
        expenses.push(new_expense);

        // save the updated details back to local storage
        localStorage.setItem("expenses", JSON.stringify(expenses));
      }
    },

    // remove value from localStorage
    DELETE(id) {
      // get expenses from localStorage
      let expenses = JSON.parse(localStorage.getItem("expenses"));

      // remove the element that match the id provided
      let result = expenses.filter((ele) => ele.id !== parseInt(id));

      localStorage.setItem("expenses", JSON.stringify(result));
    },
  };
}
