"use strict";
const Tweet = require('../model/tweet.js');
const asyncWrapper = require('../middleware/asyncWrapper');

const express = require('express');
const User = require('../model/user.js');
const tweetsRoutes = express.Router();

module.exports = function() {

  tweetsRoutes.get("/", asyncWrapper(async(req, res) => {
    const tweets = await Tweet.find({});
    res.json(tweets);
  }));


  tweetsRoutes.post("/", asyncWrapper(async(req, res) => {
    let user = await User.findOne(req.session.userId);
    // eslint-disable-next-line camelcase
    let twot = {...req.body,name:user.username,avatar:user.avatar,created_at:Date.now()};
    Tweet.create(twot);
    res.status(201).send();
  }));

  return tweetsRoutes;
};
