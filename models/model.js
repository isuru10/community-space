const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    _id : String,
    name : String,
    brand : {type: mongoose.Schema.Types.ObjectId, ref: 'Brand'}
});

var model = mongoose.model('Model', modelSchema);
module.exports = model;