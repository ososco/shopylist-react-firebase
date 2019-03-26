import React from "react";
import ReactDOM from "react-dom";

import Header from "./components/header";
import Items from "./components/items";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Items />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
