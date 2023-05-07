const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const loca0Schema = new Schema({
    Percentsals: String,
    flashws: String,
    dubaos: String,
    times: String,
    diachis: String,
    hours: String,
    test: String,
});
const loca0 = mongoose.model('loca0', loca0Schema);
module.exports = loca0