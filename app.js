const cookieParser = require("cookie-parser");
const express = require("express");
const dbconnect = require("./dbconnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");
const postModel = require("./models/posts.model");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dbconnect();
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/register", async (req, res) => {
  const { name, email, age, password, username } = req.body;
  let user = await userModel.findOne({ email });
  let saved;
  if (user) {
    return res.status(500).json(`User already registered`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const registeruser = new userModel({
      username,
      name,
      email,
      age,
      password: hashedPassword,
    });
    saved = await registeruser.save();

    const token = await jwt.sign(
      { email: email, userid: saved._id },
      "Waleedrazaqjattal1"
    );
    res.cookie("token", token);
    res.redirect('/login')
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = await jwt.sign(
          { email: email, userid: user._id },
          "Waleedrazaqjattal1"
        );
        res.cookie("token", token);
        res.status(200).redirect("/profile");
      }
    } else {
      res.status(500).send("Something went wrong");
    }
  } catch (error) {
    console.log(`Error:${error}`);
  }
});
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});
app.get("/profile", loggedin, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("profile", { users: user });
});
app.post("/post", loggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const { content } = req.body;
  const post = new postModel({
    user: user._id,
    content,
  });
  const saved = await post.save();
  await user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});
app.get("/like/:id", loggedin, async (req, res) => {
  const { id } = req.params;
  const post = await postModel.findOne({ _id: id }).populate("user");
  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
});
app.get("/edit/:id", loggedin, async (req, res) => {
  const { id } = req.params;
  const post = await postModel.findOne({ _id: id }).populate("user");
  res.render('update', {post})
});
app.post("/update/:id", loggedin, async (req, res) => {
  const { id } = req.params;
  const post = await postModel.findByIdAndUpdate({ _id: id },{content:req.body.content})
  res.redirect('/profile')
});
function loggedin(req, res, next) {
  if (req.cookies.token === "") {
    res.redirect("/login");
  } else {
    let token = jwt.verify(req.cookies.token, "Waleedrazaqjattal1");
    req.user = token;
    next();
  }
}
app.listen(3000, (req, res) => {
  console.log(`Port is running on 3000`);
});
