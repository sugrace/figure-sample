import { useState, useEffect } from "react";
import Shape from "./components/Shape";
import WhiteBoard from "./components/WhiteBoard";
import SelectOptions from "./components/SelectOptions";
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SelectOptions />
      <WhiteBoard>
        <Shape />
      </WhiteBoard>
    </>
  );
}

export default App;
