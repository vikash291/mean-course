const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRouter = require('./routes/posts');

const app = express();

// creating mongoDB connection
mongoose.connect("mongodb+srv://max:g5hwukHlKfwhkoBF@cluster0-mhqnv.mongodb.net/node-angular?retryWrites=true")
.then(() => {
  console.log("Connected Successful");
})
.catch(() => {
  console.log("connection falied");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images",express.static(path.join("backend/images")));

// adding CROS so that the angular can access the node api
app.use((req, res, next)=> {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts",postRouter);

// adding add to module
module.exports = app;
