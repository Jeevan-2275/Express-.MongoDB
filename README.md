# Courses API

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
   ```
   git clone https://github.com/mayur2410-tech/coursesAPI-mongoDB-express
   ```

   
2. **Install dependencies:
    Navigate to the project directory and install the necessary dependencies.**

    ```
   cd coursesAPI-mongoDB-express
   npm install
   ```



 3.  **Run the server:
        Start the server locally.**

```
npm start
```
The server will run on:
http://localhost:4000 for courses with courseCode
http://localhost:3500 for courses with course_id