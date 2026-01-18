import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(()=>{
    const initialCount = 0;
    return initialCount;
  });

  const incCount = () => setCount((prevCount) => prevCount + 1);
  const decCount = () => setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  
  return (
    <div>
      <button onClick={incCount}>+</button>
      <h1>{count}</h1>
      <button onClick={decCount}>-</button>
    </div>
  );
}

export default Counter;
