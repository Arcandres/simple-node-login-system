const express = require('express'),
   User = require('../models/user'),
   authentication = require('./../middlewares/authentication'),
   app = express()

// Get all users
app.get('/user', authentication, (req, res) => {
   User
      .find({})
      .exec((err, users) => {
         if (err) {
            return res.json(err)
         }

         res.json(users)
      })
});

// Get user by username
app.get('/user/:username', authentication, (req, res) => {
   User
      .findOne({username: req.params.username})
      .exec((err, userDB) => {
         if (err || !userDB) {
            return res.json(err)
         }

         res.json({
            user: userDB
         })
      })
});

// Create New User
app.post('/user', authentication, async (req, res) => {
   const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
   });

   user.password = await user.hash(req.body.password)

   user.save((err, userDB) => {
      if (err) {
         return res.json(err)
      }

      // Showing user saved in DB
      res.json({
         user: userDB
      })
   })
});

// Update user
app.put('/user/:username', authentication, (req, res) => {
   User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, (err, userDB) => {
      if (err) {
         return res.json(err)
      }

      res.json({
         user: userDB
      })
   })
});

// Delete user
app.delete('/user/:username', authentication, (req, res) => {
   User.findOneAndDelete({username: req.params.username}, (err, userDB) => {
      if (err) {
         return res.json(err)
      }

      res.json(userDB)
   })
});

module.exports = app;