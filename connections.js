const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "admin";

// Middleware
app.use(express.json());

let db, connections;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        connections = db.collection("connections");

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

// Routes for connections

// GET: Retrieve all connections for a specific user
app.get('/connections/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // User ID as string
        const userConnections = await connections.find({ $or: [{ user1: userId }, { user2: userId }] }).toArray();

        if (!userConnections || userConnections.length === 0) {
            return res.status(404).send("No connections found for the specified user.");
        }

        res.status(200).json(userConnections);
    } catch (err) {
        res.status(500).send("Error fetching connections: " + err.message);
    }
});

// POST: Add a new connection
app.post('/connections', async (req, res) => {
    try {
        const newConnection = req.body;

        // Check if required fields are present
        if (!newConnection.connectionId || !newConnection.user1 || !newConnection.user2 || !newConnection.status) {
            return res.status(400).send("Missing required fields: connectionId, user1, user2, or status.");
        }

        // Insert new connection
        const result = await connections.insertOne(newConnection);
        res.status(201).send(`Connection added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding connection: " + err.message);
    }
});

// PATCH: Partially update a connection by connectionId
app.patch('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId; // Connection ID as string
        const updates = req.body;

        // Check if there are updates to apply
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).send("No updates provided.");
        }

        // Apply updates
        const result = await connections.updateOne(
            { connectionId },
            { $set: updates }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Connection not found or nothing updated.");
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating connection: " + err.message);
    }
});

// DELETE: Remove a connection by connectionId
app.delete('/connections/:connectionId', async (req, res) => {
    try {
        const connectionId = req.params.connectionId; // Connection ID as string
        const result = await connections.deleteOne({ connectionId });

        if (result.deletedCount === 0) {
            return res.status(404).send("Connection not found");
        }

        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting connection: " + err.message);
    }
});
