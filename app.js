//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://nyq62:1234@cluster0.pivnu.mongodb.net/blogDB?retryWrites=true&w=majority');
}

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// Drop all from the collection
// Post.deleteMany({}, (err, res) => {
//   if (err) console.log(err);
// })

app.get("/", (req, res) => {
  const postsArray = [];
  Post.find({}, (err, foundPosts) => {
    if (err) console.log(err);

    console.log(foundPosts);
    foundPosts.forEach(post => {
      const newPost = {
        newTitle: post.title,
        newPost: post.content,
        id: post._id
      };
      postsArray.push(newPost);
    });

    res.render("home", {
      homeStartingContent: homeStartingContent,
      postsArray: postsArray
    });
  });
})

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

//title with space is breaking

app.get("/posts/:id", (req, res) => {
  var id = req.params.id;

  Post.findOne({_id: id}, (err, foundPost) => {
    res.render("post", {title: foundPost.title, content: foundPost.content});
  });
})

app.post("/compose", (req, res) => {
  const posts = new Post ({
    title: _.capitalize(req.body.newTitle),
    content: req.body.newPost
  });
  posts.save((err, postSaved) => {
    if(!err) res.redirect("/");
  });

})


//bugs: more than 1 space in title
//solution: show the spaces in the title by forcing the spaces in HTML file
// or: remove the spaces before the data is pushed into the array



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
