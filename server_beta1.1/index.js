const PORT = 8000;
const http = require('http')
const express = require('express');
const app = express();
const cors = require('cors')
const Expo = require('expo-server-sdk').Expo;

const expo = new Expo();




const mongoose = require('mongoose')
app.use(cors({
    origin: 'http://13.212.210.52:8000'
}));

const Schema = mongoose.Schema;
app.listen(PORT);
var path = require('path')

const URL = 'mongodb+srv://dbsensor:R09MVQI2Tyao4qrd@dbsensor1.4efbswz.mongodb.net/?retryWrites=true&w=majority';
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  createIndexes: true // Add this option
};
const connectDB = async() => {
  try {
      await mongoose.connect(
          URL, { useNewUrlParser: true, useUnifiedTopology: true }
      )
      console.log('Connected to mongoDB')
  } catch (error) {
      console.log(error)
      process.exit(1)
  }
}

connectDB()
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const routess = require('./routes/app')
app.use('/', routess)

var ip = require('ip');

console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)
