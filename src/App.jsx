import { useState, useEffect } from "react";
import "./App.css";

// Define a storage key
const STORAGE_KEY = "todo-pro";
function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  //state hook for filter
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // Handles form submission to add a new todo
  function handleSubmit(e) {
    e.preventDefault();

    if (input.trim() === "") return;

    const newToDo = { id: Date.now(), text: input.trim(), completed: false };
    setTodos([...todos, newToDo]);
    setInput("");
  }

  // For toggling todo lists as completed or on progress
  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // A new const for managing active, completed, and all tasks
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  //A function with the logic to clear the completed tasks
  function clearCompletedTasks() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  //A const which facilitates in when the button should be enabled
  const hasCompleted = todos.some((todo) => todo.completed);

  //A const for calculating remaining tasks aka remaining todo's
  const remaining = todos.filter((todo) => !todo.completed).length;

  //Adding editing state
  const [editingId, setEditingId] = useState(null); //Here, editingId is used to link with the todo id, or simply it is used to catch a specific list id
  const [editingText, setEditingText] = useState(""); //Here, editingText is used to edit the todo id text, catched previously by editingId

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }
  function saveEdit() {
    const next = editingText.trim();
    if (next === "") return; // don't commit empty text

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
  const allCompleted = todos.length > 0 && todos.every((t) => t.completed);

  function toggleAll() {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allCompleted })));
  }

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
