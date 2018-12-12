const mongoose = require('mongoose');

// here we have defined the schema of the post model
const postSchema = mongoose.Schema({
  title: {type:String, require: true},
  content: {type: String, require: true}
});

// here we are declaring the model.
//  i:e mongoose.model("model_name","declared_schema")
// to use this module outside this the module we will export this module.
module.exports = mongoose.model('Post',postSchema);

