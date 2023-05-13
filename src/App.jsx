import Home from "./components/Home.jsx";
import Signin from "./components/Signin.jsx";
import { AppProvider } from "./context/AppConfig";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route
            index
            path="/"
            element={
              <div className="flex flex-col justify-center items-center my-14">
                <p className="font-mono font-extrabold text-4xl mb-16">
                  ECDSA Node Project
                </p>
                <Signin />
              </div>
            }
          />
          <Route
            path="/home"
            element={
              <div>
                <Home />
              </div>
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
