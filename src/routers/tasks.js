const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')


// POST route to create a new task. Will be limited by user based on auth in the future
router.post('/tasks', async (req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get all tasks. Will be limited by user based on auth in the future
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get a single task by ObjectID. Will be limited by user based on auth in the future
router.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findById(id)
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

// UPDATE route to get a task by ObjectID and update values based on the provided key : value parameter in the body.
router.patch('/tasks/:id', async (req, res) => {
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
// DELETE route to find task by ObjectID and delete it
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send('User not found: (' + req.params.id + ')')
        }
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router