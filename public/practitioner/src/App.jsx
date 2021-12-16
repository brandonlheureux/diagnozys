import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    fetch("/api/v1/helloWorld")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Practitioner dashboard</p>
          <a href={process.env.REACT_APP_MAIN_DOMAIN}>go to main landing </a>
        </header>
      </BrowserRouter>
    </div>
  );
}

export default App;
