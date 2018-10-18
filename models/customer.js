const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    _id:String,
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    no:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    tele:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

var customer = mongoose.model('Customer',customerSchema);
module.exports = customer;