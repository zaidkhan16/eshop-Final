const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const dbUrl = process.env.DB_URL || "mongodb+srv://pathanzaidkhan99_db_user:3TqkbrhJ7BsiaCEQ@cluster0.llsfljj.mongodb.net/";
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDatabase;

