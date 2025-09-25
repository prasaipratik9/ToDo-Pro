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

  // Return statement
  return (
    <div>
      <div>
        <h1>Todo Pro</h1>
        <label htmlFor="task">Add tasks:</label>
        <form onSubmit={handleSubmit}>
          <input
            id="task"
            type="text"
            aria-label="Add task"
            value={input}
            placeholder="Add your tasks..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={input.trim() === ""}>
            Add
          </button>
        </form>

        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          disabled={filter === "active"}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
        >
          Completed
        </button>

        {/* Rendering the completed button which clears tasks that are done */}
        <button onClick={clearCompletedTasks} disabled={!hasCompleted}>
          Clear completed
        </button>

        {/* Toggle all control goes here */}
        <label>
          <input
            type="checkbox"
            checked={allCompleted}
            onChange={toggleAll}
            aria-label="Toggle all tasks"
          />
          Mark all {allCompleted ? "active" : "completed"}
        </label>

        <ul>
          {visibleTodos.length === 0 ? (
            <li>No tasks yet</li>
          ) : (
            visibleTodos.map((todo) => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />

                {editingId === todo.id ? (
                  // EDIT MODE
                  <>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      aria-label="Edit task"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      disabled={editingText.trim() === ""}
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <label htmlFor={`todo-${todo.id}`}>{todo.text}</label>
                    <button onClick={() => startEdit(todo)}>Edit</button>
                  </>
                )}

                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>

        {/* Printing the final outcome, showing the number of tasks left, or basically the final outcome */}
        <p aria-live="polite">
          {remaining === 0
            ? "All done"
            : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
        </p>
      </div>
    </div>
  );
}

export default App;
