const UserModel = reqlib("app/models/UserModel").UserModel;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  list(req, res) {
    res.json({ url: req.originalUrl });
  },
  async show(req, res) {
    const user = await UserModel.aggregate([
      {
        $match: { _id: ObjectId(req.params.userId) }
      },
      {
        $lookup: {
          from: "userTokens",
          localField: "_id",
          foreignField: "user",
          as: "tokens"
        }
      }
    ]);

    if (!user.length) {
      return res.status(404).send("not found");
    }

    res.json(user[0]);
  }
};
