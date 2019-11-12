const router = require("express").Router();

router.get("/login", (req, res) => {
  res.json({ url: req.originalUrl });
});

router.get("/register", (req, res) => {
  res.json({ url: req.originalUrl });
});

module.exports = router;
