let express = require("express");

let app = express();

app.get("/api/user", (req, res) => {
  console.log(req);
  res.json({ name: "刘小夕" });
});
console.log("4000");
app.listen(4000);
