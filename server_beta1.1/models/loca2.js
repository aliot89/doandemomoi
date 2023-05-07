const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const loca2Schema = new Schema({
    Percentsal1: String,
    flashw1: String,
    dubao1: String,
    time1: String,
    diachi1: String,
    hour2: String
});

const loca2 = mongoose.model('loca2', loca2Schema);

module.exports = loca2