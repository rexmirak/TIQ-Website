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

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(3000);
