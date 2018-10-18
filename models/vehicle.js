const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Model = require('./model');

const vehicleSchema = new Schema({
    _id : String,
    plateNo : String,
    model : {
        type: mongoose.Schema.Types.ObjectId, ref: 'Model'
    },
    customer : mongoose.Schema.Types.ObjectId, ref: 'Customer'
});

var vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = vehicle;