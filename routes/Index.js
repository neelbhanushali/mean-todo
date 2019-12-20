const router = require("express").Router();

router.use("/api/v1", require("./Api/V1"));

module.exports = router;
