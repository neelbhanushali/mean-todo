const userModel = reqlib("app/models/userModel").userModel;
module.exports = {
  login(req, res) {
    res.send("login");
  },
  async register(req, res) {
    const user = new userModel({
      first_name: "Neel",
      last_name: "Bhanushali",
      dob: new Date("1996-01-17"),
      email: "neal.bhanushali@gmail.com",
      password: "secret"
    });

    await user.save();

    res.send(user);
  }
};
