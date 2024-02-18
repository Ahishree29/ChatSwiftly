const mongoose = require("mongoose");

const connectDB = async () => {
  const dburl = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(dburl);
    console.log(`Mongoose Connected:${conn.connection.host}`.magenta.underline);
  } catch (error) {
    console.log(`Error:${error.message}`.red.bold);
    process.exit();
  }
};
module.exports = connectDB;
