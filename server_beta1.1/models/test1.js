const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const test1Schema = new Schema({
    Percentsals1: String,
    flashws1: String,
    dubaos1: String,
    times1: String,
    diachis1: String,
    hours1: String,
    fullday: String,
    longitude: Number,
    latidude: Number
});
const test1 = mongoose.model('test1', test1Schema);
module.exports = test1