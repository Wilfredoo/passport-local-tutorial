const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/User");

// routes
// router.get("/dashboard", (req, res) => res.render("dashboard"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: 'passwords don"t match' });
  }

  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // validation passes
    // first we check if user exists or not
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({ name, email, password });
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hash
            newUser.password = hash;

            // save user
            newUser.save().then(user => {
              req.flash("success_msg", "You are now registered buddy");
              res.redirect("/users/login");
            });
          })
        );
      }
    });
  }
});

// login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
