const express = require('express');
// Use require without an assignment to execute the required javascript file.
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/tasks')

const app = express();
const port = process.env.PORT || 3000;

// This line auto parses incoming JSON to objects for 
app.use(express.json());

// POST route to add a user to users collection. Will be a protected admin route later once auth is implemented
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save()
        res.status(200).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
});

// GET route to get all users. Will be a protected admin route later once auth is implemented
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get a user by ObjectID. Will be a protected admin route later once auth is implemented.
app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        res.status(200).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

// UPDATE route to get a user by ObjectID and update values based on the provided key : value parameter in the body.
app.patch('/users/:id', async (req, res) => {
    // This gets the keys from the request JSON object and stores them in an array
    const updates = Object.keys(req.body)
    // A list of allowed keys/fields to update
    const allowedUpdates = ['name', 'email', 'passwod', 'age']
    5
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        // Return a 404 due to a disallowed update being detected
        return res.status(400).send('Disallowed update...')
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            //new ensures we get the updated object back and not the old
            new: true,
            //This ensures validators are ran against input to catch errors 
            runValidators: true
        })

        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)

    } catch(e) {
        res.status(500).send(e)
    }
})

// POST route to create a new task. Will be limited by user based on auth in the future
app.post('/tasks', async (req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get all tasks. Will be limited by user based on auth in the future
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get a single task by ObjectID. Will be limited by user based on auth in the future
app.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findById(id)
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

// UPDATE route to get a task by ObjectID and update values based on the provided key : value parameter in the body.
app.patch('/tasks/:id', async (req, res) => {
    // This gets the keys from the request JSON object and stores them in an array
    const updates = Object.keys(req.body)
    // A list of allowed keys/fields to update
    const allowedUpdates = ['description', 'completed']
    // Iterate through updates and ensure that each update is allowed. Returns a Boolean
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // Return a 404 due to a disallowed update being detected
    if (!isValidOperation) {
        return res.status(400).send('Disallowed update...')
    }

    // Try to update the document as requested.
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!task) {
            return res.status(404).send('Edit document failed. No such key (' + req.params.id + ')')
        }
        res.status(200).send(task)

    } catch(e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});