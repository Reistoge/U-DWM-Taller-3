import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import Registers from "./Pages/Registers";
import type { RootState } from "./store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/registers" element={<Registers />} />

        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
