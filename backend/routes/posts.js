const express = require('express');

// Its is package which allow us to extract the file data from the url
const multer = require('multer');

//include post data model
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image.jpg': 'jpg'
};

//configuration for multer
const storage = multer.diskStorage({
  // 'destination' key defines where we want to store the file.
  destination: (req, file ,cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if(isValid){
      error = null
    }
    // cb=> callback function  | callback(ERROR, 'path_name_to_store_file')
    cb(error, "backend/images",);
  },
  //'filename' key helps to change the stored file name
  filename:(req, file, cb) => {

    // 'originalname','minetype' if predefined file property
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    //callback(ERROR, updatedfilename)
    cb(null, name+'-'+Date.now()+'.'+ext);


  }
});

// to post the data into database.
router.post("", multer({storage}).single('image'), (req, res, next) => {
  const url= req.protocol+'://'+req.get('host');
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  // console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      post: {
        ...createdPost,// copy all content of `createdPost` to Post
        id:createdPost._id
      }
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

  //req.query use to fetch query string data form the url and it retruns the string data
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let postDocument;
  if(pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  // find() is an asynchronus method so we need put response inside the find method
  postQuery.then(document => {
    postDocument = document;
    return Post.count();
  })
  .then(count =>{
    res.status(200).json({
      message: "Data fetched Successfully",
      posts: postDocument,
      totalPosts: count
    });
  });

});

// delete the Post by id
router.delete("/:id",(req,res,next)=>{
  console.log(req.params.id);
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
router.put("/:id",multer({storage}).single('image'),(req, res, next) => {
  let imagePath = req.body.image;
  if(req.file){
    const url= req.protocol+'://'+req.get('host');
    imagePath = url + "/images/" + req.file.filename

  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Updated Successful!"});
  });
});


module.exports = router;
