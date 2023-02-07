const express = require('express')
const app = express.Router()

const userHandlers = require('../controllers/userController.js');

app.route('/register')
    .post(userHandlers.register);
app.route('/signIn')
    .post(userHandlers.signIn);
app.route('/token')
    .post(userHandlers.token);
app.route('/profile')
    .post(userHandlers.authenticateToken, userHandlers.profile);

module.exports = app;