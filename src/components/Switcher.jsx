import { useState } from "react";

const Switcher = () => {
  const [sw, setSw] = useState(false);

  const switcherStyle = {
    background: sw ? "#000000" : "#ffffff",
    color: sw ? "#ffffff" : "#000000"
  }

  return (
    <div>
      {sw ? <h3>Dark</h3> : <h3>Light</h3>}

      <input type="text" key={sw ? "Dark" : "Light"} placeholder={sw ? "Dark" : "Light"} />
      <button onClick={() => setSw((s) => !s) } style={switcherStyle} >Switch</button>
    </div>
  );
};

export default Switcher;
