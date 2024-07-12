const mongoose = require('mongoose');
const { Schema } = mongoose;

const administrationSchema = new Schema({
    Patient: {
        type: Number,
        required: true
    },
    MedicationDispense: {
        type: Array,
        required: false
    },
    Medication: {
        type: Array,
        required: false
    },
})

module.exports = mongoose.model('Administration', administrationSchema)