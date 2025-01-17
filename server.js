const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const authController = require("./controllers/auth.js");
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000"; // this a ternary option and what that is, is a faster version of writing an if statement but it is only used when working with simple logic. 
//     this would be the traditional way of doing it 
//   let port;
// if (process.env.PORT) {
//   port = process.env.PORT;
// } else {
//   port = 3000;
// }




mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

app.use("/auth", authController);

app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: req.session.user,
    });
});


app.get("/",  (req, res) => {
    res.render("auth/sign-up.ejs")
})

app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });
  

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
