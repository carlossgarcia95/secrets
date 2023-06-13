require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  })
  await user.save();
  res.render("secrets");  
})

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne( {email: username})
        if (user.password === password) {
            res.render("secrets");
        } else {
            console.log(error);
            res.status(403).send("Wrong password. Please try again,");
        }
    } catch (error) {
        console.log(error);
        res.status(403).send("Email does not exist. Please register.");
      }
});







app.listen(3000, (req, res) => {
    console.log("Server started on port 3000.")
})
