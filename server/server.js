// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get("/", function (req, res) {
    console.log("Get request received at '/'");
    res.send("Hello Phreddit!")
});

app.listen(8000, () => {console.log("Server listening on port 8000...");});
