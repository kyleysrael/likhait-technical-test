# Codebase Critique & Future Architectural Roadmap

This document outlines a professional critique of the current codebase and proposed architectural improvements for a production-ready application.

---

## 1. Security & Data Integrity Improvements

### A. Missing Model Constraints (Backend Validation)
* **Critique:** While the React frontend validates inputs (e.g. preventing negative amounts or blank descriptions in the form), the backend Rails `Expense` model does not validate these fields. If a user bypasses the UI and requests the API directly (via `curl` or Postman), negative amounts or empty descriptions are allowed and saved into the database.
* **Proof Example:** 
  Executing this request directly to the API endpoint:
  ```powershell
  Invoke-RestMethod -Uri http://localhost:3000/api/expenses -Method Post -ContentType 'application/json' -Body '{"expense": {"description": "Bypassed negative amount", "amount": -50.00, "category_id": 11, "date": "2026-07-16"}}'
  ```
  Returns a `201 Created` status with the negative amount successfully saved in the database:
  ```json
  {
    "id": 4212,
    "description": "Bypassed negative amount",
    "amount": -50.0,
    "category": "Food",
    "date": "2026-07-16"
  }
  ```
* **Solution:** Add robust Rails ActiveRecord validations to enforce data integrity at the API layer:
  ```ruby
  validates :description, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  ```

### B. Category Deletion Cascading Risk
* **Critique:** The `Category` model is defined as `has_many :expenses, dependent: :destroy`. Because `category_id` has a `NOT NULL` constraint in the database, deleting a category will permanently erase all associated historical transactions.
* **Solution:** 
  1. Implement a **prevent-deletion constraint** on categories that still contain expenses (using `before_destroy` filters).
  2. Or, introduce a **merge/re-assign category** workflow in the UI before deletion.

---

## 2. Performance & Scalability

### A. Frontend State Management & Caching
* **Critique:** The React client fetches categories and expenses independently across modals and pages. This causes redundant HTTP requests when closing/re-opening modals.
* **Solution:** Introduce **React Query (TanStack Query)** or **SWR** for automatic caching, background refetching, and query invalidation.

---

## 3. UX & Feature Enhancements

### A. Category Customization (Edit/Rename)
* **Critique:** Users can add categories but cannot edit or rename them.
* **Solution:** Build a dedicated Category Management settings pane in the sidebar to edit names and icons.

### B. Recurring Expenses
* **Critique:** The dashboard is built around tracking monthly expenses, but lacks automation for recurring entries (e.g. monthly rent, subscriptions).
* **Solution:** Add a `recurring_interval` field (weekly, monthly) and set up a background worker (e.g. Sidekiq + Cron) to auto-generate those expenses on the first of each month.
