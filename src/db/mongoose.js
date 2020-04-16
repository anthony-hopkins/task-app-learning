const mongoose = require('mongoose');

mongoose.connect('mongodb://testbed.aelabs.net:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})