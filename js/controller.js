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
  const { id, ...input } = formData;

  const errors = model.validateTransaction(input);
  if (Object.keys(errors).length > 0) {
    transactionFormView.renderErrors(errors);
    return;
  }

  let savedTransaction;

  if (model.isEditing()) {
    const editingTransaction = model.getEditingTransaction();

    if (!editingTransaction) return;

    savedTransaction = model.updateTransaction(editingTransaction.id, input);
  } else {
    savedTransaction = model.addTransaction(input);
  }

  if (!savedTransaction) {
    transactionFormView.showStorageError();
    return;
  }

  model.stopEditing();
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
  const deleted = model.deleteTransaction(id);

  if (!deleted) {
    transactionFormView.showStorageError();
    return;
  }

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
