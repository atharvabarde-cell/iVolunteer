const mongoose = require('mongoose');

const uri = "mongodb+srv://atharvabarde:SaishaB123*@cluster0.wtax0qq.mongodb.net/iVolunteer?retryWrites=true&w=majority&appName=Cluster0"; 

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;