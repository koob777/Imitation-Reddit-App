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
app.use(express.json());

// Connect to MongoDB
const mongoDB = 'mongodb://127.0.0.1:27017/phreddit';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Express routes
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
// creating 
// app.post("/communities", async (req,res) => {
//     const {name,description,members} = req.body;
//     const newCommunity = new Community({name,description,members});
//     try {
//         const createdCommunity = await newCommunity.save();
//         res.status(201).json(createdCommunity);
//     } catch (err) {
//         res.status(400).json({message: err.message});
//     }
// });
app.post("/communities", async (req, res) => {
    try {
        let community = req.body;
        let newcommunityDoc = new Community({
            name: community.name,
            description: community.description,
            postIDs: community.postIDs,
            startDate: community.startDate,
            members: community.members,
        });
        await newcommunityDoc.save();
        res.json(newcommunityDoc);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});
app.post("/posts", async (req, res) => {
    try {
        const { post, flair, communityName } = req.body;

        let linkFlairId = null;

        // Save the link flair if provided
        if (flair) {
            const newFlair = new Linkflair(flair);
            const savedFlair = await newFlair.save();
            linkFlairId = savedFlair._id;
        }

        // Save the post, now with actual MongoDB ObjectId
        const newPost = new Post({
            ...post,
            linkFlairID: linkFlairId,
        });
        await newPost.save();

        // Add the post to the corresponding community
        const community = await Community.findOne({ name: communityName });
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        community.postIDs.push(newPost._id);
        await community.save();

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating post' });
    }
});
app.post("/comments", async (req, res) => {
    try {
        console.log("Incoming comment POST:", req.body);
        const { content, parentID, isReplyToComment, commentedBy } = req.body;
        const commentIDs = [];
        const commentedDate = new Date();

        const newComment = new Comment({
            content,
            commentIDs,
            commentedBy,
            commentedDate
        });
        await newComment.save();

        if (isReplyToComment) {
            const parentComment = await Comment.findById(parentID);
            if (!parentComment) return res.status(404).json({ message: "Parent Comment not found "});

            parentComment.commentIDs.push(newComment._id);
            await parentComment.save();
        } else {
            const parentPost = await Post.findById(parentID);
            console.log(parentPost);
            if (!parentPost) return res.status(404).json({ message: "Parent post not found" });

            parentPost.commentIDs.push(newComment._id);
            await parentPost.save();
        }
        res.status(201).json({ message: "Comment created", comment: newComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating comment" });
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