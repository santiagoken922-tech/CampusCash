// MODEL: owns all application data and the rules for changing it.
// It never touches the DOM, never imports a View, never builds HTML.

const STORAGE_KEY = "campuscash.transactions";
const TYPES = ["income", "expense"];

export const CATEGORIES = [
  "Allowance",
  "Food",
  "Transport",
  "School",
  "Bills",
  "Entertainment",
  "Other",
];

// The single source of truth for the whole app.
export const state = {
  transactions: [], // { id, description, amount, type, category, date }
  editingId: null, // id of the transaction being edited, or null
};

/* ---------- LocalStorage ---------- */

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
    return true;
  } catch (err) {
    console.error("CampusCash: could not save data", err);
    return false;
  }
};

export const loadState = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Keep only well-formed records so corrupted data cannot break the app.
    state.transactions = Array.isArray(stored)
      ? stored.filter(
          (t) => t && t.id && Object.keys(validateTransaction(t)).length === 0
        )
      : [];
  } catch (err) {
    console.error("CampusCash: could not load data", err);
    state.transactions = [];
  }
};

/* ---------- Validation ---------- */

// Returns an object of { field: message }. Empty object = valid.
export const validateTransaction = (input) => {
  const { description, amount, type, category, date } = input;
  const errors = {};

  if (!String(description ?? "").trim())
    errors.description = "Description cannot be empty.";

  const number = Number(amount);
  if (String(amount ?? "").trim() === "" || !Number.isFinite(number))
    errors.amount = "Enter a valid amount, e.g. 150.50.";
  else if (number <= 0) errors.amount = "Amount must be greater than zero.";

  if (!TYPES.includes(type)) errors.type = "Select Income or Expense.";

  if (!CATEGORIES.includes(category)) errors.category = "Select a category.";

  const parsed = new Date(`${date}T00:00:00`);
  const isRealDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date ?? "") &&
    !Number.isNaN(parsed.getTime()) &&
    parsed.toLocaleDateString("en-CA") === date; // rejects e.g. 2026-02-31
  if (!isRealDate) errors.date = "Enter a valid date.";

  return errors;
};

/* ---------- Helpers ---------- */

const generateId = () => {
  let id;
  do {
    id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  } while (state.transactions.some((t) => t.id === id));
  return id;
};

const buildTransaction = (id, input) => {
  const { description, amount, type, category, date } = input;
  return {
    id,
    description: description.trim(),
    amount: Math.round(Number(amount) * 100) / 100,
    type,
    category,
    date,
  };
};

/* ---------- Queries ---------- */

// Newest date first; for equal dates, most recently added first.
export const getTransactions = () =>
  [...state.transactions]
    .reverse()
    .sort((a, b) => b.date.localeCompare(a.date));

export const getTransaction = (id) =>
  state.transactions.find((t) => t.id === id);

export const getEditingTransaction = () =>
  getTransaction(state.editingId) ?? null;

// Sums in centavos so 0.1 + 0.2 style rounding errors never show up.
export const getTotals = () => {
  const sumOf = (type) =>
    state.transactions
      .filter((t) => t.type === type)
      .reduce((sum, { amount }) => sum + Math.round(amount * 100), 0) / 100;

  const income = sumOf("income");
  const expenses = sumOf("expense");
  return { income, expenses, balance: Math.round((income - expenses) * 100) / 100 };
};

/* ---------- Commands (each one saves to LocalStorage) ---------- */

export const addTransaction = (input) => {
  const transaction = buildTransaction(generateId(), input);
  state.transactions.push(transaction);
  saveState();
  return transaction;
};

export const updateTransaction = (id, input) => {
  state.transactions = state.transactions.map((t) =>
    t.id === id ? buildTransaction(id, input) : t
  );
  saveState();
};

export const deleteTransaction = (id) => {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  if (state.editingId === id) state.editingId = null;
  saveState();
};

export const startEditing = (id) => {
  state.editingId = getTransaction(id) ? id : null;
  return state.editingId;
};

export const stopEditing = () => {
  state.editingId = null;
};
export const isEditing = () => state.editingId !== null;
