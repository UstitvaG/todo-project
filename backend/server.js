const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// add tasks

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// create tasks

app.post("/tasks", (req, res) => {
    const { text } = req.body;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    }

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// update task

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const { text, completed } = req.body;

    const task = tasks.find (task => task.id === id);

    if(!task){
       return res.status(404).json({
            message: "Task not found"
        });
    }

    task.text = text;
    task.completed = completed;

    res.json(task);
})

//delete task

app.delete("/tasks/:id", (req, res) => {
    
    const id = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    res.json({
        message: "Task deleted"
    });

});

app.delete("/tasks", (req, res) => {
  tasks = [];
  res.json({ message: "All tasks deleted" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});