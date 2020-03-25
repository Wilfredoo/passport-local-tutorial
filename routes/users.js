const express = require("express");
const router = express.Router();

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

  console.log("eooo", req.body);
  res.send("hwlloi");
});

module.exports = router;
