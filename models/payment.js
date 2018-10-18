const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

const paymentSchema = new Schema({
    _id : String,
    time : {
        type : Date,
        default : Date.now
    },
    amount : mongoose.Schema.Types.Double,
    paymentType : String,
    reservation : mongoose.Schema.Types.ObjectId, ref: 'Reservation'
});

var payment = mongoose.model('Payment', paymentSchema);
module.exports = payment;