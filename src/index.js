import "./index.less";
import axios from "axios";
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

console.log(React);

axios.get("/api/user").then((res) => {
  console.log(res);
});
