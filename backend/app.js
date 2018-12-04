const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'post added successfully'
  });
});

// route to fetch data
app.get('/api/posts',(req,res,next)=>{
  const posts=[
    {
      id: "asdf2134",
      title: "First server side post",
      content: "First server side Content"
    },
    {
      id: "wqerq123",
      title: "Second server side post",
      content: "Second server side content!"
    }
  ]
  res.status(200).json({
    message: "Data fetched Successfully",
    posts: posts
  });
});

// adding add to module
module.exports = app;
