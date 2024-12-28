const mongoose =require('mongoose');

const paymentSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: 'Dummy Payment',
    },
    paymentStatus: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'success',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Payment =mongoose.model('Payment',paymentSchema);
module.exports=Payment;