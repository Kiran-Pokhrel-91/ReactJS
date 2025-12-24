import { useState } from "react";

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

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
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            {t}
            <button
              onClick={() => removeTask(i)}
              style={{ marginLeft: "1rem" }}
            >
              {" "}
              x{" "}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
