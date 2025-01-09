const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const dbName = "jeevandb";
const studentsCollection = "courses";

function main() {
    client
        .connect()
        .then(() => {
            console.log("Connected to MongoDB");
            const db = client.db(dbName);
            const students = db.collection(studentsCollection);

            // Pass the `students` collection to each function
            return addNewStudent(students)
                .then(() => updateStudentDetails(students))
                .then(() => deleteStudent(students))
                .then(() => listStudents(students));
        })
        .then(() => {
            client.close();
            console.log("Connection closed");
        })
        .catch((err) => {
            console.error("Error:", err);
        });
}

function addNewStudent(collection) {
    const newStudent = {
        courseCode: "EE102", 
        courseName: "Circuit Theory", 
        credits: 4, 
        instructor: "Prof. Yadav" 
    };

    return collection.insertOne(newStudent).then((result) => {
        console.log("New student added:", result.insertedId);
    });
}

function updateStudentDetails(collection) {
    const filter = { credits: 4 }; // Correct filter condition
    const update = {
        $set: {
            credits: 3,
            instructor: "Prof. Yadav" 
        },
    };

    return collection.updateOne(filter, update).then((result) => {
        console.log(`${result.modifiedCount} document(s) updated`);
    });
}

function deleteStudent(collection) {
    const filter = { courseCode: "EE102" }; // Correct filter condition

    return collection.deleteOne(filter).then((result) => {
        console.log(`${result.deletedCount} document(s) deleted`);
    });
}

function listStudents(collection) {
    return collection.find().toArray().then((students) => {
        console.log("Current list of students:", students);
    });
}

main();
