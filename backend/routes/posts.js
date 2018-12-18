const express = require('express');

const Post = require('../models/post');

const router = express.Router();


// to post the data into database.
router.post("",(req, res, next) => {
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
router.get('',(req,res,next)=>{
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

// delete the Post by id
router.delete("/:id",(req,res,next)=>{
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post Deleted!'});
  });

});

// get the post data by id
router.get("/:id",(req,res,next)=> {
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({ message: "Post Not found"});
    }
  });
});

// upodate the single data
router.put("/:id",(req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Updated Successful!"});
  });
});


module.exports = router;
