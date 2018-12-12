const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

// to post the data into database.
app.post("/api/posts",(req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      postId : createdPost._id
    });
  });
});

// route to fetch data
app.get('/api/posts',(req,res,next)=>{
  // const posts=[
  //   {
  //     id: "asdf2134",
  //     title: "First server side post",
  //     content: "First server side Content"
  //   },
  //   {
  //     id: "wqerq123",
  //     title: "Second server side post",
  //     content: "Second server side content!"
  //   }
  // ]

  // find() is an asynchronus method so we need put response inside the find method
  Post.find().then(document => {
    res.status(200).json({
      message: "Data fetched Successfully",
      posts: document
    });
  });

});

app.delete("/api/posts/:id",(req,res,next)=>{
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post Deleted!'});
  });

});

// adding add to module
module.exports = app;
