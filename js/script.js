const expense_form = document.getElementById("expense-form");
const expense_list = document.getElementById("expense-list");
console.log(expense_list);

const expense_tracker = expenseTracker();

expense_form.addEventListener("submit", (e) => {
  e.preventDefault();

  //   get user expense from form
  let user_expense = expense_tracker.extractFormData(expense_form);

  //   add the expense
  expense_tracker.addExpense(user_expense);

  //   display expenses
  expense_tracker.displayExpenses();
});

function expenseTracker() {
  let expenses = [];

  //   get user input from expense form
  const extractFormData = (html_form) => {
    let form_data = new FormData(html_form);
    let expense = new Expense();

    // loop through form data and get the key and value for each form field
    form_data.forEach((ele, key) => {
      expense[key] = ele;
    });

    // add expense id
    expense.id = expenses.length + 1;

    return expense;
  };

  //   add new expense to database
  const addExpense = (new_expense) => {
    expenses.push(new_expense);
    console.log("all expenses", expenses);
  };

  //   display all existing expenses
  const displayExpenses = () => {
    expenses.forEach((ele) => {
      expense_list.insertAdjacentHTML(
        "beforeend",
        `<li>
              <span>${ele.name}-${ele.amount}-${ele.date}</span>
              <button class="delete-btn">x</button>
            </li>`
      );
    });
    console.log("displaying expenses");
  };

  //   delete an existing expense
  const deleteExpense = (id) => {
    console.log("deleting expense");
  };

  return { extractFormData, addExpense, displayExpenses };
}

class Expense {
  constructor(name, amount, date, id) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.date = date;
  }
}
