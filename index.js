// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Task = require('./models/Task'); // Import the Task model

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set EJS as the templating engine
app.set("view engine", "ejs");

// MongoDB connection using the URI from .env file
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });

// Serve the index.ejs template
app.get('/', (req, res) => {
    res.render('index'); // Renders the index.ejs template
});

// API Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    const { description } = req.body;//const description = req.body.description;
    try {
        const newTask = new Task({ description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Error adding task' });
    }
});

// Update task completion status or description
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, description } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { completed, description }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});
