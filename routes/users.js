const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ url: req.originalUrl });
});

router.get("/:userId", (req, res) => {
  res.json({ url: req.originalUrl, params: req.params });
});

module.exports = router;
