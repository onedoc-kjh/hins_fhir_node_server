const mongoose = require('mongoose');
const { Schema } = mongoose;

const TreatmentSchema = new Schema({
    Patient: {
        type: Number,
        required: true
    },
    Observation: {
        type: Array,
        required: false
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Treatment', TreatmentSchema);