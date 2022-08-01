//mongo
var currentUsers = [];
const { MongoClient, ServerApiVersion } = require("mongodb");
async function main() {
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });
  await client.connect();
  currentUsers = await client
    .db("testTIQ")
    .collection("BetaCollection")
    .find()
    .toArray();
  client.close();
}
main().catch(console.error);

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
  res.sendFile("index.html", { root: "views" });
});

// app.listen(3000);
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("App is running on port " + port);
});

//login
app.post("/", function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  let role = "";
  var success = false;

  for (const item of currentUsers) {
    for (var i = 0; i < currentUsers.length; i++) {
      if (
        currentUsers[i].username == user &&
        currentUsers[i].password == pass
      ) {
        success = true;
        role = currentUsers[i].role;
        break;
      } else if (i == currentUsers.length - 1 && success != true) {
        success = false;
      }
    }
    if (success == true) {
      Session["username"] = user;

      Session["role"] = role;
      if (role == "BOA") {
        res.sendFile("BOA-Home.html", { root: "views" });
        break;
      }
      if (role == "HL") {
        res.sendFile("HL-Home.html", { root: "views" });
        break;
      }
      if (role == "FS") {
        res.sendFile("FS-Home.html", { root: "views" });
        break;
      }
      if (role == "admin") {
        //to add the page
        // res.sendFile("admin.html", { root: "views" });
        // break;
      } else {
        alert("err");
      }
    } else {
      alert("Wrong username or password");
      res.sendFile("index.html", { root: "views" });
      break;
    }
  }
});
app.get("/change-password.html", function (req, res) {
  res.sendFile("change-password.html", { root: "views" });
});
