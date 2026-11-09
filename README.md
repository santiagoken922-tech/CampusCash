# CampusCash – Student Allowance and Expense Tracker

A single-page web app that helps college students record their allowance and
expenses, see what is left, and understand where their money goes.
Built for **ITPFE 1 – Web Systems and Technologies 2 (Prelim Project)**.

## Features
- Dashboard: total income, total expenses, remaining balance (₱), and a "% of income spent" bar
- Add, view, edit, and delete transactions (delete asks for confirmation)
- Form validation with on-screen error messages (no browser alerts)
- Data saved in LocalStorage, so it survives refresh and reopening the page
- Income and expense are visually distinct; empty states; responsive layout

## Tech
HTML5, CSS3, vanilla JavaScript (ES6+ modules, classes, inheritance). No frameworks,
no libraries, no backend.

## Run locally
ES modules do not load from `file://`, so serve the folder:
- VS Code: right-click `index.html` → **Open with Live Server**, or
- Terminal: `python -m http.server 8000` then open http://localhost:8000

## Architecture (MVC with the Week 5 View framework)
```
CampusCash/
├── index.html
├── css/style.css
└── js/
    ├── model.js                   state, validation, CRUD, totals, LocalStorage
    ├── controller.js              connects Model and Views, initialises the app
    ├── helpers.js                 pure formatting helpers (peso, date, HTML escape)
    └── views/
        ├── View.js                base class: _data, _clear(), render(), renderError()
        ├── SummaryView.js         income / expenses / balance cards
        ├── TransactionFormView.js add/edit form + validation messages
        └── TransactionListView.js transaction history + edit/delete handlers
```
Flow: user action → View handler → Controller → Model update → LocalStorage save →
Controller render → View update.

Rules: the Model never touches the DOM; Views never import the Model; only the
Controller talks to both.

## Team

| Member | GitHub Username | Role | Main Responsibility |
|---|---|---|---|
| Kenneth M. Santiago | santiagoken922-tech | Project Lead / Main Developer | MVC architecture, core implementation, and integration |
| Aira S. Esarza | akirasolis18-glitch | UI / Frontend Developer | Interface improvements, CSS, and usability |
| Miqueas Vajay S. Malintad | miqueasvajaymalintad | Feature / Testing Developer | Transaction features, testing, and bug fixing |

## Live site
_Add the GitHub Pages URL here after you have deployed and opened it yourself._
