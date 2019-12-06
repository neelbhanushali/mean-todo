const router = require("express").Router();

router.post("/login", (req, res) => {
  res.json({ url: req.originalUrl });
});

router.post("/register", (req, res) => {
  res.json({ url: req.originalUrl });
});

module.exports = router;
