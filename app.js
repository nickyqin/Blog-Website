//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");

const homeStartingContent = "This is Nicky's first blog website! All the data is stored on MongoDB";
const aboutContent = "I did not want to put placeholder text, but I did not know what else to put";
const contactContent = "To contact me, go to my other website";

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



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
