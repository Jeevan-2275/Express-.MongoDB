const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb+srv://jeevan:123@cluster0.4kpfc.mongodb.net/";
const dbName = "codinggita";

// Middleware
app.use(express.json());

let db, students;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");

        db = client.db(dbName);# Courses API

        This repository contains the code for the **Courses API**, allowing you to manage courses using `courseCode` or `course_id`. It supports common operations like retrieving, adding, updating, and deleting courses.
        
        ---
        
        ## Features
        
        - **GET**: Retrieve all courses or specific course details using `courseCode` or `course_id`.
        - **POST**: Add a new course.
        - **PUT**: Update the entire course details.
        - **PATCH**: Update specific course details.
        - **DELETE**: Remove a course from the system.
        
        ---
        
        ## API Documentation
        
        For detailed API documentation and examples, click [here](https://www.postman.com/your-postman-doc-link).
        
        ---
        
        ## Installation
        
        1. **Clone the repository**:
           ```bash
           git clone https://github.com/mayur2410-tech/coursesAPI-mongoDB-express
        
        students = db.collection("students");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all students
app.get('/students', async (req, res) => {
    try {
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student
app.post('/students', async (req, res) => {
    try {
        // console.log("Request object: ",req)
        // console.log("Request body:",req.body)
        const newStudent = req.body;
        const result = await students.insertOne(newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/students/:rollNumber', async (req, res) => {
    try {
        // console.log("Request params: ",req.params)
        // console.log("Request body:",req.body)
        const rollNumber = parseInt(req.params.rollNumber);
        const updatedStudent = req.body;
        const result = await students.replaceOne({ rollNumber }, updatedStudent);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const updates = req.body;
        const result = await students.updateOne({ rollNumber }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/students/del/:name', async (req, res) => {
    try {
        console.log(req.params.name);
        const NAme = parseInt(req.params.name);
        console.log(NAme);
        const result = await students.deleteOne({ NAme });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});
