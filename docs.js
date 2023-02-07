/*
use:
1- express to make get, post etc. requests and responses
2- nodemon to refresh server automatically
3- use joi to validate more easily 


Get all tasks: A GET request to retrieve all tasks from the MongoDB database.

Get task by ID: A GET request to retrieve a specific task based on its ID.

Create task: A POST request to add a new task to the MongoDB database.

Update task: A PUT request to update an existing task in the MongoDB database.

Delete task: A DELETE request to delete a specific task from the MongoDB database.

Delete all tasks: A DELETE request to delete all tasks belonging to a specific user from the MongoDB database.

Error handling: Functions to handle any errors that occur during the above requests, such as invalid task IDs, missing task documents, or database connection errors.

*/


// Tasks labels
["Personal", "Work", "Shopping", "Home Chores", "Health and Fitness", "Study/Learning", "Travel", "Creative/Hobbies", "Financial", "Miscellaneous/Other", "Event Planning", "Technology", "Communication", "Relationship Management", "Food and Drink", "Automotive", "Home Improvement", "Pet Care", "Personal Growth", "Spirituality/Religion"]
// and in hebrew
["אישי", "עבודה", "קניות", "מטפלים בבית", "בריאות וכושר", "לימוד / למידה", "נסיעות", "יצירה / פעילויות בחופש", "כלכלי", "שונות / אחר", "תכנון אירועים", "טכנולוגיות", "תקשורת", "ניהול יחסים", "אוכל ושתייה", "אוטומוביל", "שיפוץ הבית", "טיפוח חיות מחמד", "צמיחה אישית", "דתיות / רוחניות"]





//first views testing 

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