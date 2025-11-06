export const BudgetTracker = ({ budget, onUpdate }) => {
  const calculateTotalAllocated = () => {
    return budget.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  };

  const calculateTotalSpent = () => {
    return budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  };

  const updateCategory = (index, updates) => {
    const updatedCategories = [...budget.categories];
    updatedCategories[index] = { ...updatedCategories[index], ...updates };
    onUpdate({
      ...budget,
      categories: updatedCategories
    });
  };

  const addExpense = () => {
    const newExpense = {
      id: Math.max(...budget.expenses.map(e => e.id)) + 1,
      item: '',
      category: '',
      amount: 0,
      type: '',
      date: '',
      vendor: '',
      paid: false
    };
    onUpdate({
      ...budget,
      expenses: [...budget.expenses, newExpense]
    });
  };

  return (
    <div className="section budget-tracker">
      <h2>Budget Tracker</h2>
      <div className="budget-summary">
        <div className="total-budget">
          <h3>Total Budget</h3>
          <input
            type="number"
            value={budget.total}
            onChange={(e) => onUpdate({ ...budget, total: Number(e.target.value) })}
          />
        </div>
        <div className="budget-stats">
          <div>Allocated: ₹{calculateTotalAllocated().toLocaleString()}</div>
          <div>Spent: ₹{calculateTotalSpent().toLocaleString()}</div>
          <div>Remaining: ₹{(budget.total - calculateTotalSpent()).toLocaleString()}</div>
        </div>
      </div>

      <div className="categories-section">
        <h3>Budget Categories</h3>
        <div className="categories-grid">
          {budget.categories.map((category, index) => (
            <div key={index} className="category-card">
              <input
                value={category.name}
                onChange={(e) => updateCategory(index, { name: e.target.value })}
                placeholder="Category Name"
              />
              <input
                type="number"
                value={category.allocated}
                onChange={(e) => updateCategory(index, { allocated: Number(e.target.value) })}
                placeholder="Allocated Amount"
              />
              <input
                type="number"
                value={category.spent}
                onChange={(e) => updateCategory(index, { spent: Number(e.target.value) })}
                placeholder="Spent Amount"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="expenses-section">
        <h3>Expenses</h3>
        <button onClick={addExpense}>Add Expense</button>
        <div className="expenses-list">
          {budget.expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <input
                value={expense.item}
                onChange={(e) => {
                  const updatedExpenses = budget.expenses.map(exp =>
                    exp.id === expense.id ? { ...exp, item: e.target.value } : exp
                  );
                  onUpdate({ ...budget, expenses: updatedExpenses });
                }}
                placeholder="Expense Item"
              />
              <select
                value={expense.category}
                onChange={(e) => {
                  const updatedExpenses = budget.expenses.map(exp =>
                    exp.id === expense.id ? { ...exp, category: e.target.value } : exp
                  );
                  onUpdate({ ...budget, expenses: updatedExpenses });
                }}
              >
                {budget.categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => {
                  const updatedExpenses = budget.expenses.map(exp =>
                    exp.id === expense.id ? { ...exp, amount: Number(e.target.value) } : exp
                  );
                  onUpdate({ ...budget, expenses: updatedExpenses });
                }}
                placeholder="Amount"
              />
              <input
                type="date"
                value={expense.date}
                onChange={(e) => {
                  const updatedExpenses = budget.expenses.map(exp =>
                    exp.id === expense.id ? { ...exp, date: e.target.value } : exp
                  );
                  onUpdate({ ...budget, expenses: updatedExpenses });
                }}
              />
              <label>
                <input
                  type="checkbox"
                  checked={expense.paid}
                  onChange={(e) => {
                    const updatedExpenses = budget.expenses.map(exp =>
                      exp.id === expense.id ? { ...exp, paid: e.target.checked } : exp
                    );
                    onUpdate({ ...budget, expenses: updatedExpenses });
                  }}
                />
                Paid
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};