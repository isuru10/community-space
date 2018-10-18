const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotSchema = new Schema({
    staus : {
        type : Number,
        required : true
    },
    slotType : {
        type : String,
        required : true
    },
    parkingLot : {
        type : mongoose.Schema.Types.ObjectId, ref: 'ParkingLot'
    }

});

var slots = mongoose.model('Slot', slotSchema);
module.exports = slots;