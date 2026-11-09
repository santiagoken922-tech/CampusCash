import View from "./View.js";
import { formatPeso } from "../helpers.js";

class SummaryView extends View {
  _parentElement = document.querySelector("#summary");
  _errorMessage = "No summary available yet.";

  // data = { income, expenses, balance } supplied by the Controller
  _generateMarkup() {
    const { income, expenses, balance } = this._data;

    // Presentation-only: how much of the income has been spent (0-100)
    const spentPercent =
      income > 0 ? Math.min(100, Math.round((expenses / income) * 100)) : 0;

    return `
      <article class="summary-card summary-card--income">
        <h3>Total Income</h3>
        <p class="summary-card__value">${formatPeso(income)}</p>
      </article>
      <article class="summary-card summary-card--expense">
        <h3>Total Expenses</h3>
        <p class="summary-card__value">${formatPeso(expenses)}</p>
      </article>
      <article class="summary-card summary-card--balance ${balance < 0 ? "negative" : ""}">
        <h3>Remaining Balance</h3>
        <p class="summary-card__value">${formatPeso(balance)}</p>
      </article>
      <div class="summary-bar">
        <label for="spent-progress">${spentPercent}% of your income spent</label>
        <progress id="spent-progress" max="100" value="${spentPercent}"></progress>
      </div>
    `;
  }
}

export default new SummaryView();
