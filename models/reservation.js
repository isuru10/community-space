const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    _id : String,
    resTime : {
        type : Date,
        default : Date.now
    },
    endTime : {
        type : Date,
        required : true
    },
    reservationType : mongoose.Schema.Types.ObjectId, ref: 'ReservationType',
    slot : mongoose.Schema.Types.ObjectId, ref: 'Slot'
});

var reservation =  mongoose.model('Reservation', reservationSchema);
module.exports = reservation;

