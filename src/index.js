const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { LogInCollection, PlaneCollection, RouteCollection, WaypointCollection } = require("./mongodb");

const app = express();
const upload = multer({ dest: "uploads/" });
const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "templates")));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "templates", "index.html");
  res.sendFile(filePath);
});

app.get("/signup", (req, res) => {
  const filePath = path.join(__dirname, "templates", "signup.html");
  res.sendFile(filePath);
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };

  const existingUser = await LogInCollection.findOne({ name: req.body.name });

  if (existingUser) {
    const filePath = path.join(__dirname, "templates", "nameExists.html");
    res.sendFile(filePath);
  } else {
    await LogInCollection.insertMany([data]);
    const filePath = path.join(__dirname, "templates", "home.html");
    res.sendFile(filePath);
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await LogInCollection.findOne({ name: req.body.name });

    if (check && check.password === req.body.password) {
      const filePath = path.join(__dirname, "templates", "home.html");
      res.sendFile(filePath);
    } else {
      const filePath = path.join(__dirname, "templates", "loginwrong.html");
      res.sendFile(filePath);
    }
  } catch (error) {
    const filePath = path.join(__dirname, "templates", "loginwrong.html");
    res.sendFile(filePath);
  }
});

app.post("/upload", upload.fields([
  { name: "planes", maxCount: 1 },
  { name: "routes", maxCount: 1 },
  { name: "waypoints", maxCount: 1 }
]), async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.send("No files uploaded.");
    return;
  }

  try {
    // Clear existing collections
    await PlaneCollection.deleteMany({});
    await RouteCollection.deleteMany({});
    await WaypointCollection.deleteMany({});

    const files = req.files;
    const filePromises = [];

    for (const key in files) {
      const file = files[key][0];
      const filePath = file.path;

      const results = [];
      const promise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve({ key, results }))
          .on("error", (error) => reject(error));
      });

      filePromises.push(promise);
    }

    const fileResults = await Promise.all(filePromises);

    for (const fileResult of fileResults) {
      const key = fileResult.key;
      const results = fileResult.results;

      switch (key) {
        case "planes":
          await PlaneCollection.insertMany(results);
          break;
        case "routes":
          await RouteCollection.insertMany(results);
          break;
        case "waypoints":
          await WaypointCollection.insertMany(results);
          break;
      }
    }

    // Delete the uploaded files
    for (const key in files) {
      const file = files[key][0];
      fs.unlinkSync(file.path);
    }

    res.send('<script>window.location.href = "/";</script>');
  } catch (error) {
    console.error(error);
    res.send('<script>window.location.href = "/";</script>');
  }
});


app.listen(3000, () => {
  console.log("Server connected on port 3000");
});
