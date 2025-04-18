// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Community = require('./models/communities');
const Post = require('./models/posts');
const Comment = require('./models/comments');
const Linkflair = require('./models/linkflairs');

const app = express();
app.use(cors());

// Connect to MongoDB
const mongoDB = 'mongodb://127.0.0.1:27017/phreddit';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Express route
app.get("/communities", async (req,res) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
app.get("/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
app.get("/linkflairs", async (req, res) => {
    try {
        const linkflairs = await Linkflair.find();
        res.json(linkflairs);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

const server = app.listen(8000, () => {console.log("Server listening on port 8000...");});

// terminated message
process.on('SIGINT', () => {
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('Server closed. Database instance disconnected.');
            process.exit(0);
        });
    });
});