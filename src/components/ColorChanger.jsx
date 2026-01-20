import { useState } from "react";

const ColorChanger = () => {
  const [activeColor, setActiveColor] = useState("Red");
  const color = ["Red","Yellow", "Blue", "Green"];

  const colorClasses = {
    Red: "bg-red-500 hover:bg-red-600",
    Yellow: "bg-yellow-500 hover:bg-yellow-600",
    Blue: "bg-blue-500 hover:bg-blue-600",
    Green: "bg-green-500 hover:bg-green-600",
  };

  const changeColor = (index) => {
    const active = color[index];
    setActiveColor(active);
  };

  return (
    <>
      <div className="flex justify-center">
        {color.map((value, index) => (
          <button
            className={`rounded-2xl border px-2 mx-2 mt-2 cursor-pointer transition ${colorClasses[value]} focus:ring-1`}
            key={index}
            onClick={() => changeColor(index)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <div
          className={`border-2 w-50 h-50 align-middle ${colorClasses[activeColor]} `}
        >
          {" "}
        </div>
      </div>
    </>
  );
};

export default ColorChanger;
