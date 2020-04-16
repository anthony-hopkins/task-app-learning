const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// POST route to add a user to users collection. Will be a protected admin route later once auth is implemented
router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body).save()
        res.status(200).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
});

// GET route to get all users. Will be a protected admin route later once auth is implemented
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET route to get a user by ObjectID. Will be a protected admin route later once auth is implemented.
router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        res.status(200).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

// UPDATE route to get a user by ObjectID and update values based on the provided key : value parameter in the body.
router.patch('/users/:id', async (req, res) => {
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

// DELETE route to get a user by ObjectID and delete them.
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send('User not found: (' + req.params.id + ')')
        }
        res.status(200).send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router