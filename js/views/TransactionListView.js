import View from "./View.js";
import { formatPeso, formatDate, escapeHTML } from "../helpers.js";

class TransactionListView extends View {
  _parentElement = document.querySelector("#transaction-list");
  _errorMessage = "No transactions yet. Add your first income or expense.";

  // data = array of transactions; an empty array triggers renderError()
  _generateMarkup() {
    return this._data.map((transaction) => this._generateItem(transaction)).join("");
  }

  _generateItem(transaction) {
    const { id, description, amount, type, category, date } = transaction;
    const isIncome = type === "income";

    return `
      <li class="transaction transaction--${type}" data-id="${escapeHTML(id)}">
        <div class="transaction__info">
          <p class="transaction__description">${escapeHTML(description)}</p>
          <p class="transaction__meta">
            <span class="badge badge--${type}">${isIncome ? "Income" : "Expense"}</span>
            <span>${escapeHTML(category)}</span>
            <span>${formatDate(date)}</span>
          </p>
        </div>
        <p class="transaction__amount">${isIncome ? "+" : "−"}${formatPeso(amount)}</p>
        <div class="transaction__actions">
          <button type="button" class="btn btn--small" data-action="edit">Edit</button>
          <button type="button" class="btn btn--small btn--danger" data-action="delete">Delete</button>
        </div>
      </li>
    `;
  }

  // Both handlers use event delegation on the <ul>, so they keep working
  // after the list is re-rendered or replaced by the empty-state <li>.
  addHandlerEdit(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const button = e.target.closest('[data-action="edit"]');
      if (!button) return;
      handler(button.closest(".transaction").dataset.id);
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const button = e.target.closest('[data-action="delete"]');
      if (!button) return;
      const item = button.closest(".transaction");
      const name = item.querySelector(".transaction__description").textContent;
      if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
        handler(item.dataset.id);
      }
    });
  }
}

export default new TransactionListView();
