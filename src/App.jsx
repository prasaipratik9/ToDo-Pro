import { useState, useEffect } from "react";
import "./App.css";

// Define a storage key
const STORAGE_KEY = "todo-pro";

/**
 * Main Todo App component.
 */
/**
 * Main application component for the Todo Pro app.
 *
 * Manages the todo list state, including adding, editing, deleting, filtering,
 * toggling completion, and persisting tasks to localStorage.
 *
 * Features:
 * - Add, edit, and delete tasks
 * - Mark tasks as completed or active
 * - Filter tasks by all, active, or completed
 * - Clear all completed tasks
 * - Toggle all tasks as completed or active
 * - Persist tasks in localStorage
 *
 * @component
 * @returns {JSX.Element} The rendered Todo Pro application UI.
 */
function App() {
  // All useState hooks at the top
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // All functions below
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === "") return;
    const newToDo = { id: Date.now(), text: input.trim(), completed: false };
    setTodos([...todos, newToDo]);
    setInput("");
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function clearCompletedTasks() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit() {
    const next = editingText.trim();
    if (next === "") return;
    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, text: next } : t))
    );
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function toggleAll() {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allCompleted })));
  }

  // Derived values/constants
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const hasCompleted = todos.some((todo) => todo.completed);
  const remaining = todos.filter((todo) => !todo.completed).length;
  const allCompleted = todos.length > 0 && todos.every((t) => t.completed);

  // Small presentational helpers
  function FilterButton({ value, label }) {
    const active = filter === value;
    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className={
          active
            ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow"
            : "rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        }
        aria-pressed={active}
      >
        {label}
      </button>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h1>To Do List</h1>

          <div>
            <input
              type="text"
              value={input}
              placeholder="Add new task..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button onClick={handleSubmit} disabled={input.trim() === ""}>
              Add
            </button>
          </div>
        </div>

        <div>
          {todos.length > 0 && (
            <div>
              <span>
                {remaining === 0
                  ? "✨ All tasks completed!"
                  : `${remaining} ${
                      remaining === 1 ? "task" : "tasks"
                    } remaining`}
              </span>

              <div>
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("active")}>Active</button>
                <button onClick={() => setFilter("completed")}>
                  Completed
                </button>
                {hasCompleted && (
                  <button onClick={clearCompletedTasks}>Clear completed</button>
                )}
              </div>
            </div>
          )}

          <div>
            {todos.length === 0 ? (
              <div>
                <div>📝</div>
                <p>No tasks yet</p>
                <p>Add one above to get started!</p>
              </div>
            ) : (
              visibleTodos.map((todo) => (
                <div key={todo.id}>
                  <div>
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {editingId === todo.id ? (
                      <div>
                        <input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          disabled={editingText.trim() === ""}
                        >
                          Save
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <label htmlFor={`todo-${todo.id}`}>{todo.text}</label>
                    )}
                  </div>

                  {editingId !== todo.id && (
                    <div>
                      <button onClick={() => startEdit(todo)}>Edit</button>
                      <button onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
