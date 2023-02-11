const Joi = require('joi');
require('dotenv').config()
const express = require('express');
const app = express();
const Task = require('./models/taskModel')
const User = require('./models/userModel')
const bodyParser = require('body-parser')
const jsonwebtoken = require("jsonwebtoken")
const cors = require("cors");

const mongoose = require('mongoose')
const db = process.env.DB_URL;
mongoose.set("strictQuery", false);
mongoose.connect(db).then((res) => console.log("Connected to DB...")).catch((error) => console.log(error))

const corsOptions = {
    origin: '*',
    credentials: true,           
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Credentials', 'true');

//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const authenticateToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function (err, user) {
            if (err) {
                req.user = undefined;
                console.log(err)
                return res.status(403).send("Could not verify token");
            }
            else {
                req.user = user;
                next()
            }
        });
    } else {
        req.user = undefined;
        return res.status(401).send("Authorization failed. No access token.");
    }
}



let userRoutes = require('./routes/userRoutes');
let apiRoutes = require('./routes/apiRoutes');
app.use("/auth", userRoutes)
app.use("/api", authenticateToken, apiRoutes)

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}...`))




