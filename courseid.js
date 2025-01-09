const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // ObjectId for MongoDB IDs

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "config";

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

// PUT: Update a name completely by ID
app.put('/names/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedName = req.body;
        
        const result = await names.replaceOne({ _id: new ObjectId(id) }, updatedName);
        
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating name: " + err.message);
    }
});

// PATCH: Partially update a name by ID
app.patch('/names/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const result = await names.updateOne({ _id: new ObjectId(id) }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating name: " + err.message);
    }
});

// DELETE: Remove a name by ID
app.delete('/names/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await names.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting name: " + err.message);
    }
});
