const expense_form = document.getElementById("expense-form");
const expense_list = document.getElementById("expense-list");
console.log(expense_form);

const expense_tracker = createExpenseTracker();

// display existing expense when window load
window.addEventListener("load", () => {
  expense_tracker.displayExpenses();
});

expense_form.addEventListener("submit", (e) => {
  e.preventDefault();

  //   get user expense from form
  let user_expense = expense_tracker.getUserExpense(expense_form);

  //   add the expense
  expense_tracker.addExpense(user_expense);
});

function createExpenseTracker() {
  let expenses = [];

  //   get user expense from expense form
  function getUserExpense(html_form) {
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

  //   add new expense to database
  function addExpense(new_expense) {
    let isValid = validateExpense(new_expense);

    if (isValid) {
      reloadSreen();

      expenses.push(new_expense);

      //display expenses
      displayExpenses();

      // clear the old values from form input
      clearForm();
    }
  }

  //   display all existing expenses
  function displayExpenses() {
    reloadSreen();

    if (expenses.length === 0) {
      let ele = document.createElement("p");
      ele.textContent = "You don't any expense..";
      ele.style.color = "gray";

      expense_list.insertAdjacentElement("beforeend", ele);
    } else {
      expenses.forEach((ele) => {
        let formated_ele = formatData(ele);
        expense_list.insertAdjacentHTML(
          "beforeend",
          `<li>
              <span><strong>${formated_ele.name}</strong> - ${formated_ele.amount} - ${formated_ele.date}</span>
              <button class="delete-btn">x</button>
            </li>`
        );
      });
    }
  }

  //   delete an existing expense
  function deleteExpense(id) {
    console.log("deleting expense");
  }

  // rerender the DOM
  function reloadSreen() {
    expense_list.replaceChildren("");
  }

  // displays validation errors
  function displayError(error_message, form_field) {
    let small_ele = document.createElement("small");
    small_ele.textContent = error_message;
    small_ele.style.color = "red";
    form_field.after(small_ele);
    console.log(form_field);
  }

  // clear form inputs
  function clearForm() {
    console.log(expense_form);
    expense_form.reset();
  }

  // form expenses before display on DOM
  function formatData(expense = {}) {
    // let formated_data = {};

    expense.amount = `$${expense.amount}`;
    expense.date = new Date(expense.date).toDateString();

    return expense;
  }

  return { getUserExpense, validateExpense, addExpense, displayExpenses };
}

class Expense {
  constructor(name, amount, date, id) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.date = date;
  }
}
