import Container from './components/Container'
import Footer from './components/Footer'
import './App.css';

import React from "react";
import ReactDOM from "react-dom";
import "vis-network/styles/vis-network.css";

const App = () => {
  return(
      <div id="root">
        <Container />
        <Footer />
      </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
