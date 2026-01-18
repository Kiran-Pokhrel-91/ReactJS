import { useState } from "react";
import PopUp from "./PopUp";

const Todo = () => {
  const today = new Date().toISOString().split("T")[0];

  const [task, setTask] = useState("");
  const [date, setDate] = useState(today);
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const tiggerPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 2000);
  }

  const addTask = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    const newTask = { task, date };
    setTasks((prevTasks) => [...prevTasks, newTask]);

    setTask("");
    setDate(today);

    tiggerPopup("Task added successfullt ✔️")
  };

  const removeTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, i) => i !== index)
    );

    tiggerPopup("Task Deleted Successfully ❌")
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

      <PopUp showPopup={showPopup} popupMessage={popupMessage}/>
    </div>
  );
};

export default Todo;
