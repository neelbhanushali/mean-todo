module.exports = {
  list(req, res) {
    res.json({ url: req.originalUrl });
  },
  show(req, res) {
    res.json({ url: req.originalUrl, params: req.params });
  }
};
