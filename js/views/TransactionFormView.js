import View from "./View.js";
import { escapeHTML } from "../helpers.js";

class TransactionFormView extends View {
  _parentElement = document.querySelector("#form-container");
  _errorMessage = "The form could not be loaded.";
  _storageErrorMessage = "Unable to save your changes. Please try again.";

  // data = { categories: [...], transaction: null | {id, description, ...} }
  // transaction === null  -> "add" mode, otherwise "edit" mode
  _generateMarkup() {
    const { categories, transaction } = this._data;
    const isEditing = Boolean(transaction);
    const {
      id = "",
      description = "",
      amount = "",
      type = "",
      category = "",
      date = new Date().toLocaleDateString("en-CA"), // local YYYY-MM-DD
    } = transaction ?? {};

    const categoryOptions = categories
      .map(
        (name) =>
          `<option value="${escapeHTML(name)}" ${name === category ? "selected" : ""}>${escapeHTML(name)}</option>`
      )
      .join("");

    return `
        <h2>${isEditing ? "Edit Transaction" : "Add Transaction"}</h2>
        <p class="storage-error" role="alert" hidden></p>
        <form class="transaction-form" novalidate>
        <input type="hidden" name="id" value="${escapeHTML(id)}" />

        <div class="field">
          <label for="description">Description</label>
          <input type="text" id="description" name="description"
                 value="${escapeHTML(description)}" placeholder="e.g. Lunch at the canteen" />
          <small class="field-error" data-error-for="description"></small>
        </div>

        <div class="field">
          <label for="amount">Amount (₱)</label>
          <input type="number" id="amount" name="amount" step="0.01"
                 value="${escapeHTML(amount)}" placeholder="0.00" />
          <small class="field-error" data-error-for="amount"></small>
        </div>

        <div class="field">
          <label for="type">Type</label>
          <select id="type" name="type">
            <option value="">Select type</option>
            <option value="income" ${type === "income" ? "selected" : ""}>Income</option>
            <option value="expense" ${type === "expense" ? "selected" : ""}>Expense</option>
          </select>
          <small class="field-error" data-error-for="type"></small>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <select id="category" name="category">
            <option value="">Select category</option>
            ${categoryOptions}
          </select>
          <small class="field-error" data-error-for="category"></small>
        </div>

        <div class="field">
          <label for="date">Date</label>
          <input type="date" id="date" name="date" value="${escapeHTML(date)}" />
          <small class="field-error" data-error-for="date"></small>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn--primary">
            ${isEditing ? "Save Changes" : "Add Transaction"}
          </button>
          ${isEditing ? `<button type="button" class="btn" data-action="cancel">Cancel</button>` : ""}
        </div>
      </form>
    `;
  }

  // Publisher: the Controller subscribes. Delegation on the parent means the
  // listener survives every re-render of the form.
  addHandlerSubmit(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      handler(formData);
    });
  }

  addHandlerCancel(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="cancel"]')) handler();
    });
  }

  // errors = { description: "message", amount: "message", ... }
  // Updates only the error labels, so what the user typed is not lost.
  renderErrors(errors) {
    this.clearErrors();
    Object.entries(errors).forEach(([field, message]) => {
      const slot = this._parentElement.querySelector(`[data-error-for="${field}"]`);
      if (slot) slot.textContent = message;
    });
    const [firstField] = Object.keys(errors);
    this._parentElement.querySelector(`[name="${firstField}"]`)?.focus();
  }

  // Brings the form into view and focuses the first field (used when editing).
  focusForm() {
    this._parentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this._parentElement.querySelector("#description")?.focus();
  }

  clearErrors() {
    this._parentElement
      .querySelectorAll(".field-error")
      .forEach((slot) => (slot.textContent = ""));
  }

  showStorageError() {
    const errorElement = this._parentElement.querySelector(".storage-error");

    if (!errorElement) return;

    errorElement.textContent = this._storageErrorMessage;
    errorElement.hidden = false;
  }
}

export default new TransactionFormView();
