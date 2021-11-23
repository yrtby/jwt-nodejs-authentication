const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfirmationSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    expiredAt:{
        type: Date,
        default: Date.now() + 10*60*1000 // 10 minute
    },
    confirmedAt:{
        type: Date,
        default: null
    }
});

const Confirmation = mongoose.model('Confirmation',ConfirmationSchema);
module.exports = Confirmation;