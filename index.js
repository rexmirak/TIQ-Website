const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

let express = require("express");
let path = require("path");
let fs = require("fs");
const { Session } = require("inspector");
let app = express();
let alert = require("alert");
const session = require("express-session");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile("Login.html", { root: "views" });
});

// app.listen(3000);
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("App is running on port " + port);
});
