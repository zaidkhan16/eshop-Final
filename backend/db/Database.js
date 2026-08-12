const mongoose = require("mongoose");

let isConnected = 0;

const connectDatabase = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = 1;
    return;
  }
  const dbUrl =
    process.env.DB_URL ||
    "mongodb+srv://pathanzaidkhan99_db_user:3TqkbrhJ7BsiaCEQ@cluster0.llsfljj.mongodb.net/";

  try {
    const db = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDatabase;

