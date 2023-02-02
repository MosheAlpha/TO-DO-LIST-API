const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];


app.get('/', (req, res) => {
    res.send(courses);
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params.id);
    // res.send(req.query)
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send('The course with given ID was not found.');
    } else {
        res.send(course)
    }
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) 
        return res.status(404).send('The course with given ID was not found.');

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    course.name = req.body.name;
    res.send(course)
});


app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with given ID was not found.');

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    // courses.delete(course)
    const index = courses.indexOf(course);
    courses.splice(index, 1)
    res.send(course)
});








function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course)
}











const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`))


/*
use:
1- express to make get, post etc. requests and responses
2- nodemon to refresh server automatically
3- use joi to validate more easily 
*/