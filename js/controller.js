// CONTROLLER: the only file that talks to both the Model and the Views.
// It contains no HTML and no direct DOM or LocalStorage access.

import * as model from "./model.js";
import summaryView from "./views/SummaryView.js";
import transactionFormView from "./views/TransactionFormView.js";
import transactionListView from "./views/TransactionListView.js";

/* ---------- Rendering: read from the Model, hand data to a View ---------- */

const renderSummary = () => summaryView.render(model.getTotals());

const renderList = () => transactionListView.render(model.getTransactions());

const renderForm = () =>
  transactionFormView.render({
    categories: model.CATEGORIES,
    // null => the form shows "Add" mode; a transaction => "Edit" mode
    transaction: model.getEditingTransaction(),
  });

const renderAll = () => {
  renderSummary();
  renderList();
  renderForm();
};

/* ---------- Handlers: called by the Views when the user does something ---------- */

const controlSubmit = (formData) => {
  const { id, ...input } = formData; // hidden id ignored: the Model's editingId is trusted

  // 1. Ask the Model whether the data is valid
  const errors = model.validateTransaction(input);
  if (Object.keys(errors).length > 0) {
    transactionFormView.renderErrors(errors); // 2a. invalid: View shows messages
    return;
  }

  // 2b. valid: Model changes state and saves to LocalStorage
  if (model.isEditing()) {
    const editingTransaction = model.getEditingTransaction();
    if (editingTransaction) {
      model.updateTransaction(editingTransaction.id, input);
    }
  } else {
    model.addTransaction(input);
  }
  model.stopEditing();

  // 3. Re-render everything from the updated Model
  renderAll();
};

const controlEdit = (id) => {
  if (!model.startEditing(id)) return;
  renderForm();
  transactionFormView.focusForm();
};

const controlCancelEdit = () => {
  model.stopEditing();
  renderForm();
};

const controlDelete = (id) => {
  model.deleteTransaction(id); // the View already asked the user to confirm
  renderAll();
};

/* ---------- Initialisation ---------- */

const init = () => {
  model.loadState();
  renderAll();

  // Subscribe to the Views' publisher methods
  transactionFormView.addHandlerSubmit(controlSubmit);
  transactionFormView.addHandlerCancel(controlCancelEdit);
  transactionListView.addHandlerEdit(controlEdit);
  transactionListView.addHandlerDelete(controlDelete);
};

init();
