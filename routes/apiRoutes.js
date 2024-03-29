const express = require('express')
const app = express.Router()

const apiHandlers = require('../controllers/apiController.js');

app.route('/').get(apiHandlers.main);
app.route('/tasks').get(apiHandlers.getAllTasks);
app.route('/tasks/:id').get(apiHandlers.getTask);
app.route('/tasks').post(apiHandlers.newTask);
app.route('/tasks').put(apiHandlers.updateTask);
app.route('/tasks/:id').delete(apiHandlers.deleteTask);
app.route('/deleteTasks').delete(apiHandlers.deleteTasks);

app.route('/labels').get(apiHandlers.getAllLabels)

module.exports = app;