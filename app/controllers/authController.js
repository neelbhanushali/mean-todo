module.exports = {
  login(req, res) {
    res.json({ url: req.originalUrl });
  },
  register(req, res) {
    res.json({ url: req.originalUrl });
  }
};
