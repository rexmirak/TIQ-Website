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
  if (Session["role"] === "BOA") {
    res.sendFile("BOA-Home.html", { root: "views" });
  }
  if (Session["role"] === "FS") {
    res.sendFile("FS-Home.html", { root: "views" });
  }
  if (Session["role"] === "HL") {
    res.sendFile("HL-Home.html", { root: "views" });
  }
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
app.get("/Add-A-DebateComp", function (req, res) {
  res.render("Add-A-DebateComp", { league: false, OC: false });
});
let selectedComp;
app.post("/add-debate-select-comp", function (req, res) {
  selectedComp = req.body.competetion;
  let OC, League;
  if (selectedComp === "OC") {
    OC = true;
    League = false;
  } else {
    OC = false;
    League = true;
  }
  res.render("add-a-debatecomp", { league: League, OC: OC });
});
let leagueStage, OCStage, selectedRoom, stage;
app.post("/add-a-debateroom", function (req, res) {
  if (selectedComp === "OC") {
    OCStage = req.body.stageOC;
    stage = OCStage;
  } else {
    leagueStage = req.body.stageLeague;
    stage = leagueStage;
  }
  selectedRoom = req.body.room;
  res.render("add-a-debateRoom");
});
let roomList, teamsList;
app.post("/confirm-Room", function (req, res) {
  // PM
  let pmName = req.body.pmName;
  let pmMatter = req.body.pmMatter;
  let pmManner = req.body.pmManner;
  let pmStruct = req.body.pmStruct;
  let pm = {
    name: pmName,
    matter: parseFloat(pmMatter),
    manner: parseFloat(pmManner),
    structure: parseFloat(pmStruct),
    total: parseFloat(pmMatter) + parseFloat(pmManner) + parseFloat(pmStruct),
  };
  // OL
  let olName = req.body.olName;
  let olMatter = req.body.olMatter;
  let olManner = req.body.olManner;
  let olStruct = req.body.olStruct;
  let ol = {
    name: olName,
    matter: parseFloat(olMatter),
    manner: parseFloat(olManner),
    structure: parseFloat(olStruct),
    total: parseFloat(olMatter) + parseFloat(olManner) + parseFloat(olStruct),
  };
  // DPM
  let dpmName = req.body.dpmName;
  let dpmMatter = req.body.dpmMatter;
  let dpmManner = req.body.dpmManner;
  let dpmStruct = req.body.dpmStruct;
  let dpm = {
    name: dpmName,
    matter: parseFloat(dpmMatter),
    manner: parseFloat(dpmManner),
    structure: parseFloat(dpmStruct),
    total:
      parseFloat(dpmMatter) + parseFloat(dpmManner) + parseFloat(dpmStruct),
  };
  // DOL
  let dolName = req.body.dolName;
  let dolMatter = req.body.dolMatter;
  let dolManner = req.body.dolManner;
  let dolStruct = req.body.dolStruct;
  let dol = {
    name: dolName,
    matter: parseFloat(dolMatter),
    manner: parseFloat(dolManner),
    structure: parseFloat(dolStruct),
    total:
      parseFloat(dolMatter) + parseFloat(dolManner) + parseFloat(dolStruct),
  };
  // MoG
  let MoGName = req.body.mogName;
  let MoGMatter = req.body.mogMatter;
  let MoGManner = req.body.mogManner;
  let MoGStruct = req.body.mogStruct;
  let mog = {
    name: MoGName,
    matter: parseFloat(MoGMatter),
    manner: parseFloat(MoGManner),
    structure: parseFloat(MoGStruct),
    total:
      parseFloat(MoGMatter) + parseFloat(MoGManner) + parseFloat(MoGStruct),
  };
  // MoO
  let MoOName = req.body.mooName;
  let MoOMatter = req.body.mooMatter;
  let MoOManner = req.body.mooManner;
  let MoOStruct = req.body.mooStruct;
  let moo = {
    name: MoOName,
    matter: parseFloat(MoOMatter),
    manner: parseFloat(MoOManner),
    structure: parseFloat(MoOStruct),
    total:
      parseFloat(MoOMatter) + parseFloat(MoOManner) + parseFloat(MoOStruct),
  };
  // GW
  let gwName = req.body.gwName;
  let gwMatter = req.body.gwMatter;
  let gwManner = req.body.gwManner;
  let gwStruct = req.body.gwStruct;
  let gw = {
    name: gwName,
    matter: parseFloat(gwMatter),
    manner: parseFloat(gwManner),
    structure: parseFloat(gwStruct),
    total: parseFloat(gwMatter) + parseFloat(gwManner) + parseFloat(gwStruct),
  };
  // OW
  let owName = req.body.owName;
  let owMatter = req.body.owMatter;
  let owManner = req.body.owManner;
  let owStruct = req.body.owStruct;
  let ow = {
    name: owName,
    matter: parseFloat(owMatter),
    manner: parseFloat(owManner),
    structure: parseFloat(owStruct),
    total: parseFloat(owMatter) + parseFloat(owManner) + parseFloat(owStruct),
  };
  // END GETTING ROOM SCORES
  roomList = [pm, ol, dpm, dol, mog, moo, gw, ow];
  let ogTotal =
    parseFloat(pmMatter) +
    parseFloat(pmManner) +
    parseFloat(pmStruct) +
    parseFloat(dpmMatter) +
    parseFloat(dpmManner) +
    parseFloat(dpmStruct);

  let ooTotal =
    parseFloat(olMatter) +
    parseFloat(olManner) +
    parseFloat(olStruct) +
    parseFloat(dolMatter) +
    parseFloat(dolManner) +
    parseFloat(dolStruct);

  let cgTotal =
    parseFloat(MoGMatter) +
    parseFloat(MoGManner) +
    parseFloat(MoGStruct) +
    parseFloat(gwMatter) +
    parseFloat(gwManner) +
    parseFloat(gwStruct);

  let coTotal =
    parseFloat(MoOMatter) +
    parseFloat(MoOManner) +
    parseFloat(MoOStruct) +
    parseFloat(owMatter) +
    parseFloat(owManner) +
    parseFloat(owStruct);
  let og = {
    team: "OG",
    first: pmName,
    second: dpmName,
    total: ogTotal,
  };
  let oo = {
    team: "OO",
    first: olName,
    second: dolName,
    total: ooTotal,
  };
  let cg = {
    team: "CG",
    first: MoGName,
    second: gwName,
    total: cgTotal,
  };
  let co = {
    team: "CO",
    first: MoOName,
    second: owName,
    total: coTotal,
  };
  teamsList = [og, oo, cg, co];

  for (var i = 0; i < teamsList.length; i++) {
    for (var j = 0; j < teamsList.length - i - 1; j++) {
      if (parseFloat(teamsList[j].total) > parseFloat(teamsList[j + 1].total)) {
        var temp = teamsList[j];
        teamsList[j] = teamsList[j + 1];
        teamsList[j + 1] = temp;
      }
    }
  }
  teamsList.reverse();
  res.render("confirm-Room", { roomList: roomList, rankList: teamsList });
});
app.post("/DBRoom", async function (req, res) {
  let debate = {
    competetion: selectedComp,
    stage: stage,
    room: parseFloat(selectedRoom),
    roomScores: {
      PM: roomList[0],
      OL: roomList[1],
      DPM: roomList[2],
      DOL: roomList[3],
      MoG: roomList[4],
      MoO: roomList[5],
      GW: roomList[6],
      OW: roomList[7],
    },
    teamScores: {
      frst: teamsList[0],
      scnd: teamsList[1],
      thrd: teamsList[2],
      frth: teamsList[3],
    },
  };
  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });
  await client.connect();
  await client.db("testTIQ").collection("debates").insertOne(debate);
  alert("registeration complete");
  if (Session["role"] == "BOA") {
    res.sendFile("BOA-Home.html", { root: "views" });
  } else if (Session["role"] == "HL") {
    res.sendFile("HL-Home.html", { root: "views" });
  } else if (Session["role"] == "FS") {
    res.sendFile("FS-Home.html", { root: "views" });
  } else if (Session["role"] == "admin") {
    //to add the page
    // res.sendFile("admin.html", { root: "views" });
    // break;
  }
});
app.get("/viewDebates", function (req, res) {
  res.render("viewDebates", { dbDebates: {}, competetion: "" });
});
app.post("/viewComp", async function (req, res) {
  let selectedViewComp = req.body.competetionView;
  const { MongoClient, ServerApiVersion } = require("mongodb");
  var url =
    "mongodb+srv://tiqboa:TIQ2022@tiqluster.zi4f1.mongodb.net/?retryWrites=true&w=majority";

  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  });
  await client.connect();
  let dbDebates = [];
  let dbDebateses = await client
    .db("testTIQ")
    .collection("debates")
    .find({ competetion: selectedViewComp })
    .forEach(function (document) {
      dbDebates.push(document);
    });
  let competetion =
    selectedViewComp === "OC" ? "Official Competetion" : "The League";
  res.render("viewDebates", { dbDebates: dbDebates, competetion: competetion });
  // console.log("kosomy");
});

//omy heya omak ya bro
