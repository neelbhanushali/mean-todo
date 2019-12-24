const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TodoSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User"
    },
    body: String,
    description: {
      type: String,
      default: null
    },
    is_complete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const TodoModel = mongoose.model("Todo", TodoSchema);

module.exports = { TodoSchema, TodoModel };
