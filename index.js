const express = require("express");
const cors = require("cors");

const config = require("./config/sys_config");
const db_config = require('./config/db_config');
const user_route = require('./routes/user_routes');

const db = require("./db/db");

const app = express();

db.mongoose
    .connect(`mongodb://${db_config.HOST}:${db_config.PORT}/${db_config.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB successfully.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome Vien Health NodeJS API." });
});

app.use(`/api/v1/users`, user_route);

// set port, listen for requests
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Prepare for testing
module.exports = app;