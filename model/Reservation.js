const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    SocialNumber: {
        type: String,
        required: true
    },
    Subject: {
        type: String,
        required: true
    },
    AppId: {
        type: String,
        required: true
    },
    Channel: {
        type: String,
        required: true
    },
    PatientId: {
        type: Number,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Reservation', reservationSchema);