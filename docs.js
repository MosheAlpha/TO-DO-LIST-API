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

let labels = [
    {
        "name": "Personal",
        "colorName": "Green",
        "colorHex": "#00FF00",
        "subLabels": [
            {
                "name": "Family",
                "colorName": "Lime Green",
                "colorHex": "#32CD32"
            },
            {
                "name": "Friends",
                "colorName": "Light Green",
                "colorHex": "#90EE90"
            },
            {
                "name": "Me Time",
                "colorName": "Forest Green",
                "colorHex": "#228B22"
            }
        ]
    },
    {
        "name": "Work",
        "colorName": "Blue",
        "colorHex": "#0000FF",
        "subLabels": [
            {
                "name": "Projects",
                "colorName": "Light Blue",
                "colorHex": "#ADD8E6"
            },
            {
                "name": "Meetings",
                "colorName": "Navy Blue",
                "colorHex": "#000080"
            },
            {
                "name": "Deadlines",
                "colorName": "Steel Blue",
                "colorHex": "#4682B4"
            }
        ]
    },
    {
        "name": "Groceries",
        "colorName": "Orange",
        "colorHex": "#FFA500",
        "subLabels": [
            {
                "name": "Produce",
                "colorName": "Peach",
                "colorHex": "#FFE5B4"
            },
            {
                "name": "Dairy",
                "colorName": "Coral",
                "colorHex": "#FF7F50"
            },
            {
                "name": "Bakery",
                "colorName": "Dark Orange",
                "colorHex": "#FF8C00"
            }
        ]
    },
    {
        "name": "Errands",
        "colorName": "Pink",
        "colorHex": "#FF69B4",
        "subLabels": [
            {
                "name": "Banking",
                "colorName": "Hot Pink",
                "colorHex": "#FF69B4"
            },
            {
                "name": "Post Office",
                "colorName": "Deep Pink",
                "colorHex": "#FF1493"
            },
            {
                "name": "Gas Station",
                "colorName": "Pale Violet Red",
                "colorHex": "#DB7093"
            }
        ]
    },
    {
        "name": "Fitness",
        "colorName": "Purple",
        "colorHex": "#800080",
        "subLabels": [
            {
                "name": "Yoga",
                "colorName": "Lavender",
                "colorHex": "#E6E6FA"
            },
            {
                "name": "Gym",
                "colorName": "Plum",
                "colorHex": "#DDA0DD"
            }
        ]
    },
    {
        "name": "Education",
        "colorName": "Teal",
        "colorHex": "#008080",
        "subLabels": [
            {
                "name": "Online Course",
                "colorName": "Turquoise",
                "colorHex": "#40E0D0"
            },
            {
                "name": "Book Club",
                "colorName": "Dark Turquoise",
                "colorHex": "#00CED1"
            },
            {
                "name": "Learning",
                "colorName": "Dark Olive Green",
                "colorHex": "#556B2F"
            },
            {
                "name": "Tutoring",
                "colorName": "Olive Drab",
                "colorHex": "#6B8E23"
            }
        ]
    },
    {
        "name": "Hobbies",
        "colorName": "Brown",
        "colorHex": "#A52A2A",
        "subLabels": [
            {
                "name": "Photography",
                "colorName": "Tan",
                "colorHex": "#D2B48C"
            },
            {
                "name": "Crafts",
                "colorName": "Sienna",
                "colorHex": "#A0522D"
            }
        ]
    },
    {
        "name": "Health",
        "colorName": "Maroon",
        "colorHex": "#800000",
        "subLabels": [
            {
                "name": "Doctor's Appointments",
                "colorName": "Burgundy",
                "colorHex": "#800080"
            },
            {
                "name": "Meditation",
                "colorName": "Dark Red",
                "colorHex": "#8B0000"
            }
        ]
    },
    {
        "name": "Finance",
        "colorName": "Green",
        "colorHex": "#008000",
        "subLabels": [
            {
                "name": "Budgeting",
                "colorName": "Lime Green",
                "colorHex": "#32CD32"
            },
            {
                "name": "Investing",
                "colorName": "Dark Green",
                "colorHex": "#006400"
            }
        ]
    },
    {
        "name": "Sports",
        "colorName": "Navy",
        "colorHex": "#000080",
        "subLabels": [
            {
                "name": "Basketball",
                "colorName": "Blue",
                "colorHex": "#0000FF"
            },
            {
                "name": "Soccer",
                "colorName": "Royal Blue",
                "colorHex": "#4169E1"
            }
        ]
    },
    {
        "name": "Food",
        "colorName": "Orange",
        "colorHex": "#FFA500",
        "subLabels": [
            {
                "name": "Cooking",
                "colorName": "Peach",
                "colorHex": "#FFDAB9"
            },
            {
                "name": "Eating Out",
                "colorName": "Coral",
                "colorHex": "#FF7F50"
            }
        ]
    },
    {
        "name": "Shopping",
        "colorName": "Violet",
        "colorHex": "#EE82EE",
        "subLabels": [
            {
                "name": "Clothing",
                "colorName": "Plum",
                "colorHex": "#DDA0DD"
            },
            {
                "name": "Grocery Shopping",
                "colorName": "Orchid",
                "colorHex": "#DA70D6"
            }
        ]
    },
    {
        "name": "Personal Care",
        "colorName": "Pink",
        "colorHex": "#FFC0CB",
        "subLabels": [
            {
                "name": "Haircuts",
                "colorName": "Hot Pink",
                "colorHex": "#FF69B4"
            },
            {
                "name": "Manicures",
                "colorName": "Deep Pink",
                "colorHex": "#FF1493"
            }
        ]
    },
    {
        "name": "Travel",
        "colorName": "Maroon",
        "colorHex": "#800000",
        "subLabels": [
            {
                "name": "Vacation",
                "colorName": "Crimson",
                "colorHex": "#DC143C"
            },
            {
                "name": "Business Trips",
                "colorName": "Tomato",
                "colorHex": "#FF6347"
            }
        ]
    },
    {
        "name": "Home",
        "colorName": "Yellow",
        "colorHex": "#FFFF00",
        "subLabels": [
            {
                "name": "Cleaning",
                "colorName": "Khaki",
                "colorHex": "#F0E68C"
            },
            {
                "name": "DIY Projects",
                "colorName": "Gold",
                "colorHex": "#FFD700"
            },
            {
                "name": "Painting",
                "colorName": "Lemon Yellow",
                "colorHex": "#FFFACD"
            },
            {
                "name": "Gardening",
                "colorName": "Light Yellow",
                "colorHex": "#FFFFE0"
            }
        ]
    },
    {
        "name": "Entertainment",
        "colorName": "Red",
        "colorHex": "#FF0000",
        "subLabels": [
            {
                "name": "Movies",
                "colorName": "Firebrick",
                "colorHex": "#B22222"
            },
            {
                "name": "Music",
                "colorName": "Crimson",
                "colorHex": "#DC143C"
            }
        ]
    },
    {
        "name": "Miscellaneous/Other",
        "colorName": "Platinum",
        "colorHex": "#E5E4E2",
        "subLabels": [
            {
                "name": "Household Items",
                "colorName": "Lavender",
                "colorHex": "#E6E6FA"
            },
            {
                "name": "Stationery",
                "colorName": "Mint Green",
                "colorHex": "#98FF98"
            }
        ]
    },
    {
        "name": "Event Planning",
        "colorName": "Sky Blue",
        "colorHex": "#87CEEB",
        "subLabels": [
            {
                "name": "Wedding",
                "colorName": "Blush Pink",
                "colorHex": "#FF69B4"
            },
            {
                "name": "Birthday Party",
                "colorName": "Sunshine Yellow",
                "colorHex": "#FFF700"
            }
        ]
    },
    {
        "name": "Technology",
        "colorName": "Electric Blue",
        "colorHex": "#7DF9FF",
        "subLabels": [
            {
                "name": "Computers",
                "colorName": "Cool Gray",
                "colorHex": "#808080"
            },
            {
                "name": "Mobile Devices",
                "colorName": "Rose Gold",
                "colorHex": "#B76E79"
            }
        ]
    },
    {
        "name": "Communication",
        "colorName": "Turquoise",
        "colorHex": "#40E0D0",
        "subLabels": [
            {
                "name": "Phone Calls",
                "colorName": "Cyan",
                "colorHex": "#00FFFF"
            },
            {
                "name": "Emails",
                "colorName": "Light Sky Blue",
                "colorHex": "#87CEFA"
            }
        ]
    },
    {
        "name": "Relationship Management",
        "colorName": "Terracotta",
        "colorHex": "#E2725B",
        "subLabels": [
            {
                "name": "Family",
                "colorName": "Peach",
                "colorHex": "#FFE5B4"
            },
            {
                "name": "Friends",
                "colorName": "Lemon Yellow",
                "colorHex": "#FFFF00"
            }
        ]
    },
    {
        "name": "Spirituality/Religion",
        "colorName": "Lavender",
        "colorHex": "#E6E6FA",
        "subLabels": [
            {
                "name": "Meditation",
                "colorName": "Periwinkle",
                "colorHex": "#CCCCFF"
            },
            {
                "name": "Prayer",
                "colorName": "Thistle",
                "colorHex": "#D8BFD8"
            }
        ]
    }
]

["Personal", "Work", "Shopping", "Home Chores", "Health and Fitness", "Study/Learning", "Travel", "Creative/Hobbies", "Financial", "Miscellaneous/Other", "Event Planning", "Technology", "Communication", "Relationship Management", "Food and Drink", "Automotive", "Home Improvement", "Pet Care", "Personal Growth", "Spirituality/Religion"]
// and in hebrew
["אישי", "עבודה", "קניות", "מטפלים בבית", "בריאות וכושר", "לימוד / למידה", "נסיעות", "יצירה / פעילויות בחופש", "כלכלי", "שונות / אחר", "תכנון אירועים", "טכנולוגיות", "תקשורת", "ניהול יחסים", "אוכל ושתייה", "אוטומוביל", "שיפוץ הבית", "טיפוח חיות מחמד", "צמיחה אישית", "דתיות / רוחניות"]

const tasksArr = [
    {
        userId: 'user1',
        taskName: 'Grocery Shopping',
        description: 'Buy groceries for the week',
        dueDate: new Date('2023-02-10'),
        priority: 3,
        labels: ['Personal', 'Shopping']
    }
];



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





