const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        default: "Low"
    },
    labels: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
