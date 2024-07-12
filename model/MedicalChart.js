const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicalChartSchema = new Schema({
    Patient: {
        type: Number,
        required: true
    },
    ExplanationOfBenefit: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model('MedicalChart', medicalChartSchema);