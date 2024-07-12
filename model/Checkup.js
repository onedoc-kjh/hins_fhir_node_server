const mongoose = require('mongoose');
const { Schema } = mongoose;

const checkupSchema = new Schema({
    Patient: {
        type: Number,
        required: true
    },
    QuestionnaireResponse: {
        type: Array,
        required: false
    },
    Organization: {
        type: Array,
        required: false
    },
    Practitioner: {
        type: Array,
        required: false
    },
    Observation: {
        type: Array,
        required: false
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Checkup', checkupSchema);