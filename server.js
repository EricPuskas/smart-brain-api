require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: process.env.DB_CLIENT,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SMART-BRAIN API");
});

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.getUserProfile(db));

app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleApiCall);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
