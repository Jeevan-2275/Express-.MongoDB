const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "admin";

// Middleware
app.use(express.json());

let db, posts;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        posts = db.collection("posts");

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

// Routes for posts

// GET: Retrieve a specific post by postId
app.get('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId; // Post ID as string
        const post = await posts.findOne({ postId });

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).send("Error fetching post: " + err.message);
    }
});

// POST: Create a new post
app.post('/posts', async (req, res) => {
    try {
        const newPost = req.body;

        // Check if required fields are present
        if (!newPost.postId || !newPost.userId || !newPost.content) {
            return res.status(400).send("Missing required fields: postId, userId, or content.");
        }

        // Insert new post
        const result = await posts.insertOne(newPost);
        res.status(201).send(`Post created with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating post: " + err.message);
    }
});

// PATCH: Update the number of likes on a post
app.patch('/posts/:postId/likes', async (req, res) => {
    try {
        const postId = req.params.postId; // Post ID as string
        const { likes } = req.body;

        if (likes === undefined) {
            return res.status(400).send("Missing required field: likes.");
        }

        // Update the likes count for the post
        const result = await posts.updateOne(
            { postId },
            { $set: { likes } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Post not found or nothing updated.");
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating likes on post: " + err.message);
    }
});

// DELETE: Remove a post by postId
app.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId; // Post ID as string
        const result = await posts.deleteOne({ postId });

        if (result.deletedCount === 0) {
            return res.status(404).send("Post not found");
        }

        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting post: " + err.message);
    }
});
