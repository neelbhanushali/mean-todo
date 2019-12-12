const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserTokenSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User"
    },
    token: String,
    type: String,
    expires_at: Date,
    is_revoked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const UserTokenModel = mongoose.model(
  "UserToken",
  UserTokenSchema,
  "userTokens"
);

module.exports = { UserTokenSchema, UserTokenModel };
