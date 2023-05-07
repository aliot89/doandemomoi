const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const info0Schema = new Schema({
  tokenData:String,
  latitude:Number,
  longitude:Number
});
const info0 = mongoose.model('info0', info0Schema);
module.exports = info0