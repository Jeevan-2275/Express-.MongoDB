const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "admin";

// Middleware
app.use(express.json());

let db, messages;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        messages = db.collection("messages");

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

// Routes for messages

// GET: Retrieve a specific message by messageId
app.get('/messages/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId; // Message ID as string
        const message = await messages.findOne({ messageId });

        if (!message) {
            return res.status(404).send("Message not found");
        }

        res.status(200).json(message);
    } catch (err) {
        res.status(500).send("Error fetching message: " + err.message);
    }
});


// POST: Create a new message
app.post('/messages', async (req, res) => {
    try {
        const newMessage = req.body;

        // Check if required fields are present
        if (!newMessage.messageId || !newMessage.from || !newMessage.to || !newMessage.content) {
            return res.status(400).send("Missing required fields: messageId, from, to, or content.");
        }

        // Insert new message
        const result = await messages.insertOne(newMessage);
        res.status(201).send(`Message sent with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating message: " + err.message);
    }
});

// DELETE: Remove a message by messageId
app.delete('/messages/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId; // Message ID as string
        const result = await messages.deleteOne({ messageId });

        if (result.deletedCount === 0) {
            return res.status(404).send("Message not found");
        }

        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting message: " + err.message);
    }
});
