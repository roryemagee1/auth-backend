const mongoose = require('mongoose');
require('dotenv').config();
const mongoString = process.env.DB_URL;

const dbConnect = async () => {
  mongoose
    .connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then(() => {
      console.log("Successfully conencted to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas.");
      console.log(error);
    })
}

module.exports = dbConnect;