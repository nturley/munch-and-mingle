import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Event from "./Event";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/event/:eventId" element={<Event/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
