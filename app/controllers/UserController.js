const UserModel = reqlib("app/models/UserModel").UserModel;
const UserTokenModel = reqlib("app/models/UserTokenModel").UserTokenModel;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");

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
  },
  async activate(req, res) {
    const token = await UserTokenModel.findOne({
      user: req.params.userId,
      token: req.params.token,
      type: "activation_token",
      expires_at: { $gte: moment().toISOString() },
      is_revoked: false
    });

    if (!token) {
      return res.send("token either invalid or expired");
    }

    let user = await UserModel.findOneAndUpdate(
      {
        _id: token.user
      },
      {
        verified_at: moment().toISOString()
      }
    );

    res.send("user activated");

    token.is_revoked = true;
    await token.save();
  }
};
