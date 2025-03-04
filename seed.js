const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({});
  await User.create([{ name: "Admin User", email: "admin@test.com", password: "admin123", role: "Admin" }]);
  console.log("Database Seeded");
  mongoose.disconnect();
});
