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
    .collection("boardMembers")
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
app.set("view engine", "ejs");
// app.set("view engine", "html");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.listen(3000);
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("App is running on port " + port);
});

//post
//login
app.post("/", function (req, res) {
  console.log("log");
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
      res.render("index");
      break;
    }
  }
});
//add board members
app.post("/boardReg", async function (req, res) {
  var user = req.body.boardName;
  var pass = req.body.boardPassword;
  var role = req.body.boardRole;

  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });

  await client.connect();

  currentUsers = await client
    .db("testTIQ")
    .collection("boardMembers")
    .find()
    .toArray();
  //check username not already registered
  var exists = false;
  for (const item of currentUsers) {
    for (const propertyName in item) {
      if (item[propertyName] === user) {
        exists = true;
      }
    }
    if (exists || user === "" || pass === "") {
      alert("registeration error");
      break;
    }
  }
  // adding user
  if (!exists) {
    var member = { username: user, password: pass, role: role };
    await client.db("testTIQ").collection("boardMembers").insertOne(member);
    currentUsers.push(member);
    alert("registeration complete");
    res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
  }
});
//add function mates
app.post("/FunctionReg", async function (req, res) {
  var user = req.body.functionMateName;
  var house = req.body.functionMateHouse;
  var func = req.body.FunctionRole;

  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });

  await client.connect();

  currentFuncMates = await client
    .db("testTIQ")
    .collection("mates")
    .find()
    .toArray();
  //check username not already registered
  var exists = false;
  for (const item of currentFuncMates) {
    for (const propertyName in item) {
      if (item[propertyName] === user) {
        exists = true;
      }
    }
    if (exists) {
      alert("registeration error");
      break;
    }
  }
  // adding user
  if (!exists) {
    var mate = { username: user, function: func, house: house };
    await client.db("testTIQ").collection("mates").insertOne(mate);
    alert("registeration complete");
    res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
  }
});
//add debater mates
app.post("/debaterReg", async function (req, res) {
  var user = req.body.debaterName;
  var house = req.body.DebaterHouse;
  var func = req.body.FunctionRole;

  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });

  await client.connect();

  currentFuncMates = await client
    .db("testTIQ")
    .collection("mates")
    .find()
    .toArray();
  //check username not already registered
  var exists = false;
  for (const item of currentFuncMates) {
    for (const propertyName in item) {
      if (item[propertyName] === user) {
        exists = true;
      }
    }
    if (exists) {
      alert("registeration error");
      break;
    }
  }
  // adding user
  if (!exists) {
    var mate = { username: user, function: "Debater", house: house };
    await client.db("testTIQ").collection("mates").insertOne(mate);
    alert("registeration complete");
    res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
  }
});
//remove member
let selectedRoleMembers = [];
let removeRole = "";
app.post("/removeSelectRole", async function (req, res) {
  //update names
  var role = req.body.removeRole;
  removeRole = role;
  if (role === "Board") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("boardMembers")
      .find()
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "CL") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "CL" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "ER") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "ER" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "MC") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "MC" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "MD") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "MD" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "Orion Debater") {
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "Debater", house: "Orion" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
  if (role === "Pegasus Debater") {
    console.log("enters cl");
    const { MongoClient, ServerApiVersion } = require("mongodb");
    var url =
      "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

    var client = new MongoClient(url, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });

    await client.connect();

    selectedRoleMembers = await client
      .db("testTIQ")
      .collection("mates")
      .find({ function: "Debater", house: "Pegasus" })
      .toArray();
    res.render("BOA-Manage-Profiles", {
      content: selectedRoleMembers,
      selectedRole: role,
    });
  }
});
app.post("/removeSelectName", async function (req, res) {
  var user = req.body.removeName;
  if (removeRole === "Orion Debater" || removeRole === "Pegasus Debater") {
    removeRole = "Debater";
  }
  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });
  if (removeRole === "Board") {
    await client
      .db("testTIQ")
      .collection("boardMembers")
      .deleteOne({ username: user });
    alert("deletion complete");
    res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
  } else {
    await client
      .db("testTIQ")
      .collection("mates")
      .deleteOne({ username: user, function: removeRole });
    alert("deletion complete");
    res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
  }
});
//change password
app.post("/changePassword", async function (req, res) {
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;
  let newPassRep = req.body.newPassRep;

  if (newPass != newPassRep) {
    alert("New Password Not Matching!");
    res.sendFile("change-password.html", { root: "views" });
  }

  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });
  var output = [];
  await client.connect();
  let trueOldPass = await client
    .db("testTIQ")
    .collection("boardMembers")
    .find({ username: Session["username"] })
    .forEach(function (document) {
      output.push(document.password);
    });

  trueOldPass = "" + output[0];
  if (oldPass != trueOldPass) {
    alert("Wrong Old Password");
    return;
  }
  await client
    .db("testTIQ")
    .collection("boardMembers")
    .updateOne(
      { username: Session["username"] },
      { $set: { password: newPass } }
    );

  alert("Password Changed Successfully");
  for (const item of currentUsers) {
    for (var i = 0; i < currentUsers.length; i++) {
      if (currentUsers[i].username === Session["username"]) {
        currentUsers[i].password = newPass;
        break;
      } else if (i == currentUsers.length - 1 && success != true) {
        success = false;
      }
    }
  }
  console.log(currentUsers);
});
//get pages
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/change-password.html", function (req, res) {
  res.sendFile("change-password.html", { root: "views" });
});
app.get("/BOA-Manage-Profiles", function (req, res) {
  res.render("BOA-Manage-Profiles", { content: [], selectedRole: "" });
});
