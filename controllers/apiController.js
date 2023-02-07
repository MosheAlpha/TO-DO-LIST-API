const mongoose = require('mongoose')
const Task = require('../models/taskModel')
const User = require('../models/userModel')


const tasksArr = [
    {
        userId: 'user1',
        taskName: 'Grocery Shopping',
        description: 'Buy groceries for the week',
        dueDate: new Date('2023-02-10'),
        priority: 3,
        labels: ['Personal', 'Shopping']
    },
    {
        userId: 'user1',
        taskName: 'Submit Report',
        description: 'Submit the weekly report to the boss',
        dueDate: new Date('2023-02-08'),
        priority: 5,
        labels: ['Work']
    },
    {
        userId: 'user2',
        taskName: 'Visit the doctor',
        description: 'Visit the doctor for a check-up',
        dueDate: new Date('2023-02-06'),
        priority: 4,
        labels: ['Personal', 'Health']
    }
];

exports.main = function (req, res) {
    const task = new Task(tasksArr[2]);
    task.save().then((result) => res.send(result))
        .catch((error) => {
            console.log(error) 
            res.send(error)
        })
}

exports.getAllTasks = function (req, res) {
    Task.find({userId: req.user._id}, (error, tasks) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve tasks' });
        }

        return res.send(tasks);
    });
}

exports.getTask = function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid task ID' });
    }

    Task.findOne({_id: id, userId: req.user._id}, (error, task) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve task' });
        }

        if (!task) return res.status(404).send({ error: 'Task not found' });
        return res.send(task);
    });
}

exports.newTask = function (req, res) {
    if(!req.user || !req.user._id){
        return res.status(400).json({
            message: "User data not found"
        });
    }
    req.body.labels
    const newTask = new Task({
        userId: req.user._id,
        taskName: req.body.taskName,
        description: req.body.description,
        dueDate: new Date(req.body.dueDate),
        priority: req.body.priority,
        labels: req.body.labels
    });

    newTask.save((error, savedTask) => {
        if (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = [];
                for (const field in error.errors) {
                    validationErrors.push(error.errors[field].message);
                }
                return res.status(400).json({
                    error: validationErrors
                });
            } else {
                return res.status(500).json({
                    error: error.message
                });
            }
        } else {
            return res.status(201).json({
                message: 'Task created successfully',
                task: savedTask
            });
        }
    });
}

exports.updateTask = function (req, res) {
    const { id } = req.params;
    const updates = req.body;

    // Check that the task updates are valid
    if (!updates || typeof updates !== 'object') {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    // Check if the task ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid task ID' });
    }

    Task.findByIdAndUpdate(id, updates, { new: true }, (error, task) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to update task' });
        }

        if (!task) return res.status(404).send({ error: 'Task not found' });
        return res.send(task);
    });
}

//delete task by id
// exports.sign_in = function (req, res) {
//     const { id } = req.params;

//     // Check if the task ID is valid
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).send({ error: 'Invalid task ID' });
//     }

//     Task.findByIdAndRemove(id, (error, task) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).send({ error: 'Failed to delete task' });
//         }

//         if (!task) return res.status(404).send({ error: 'Task not found' });
//         return res.send({ message: 'Task deleted' });
//     });
// }

//delete all tasks for specific user
exports.deleteTasks = function (req, res) {
    Task.remove({}, (error) => {
        if (error) {
            return res.status(500).json({ message: "Error deleting tasks" });
        }
        return res.status(200).json({ message: "All tasks deleted successfully" });
    });
}