const Joi = require('joi');
const express = require('express');
const app = express();
const Task = require('./models/task')
const mongoose = require('mongoose')
const db = 'mongodb+srv://Bon1bon:Mongodb2022@cluster0.nenr97g.mongodb.net/to_do_tasks?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);
mongoose.connect(db).then((res) => console.log("Connected to DB...")).catch((error) => console.log(error))


app.use(express.json());

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

//main-page
app.get('/api', (req, res) => {
    const task = new Task(tasksArr[2]);
    task.save().then((result) => res.send(result))
        .catch((error) => {
            console.log(error)
            // res.render(createPath('error'), {title: 'Error'})  
            res.send(error)
        })
});

//All tasks
app.get('/api/tasks', (req, res) => {
    Task.find({}, (error, tasks) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve tasks' });
        }

        return res.send(tasks);
    });
});

//specific task
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid task ID' });
    }

    Task.findById(id, (error, task) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Failed to retrieve task' });
        }

        if (!task) return res.status(404).send({ error: 'Task not found' });
        return res.send(task);
    });
});

//create new task
app.post('/api/tasks', (req, res) => {
    const newTask = new Task({
        userId: req.body.userId,
        taskName: req.body.taskName,
        description: req.body.description,
        dueDate: req.body.dueDate,
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
});

//update task
app.put('/api/tasks/:id', (req, res) => {
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
});

//delete task by id
// app.delete('/api/tasks/:id', (req, res) => {
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
// });

//delete all tasks for specific user
app.delete("/api/tasks/:userId", (req, res) => {
    Task.remove({}, (error) => {
        if (error) {
            return res.status(500).json({ message: "Error deleting tasks" });
        }
        return res.status(200).json({ message: "All tasks deleted successfully" });
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`))





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
    if (error) return res.status(400).send(error.details[0].message)

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

    if (error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name;
    res.send(course)
    console.log()
});


app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with given ID was not found.');

    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message)

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