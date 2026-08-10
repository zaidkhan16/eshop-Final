const mongoose = require("mongoose");

const connectDatabase = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const dbUrl = process.env.DB_URL || "mongodb+srv://pathanzaidkhan99_db_user:3TqkbrhJ7BsiaCEQ@cluster0.llsfljj.mongodb.net/";
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;

