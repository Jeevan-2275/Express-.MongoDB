const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "jeevandb";

// Middleware
app.use(express.json());

let db, names;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        names = db.collection("names");

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

// GET: List all names
app.get('/names', async (req, res) => {
    try {
        const allNames = await names.find().toArray();
        res.status(200).json(allNames);
    } catch (err) {
        res.status(500).send("Error fetching names: " + err.message);
    }
});

// POST: Add a new name
app.post('/names', async (req, res) => {
    try {
        const newName = req.body;
        const result = await names.insertOne(newName);
        res.status(201).send(`Name added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding name: " + err.message);
    }
});

// PUT: Update a name completely
app.put('/names/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const updatedName = req.body;
        const result = await names.replaceOne({ name }, updatedName);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating name: " + err.message);
    }
});

// PATCH: Partially update a name
app.patch('/names/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const updates = req.body;
        const result = await names.updateOne({ name }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating name: " + err.message);
    }
});

// DELETE: Remove a name by name
app.delete('/names/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const result = await names.deleteOne({ name });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting name: " + err.message);
    }
});

// DELETE: Remove a name by name field (alternative route)
app.delete('/names/del/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const result = await names.deleteOne({ name });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting name: " + err.message);
    }
});
