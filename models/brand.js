const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');

const brandSchema = new Schema({
    _id : String,
    name : String
});

var brand = mongoose.model('Brand', brandSchema);
module.exports = brand;