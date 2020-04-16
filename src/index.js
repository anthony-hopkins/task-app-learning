const express = require('express');
// Use require without an assignment to execute the required javascript file.
require('./db/mongoose');
const app = express();
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const port = process.env.PORT || 3000;
// This line auto parses incoming JSON to objects for 
app.use(express.json());
// Load user router to handle user routes
app.use(userRouter)
app.use(taskRouter)

// Start server
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});