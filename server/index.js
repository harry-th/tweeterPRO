"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views",{extensions:['html']}));

// The in-memory database of tweets. It's a basic object with an array in it.
const databaseConnect = require('./db/connect.js');
const User = require('./model/user');
const Tweet = require('./model/tweet');

const asyncWrapper = require('./middleware/asyncWrapper');
let cookieSession = require('cookie-session');
require('dotenv').config();
let bcrypt = require('bcryptjs');
// const tweetsRoutes = require("./routes/tweets")();

// Mount the tweets routes at the "/tweets" path prefix:
// app.use("/tweets", ntweetsRoutes)();

app.use(cookieSession({
  name:'session',
  keys:['hello']
}));




app.get('/', asyncWrapper(async(req,res)=>{
  let userId = req.session.userId;
  if (!userId) res.redirect('login');
  if (userId) {
    let user = await User.findOne({_id: userId}).select({password: 0, _id: 0});
    res.render('index', user);
  }
}));
app.get('/login',(req,res)=>{
  res.render('login');
});
app.post('/login', asyncWrapper(async(req,res)=>{
  let {email, password} = req.body;
  let user = await User.findOne({email});
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/');
  } else {
    res.send('nope');
  }


}));
app.post('/logout', (req,res)=>{
  req.session = null;
  res.redirect('login');
});

app.post('/register', asyncWrapper(async(req,res)=>{
  let {username, email, password} = req.body;
  let userDB = await User.findOne({email});
  let emailDB = await User.findOne({username});
  if (userDB || emailDB) {
    res.send('that won\'t work');
  } else {
    password = bcrypt.hashSync(password, 10);
    let user = await User.create({username:username, email:email, password:password});
    req.session.userId = user._id;
    res.redirect('/');
  }
}));

app.get("/tweets", asyncWrapper(async(req, res) => {
  res.status(200).json(await Tweet.find({}));
}));
app.post("/tweets", asyncWrapper(async(req, res) => {
  let user = await User.findOne({_id: req.session.userId});
  // eslint-disable-next-line camelcase
  let twot = {...req.body,name:user.username,avatar:user.avatar,created_at:Date.now()};
  Tweet.create(twot);
  res.status(201).send();
}));

app.post('/profileImg', asyncWrapper(async(req,res)=>{
  let userId = req.session.userId;
  await User.findOneAndUpdate({_id: userId}, {avatar: req.body.img});
  res.status(200).send();
}));

const start = async() => {
  try {
    await databaseConnect(process.env.MONGO_URI);
    app.listen(8080, () => {
      console.log("Example app listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();