import { useState } from "react";
import PopUp from "./PopUp";

const Todo = () => {
  const today = new Date().toISOString().split("T")[0];

  const [task, setTask] = useState("");
  const [date, setDate] = useState(today);
  const [tasks, setTasks] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [editDate, setEditDate] = useState(today);

  const triggerPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const newTask = { id: Date.now(), text: task, date };
    setTasks((prev) => [...prev, newTask]);
    setTask("");
    setDate(today);

    triggerPopup("Task added successfully ✔️");
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    triggerPopup("Task deleted ❌");
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTaskText(task.text);
    setEditDate(task.date);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editTaskText.trim()) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editId ? { ...t, text: editTaskText, date: editDate } : t
      )
    );
    setEditId(null);
    triggerPopup("Task updated successfully ✏️");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-2xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-5 text-center">
        My Todo List
      </h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="What’s your task?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-400 transition"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.map((todo) => (
          <li
            key={todo.id}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 transform hover:scale-[1.02] transition"
          >
            {editId === todo.id ? (
              <form
                onSubmit={saveEdit}
                className="flex flex-col sm:flex-row sm:items-center gap-2 w-full"
              >
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  autoFocus
                  className="flex-1 border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />

                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />

                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition shadow-md font-medium"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="mb-2 sm:mb-0">
                  <strong className="text-indigo-700 text-lg">{todo.text}</strong>{" "}
                  <span className="text-gray-400">— {todo.date}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-blue-500 hover:text-blue-700 font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTask(todo.id)}
                    className="text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Popup */}
      <PopUp showPopup={showPopup} popupMessage={popupMessage} />
    </div>
  );
};

export default Todo;
