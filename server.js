var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var EMPLOYEE_COLLECTION = "employees";
var DEPARTMENT_COLLECTION = "departments";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// EMPLOYEES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

/*  "/api/employee"
 *    GET: finds all employee
 *    POST: creates a new employee
 */

app.get("/api/employee", function (req, res) {
    db.collection(EMPLOYEE_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get employees.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/employee", function (req, res) {
    var newEmployee = req.body;
    newEmployee.createDate = new Date();

    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
        db.collection(EMPLOYEE_COLLECTION).insertOne(newEmployee, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to add a new employee.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/*  "/api/employee/:id"
 *    GET: find employee by id
 *    PUT: update employee by id
 *    DELETE: deletes employee by id
 */

app.get("/api/employee/:id", function (req, res) {
});

app.put("/api/employee/:id", function (req, res) {
});

app.delete("/api/employee/:id", function (req, res) {
});