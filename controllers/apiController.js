const mongoose = require('mongoose')
const Task = require('../models/taskModel')
const User = require('../models/userModel')
const Label = require('../models/labelModel')



exports.main = function (req, res) {
    Label.deleteMany({}, (error) => {
        if (error) {
            return res.status(500).send({ message: "Error deleting tasks" });
        }
    });
    let labels = [{ "name": "Personal", "color": "#00FF00" }, { "name": "Work", "color": "#0000FF" }, { "name": "Groceries", "color": "#FFA500" }, { "name": "Errands", "color": "#FF69B4" }, { "name": "Fitness", "color": "#800080" }, { "name": "Hobbies", "color": "#FFFF00" }, { "name": "Home", "color": "#008080" }, { "name": "Travel", "color": "#FF0000" }, { "name": "Finance", "color": "#00FF00" }, { "name": "Health", "color": "#0000FF" }]

    labels.forEach(element => {
        const label = new Label(element)
        label.save()
    });
    res.status(201).send("save all")

    //
    // const task = new Task(tasksArr[0]);
    // task.save().then((result) => res.send(result))
    //     .catch((error) => {
    //         console.log(error)
    //         return res.status(500).send({ error: 'Failed to retrieve tasks' });
    //     })
}

exports.getAllTasks = function (req, res) {
    Task.find({ userId: req.user._id }, (error, tasks) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve tasks' });
        }

        return res.status(200).send(tasks);
    });
}

exports.getTask = function (req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid task ID' });
    }

    Task.findOne({ _id: id, userId: req.user._id }, (error, task) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve task' });
        }

        if (!task) return res.status(404).send({ error: 'Task not found' });
        return res.status(200).send(task);
    });
}

exports.newTask = function (req, res) {
    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User data not found" });
    }

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
        return res.status(200).send(task);
    });
}

//delete task by id
exports.deleteTask = function (req, res) {
    const { id } = req.params;

    // Check if the task ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid task ID' });
    }

    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User data not found" });
    }

    Task.findOneAndRemove({ _id: id, userId: req.user._id }, (error, task) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to delete task' });
        }

        if (!task) return res.status(404).send({ error: 'Task not found' });
        return res.status(200).send({ message: 'Task deleted' });
    });
}

//delete all tasks for specific user
exports.deleteTasks = function (req, res) {
    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User data not found" });
    }

    Task.deleteMany({ userId: req.user._id }, (error) => {
        if (error) {
            return res.status(500).send({ message: "Error deleting tasks" });
        }
        return res.status(200).send({ message: "All tasks deleted successfully" });
    });
}