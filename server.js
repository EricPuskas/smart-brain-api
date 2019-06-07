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
const morgan = require("morgan");
const auth = require("./controllers/auth");
const compression = require("compression");
let db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

if (process.env.NODE_ENV == "development") {
  db = knex({
    client: process.env.DB_CLIENT,
    connection: process.env.DATABASE_URL
  });
}

app.use(compression());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SMART-BRAIN API");
});

app.post("/signin", signin.handleAuth(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", auth.requireAuth, profile.getUserProfile(db));
app.put("/profile/:id", auth.requireAuth, profile.handleProfileUpdate(db));
app.put("/image", auth.requireAuth, image.handleImage(db));
app.post("/imageurl", auth.requireAuth, image.handleApiCall);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
