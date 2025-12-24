import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const incCount = () => setCount(count + 1);
  const decCount = () => setCount(count > 0 ? count - 1 : 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "+") incCount();
      if (e.key === "-") decCount();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count]);

  
  return (
    <div>
      <button onClick={incCount}>+</button>
      <h1>{count}</h1>
      <button onClick={decCount}>-</button>
    </div>
  );
}

export default Counter;
