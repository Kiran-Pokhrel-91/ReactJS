import { useState } from "react";

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value
    setTask(value)
  }

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, task]);
    setTask("");
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((todo, index) => (
          <li key={index}>
            {todo}
            <button
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
