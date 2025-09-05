const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB is connected to ${conn.connection.host}`);
  } catch (err) {
    console.log("error connection to mongoDB  : ", err.message);
    process.exit(1); //failure, 1: exit with failure, 0: status code is success
  }
};

module.exports = connectDb;
