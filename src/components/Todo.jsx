import { useState } from "react";

const Todo = () => {
  const today = new Date().toISOString().split("T")[0];
  const [task, setTask] = useState("");
  const [date, setDate] = useState(today);
  const [tasks, setTasks] = useState([]);

  const addTask = (e) => {
    e.preventDefault(); 
    if (task.trim() === "") return;
    const newTask = { task, date };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTask("");
    setDate(today);
  };

  const removeTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((todo, index) => (
          <li key={index}>
            <strong>{todo.task}</strong> — {todo.date}
            <button
              type="button"
              onClick={() => removeTask(index)}
              style={{ marginLeft: "1rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
