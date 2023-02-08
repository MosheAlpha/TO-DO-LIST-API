const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    colorName: {
        type: String,
        required: true
    },
    colorHex: {
        type: String,
        required: true
    },
    subLabels: {
        type: Object,
        required: true
    }
});

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;
