const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingLotSchema = new Schema({
    _id  : String,
    description : String,
    lotType : {
        type : String,
        required : true
    },
    no : {
        type: String,
        required: true
    },
    street : {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required : true
    } 
    
}, {
    timestamps: true,
    usePushEach:true
});

var parkingLots = mongoose.model('ParkingLot' ,parkingLotSchema);

module.exports = parkingLots;