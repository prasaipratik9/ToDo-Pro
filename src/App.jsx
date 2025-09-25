import { useState,  useEffect } from "react";
import "./App.css";



// Define a storage key
const STORAGE_KEY = "todo-pro";
function App() {
  
  const [todos, setTodos] = useState(() => {
    try{
      const stored= localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  useEffect(() =>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos])

  function deleteTodo(id) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
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
        <ul>
          {todos.length === 0 ? (
            <li>No tasks yet</li>
          ) : (
            todos.map((todo, index) => (
              <li key={todo.id}>
                
                <input 
                type="checkbox"
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                />
                <label htmlFor={`todo-${todo.id}`}>
                  {todo.text}
                </label>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                {/* <button onClick={() => toggleTodo(todo.id)}>Done</button> */}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
