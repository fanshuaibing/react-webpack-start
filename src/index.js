import "./index.less";
import React from "react";
import ReactDom from "react-dom";

const App = () => {
  return (
    <div>
      <h1>App</h1>
    </div>
  );
};
ReactDom.render(<App />, document.getElementById("app"));
