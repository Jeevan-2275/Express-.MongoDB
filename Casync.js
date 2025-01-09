const { MongoClient } = require('mongodb');

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

// Database and collection names
const dbName = "jeevandb";
const coursesCollection = "courses";

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const courses = db.collection(coursesCollection);

        await addNewCourse(courses);
        await updateCourseDetails(courses);
        await deleteCourse(courses);
        await listCourses(courses);

    } catch (error) {
        console.error("Error in MongoDB operations:", error);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

async function addNewCourse(collection) {
    const newCourse = {
        courseCode: "EE102", 
        courseName: "Circuit Theory", 
        credits: 4, 
        instructor: "Prof. Yadav",
        semester: 1
    };

    const result = await collection.insertOne(newCourse);
    console.log("New course added:", result.insertedId);
}

async function updateCourseDetails(collection) {
    const filter = { courseCode: "CS101" }; 
    const update = { 
        $set: { 
            credits: 4,
            instructor: "Prof. Yadav"
        }
    };

    const result = await collection.updateOne(filter, update);
    console.log(`${result.modifiedCount} document(s) updated`);
}

async function deleteCourse(collection) {
    const filter = { courseCode: "ME102" };
    const result = await collection.deleteOne(filter);
    console.log(`${result.deletedCount} document(s) deleted`);
}

async function listCourses(collection) {
    const courses = await collection.find().toArray();
    console.log("Current list of courses:", courses);
}

main().catch(console.error);
