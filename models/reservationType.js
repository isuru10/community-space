const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
const Reservation = require('./reservation');


const reservationTypeSchema = new Schema({
    _id : String,
    description : String,
    rate : mongoose.Schema.Types.Double,
    reservations : [Reservation]
});

var reservationType = mongoose.model('ReservationType', reservationTypeSchema);
module.exports = reservationType;