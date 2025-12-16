const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// MongoDB Connection (attempt) — if it fails, fall back to local file storage
let dbConnected = false;
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        dbConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        dbConnected = false;
        console.log('MongoDB connection error:', err.message || err);
        console.log('Falling back to local file storage for comments.');
    }
};
connectToMongo();

// Prevent process from exiting on unhandled errors from the driver; log and fall back to file storage
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error (event):', err && err.message ? err.message : err);
    dbConnected = false;
});

process.on('unhandledRejection', (reason) => {
    console.log('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err && err.message ? err.message : err);
});

const COMMENTS_FILE = path.join(__dirname, 'comments.json');

async function readCommentsFromFile() {
    try {
        const data = await fs.readFile(COMMENTS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        if (e.code === 'ENOENT') {
            await fs.writeFile(COMMENTS_FILE, '[]', 'utf8');
            return [];
        }
        throw e;
    }
}

async function writeCommentsToFile(comments) {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf8');
}

// Comment Schema
const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes

// GET all comments
app.get('/api/comments', async (req, res) => {
    try {
        if (dbConnected) {
            const comments = await Comment.find().sort({ createdAt: -1 });
            return res.json(comments);
        }
        const comments = await readCommentsFromFile();
        // sort by createdAt desc
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new comment
app.post('/api/comments', async (req, res) => {
    const payload = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        rating: req.body.rating,
        createdAt: new Date(),
    };

    try {
        if (dbConnected) {
            const comment = new Comment(payload);
            const newComment = await comment.save();
            return res.status(201).json(newComment);
        }

        // file fallback: give a simple id
        const comments = await readCommentsFromFile();
        const newComment = Object.assign({ _id: Date.now().toString() }, payload);
        comments.push(newComment);
        await writeCommentsToFile(comments);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET comments count
app.get('/api/comments/count', async (req, res) => {
    try {
        if (dbConnected) {
            const count = await Comment.countDocuments();
            const comments = await Comment.find();
            const avgRating = comments.length > 0
                ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
                : 0;
            return res.json({ count, avgRating });
        }

        const comments = await readCommentsFromFile();
        const count = comments.length;
        const avgRating = comments.length > 0
            ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length).toFixed(1)
            : 0;
        res.json({ count, avgRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a comment (optional - for admin)
app.delete('/api/comments/:id', async (req, res) => {
    try {
        if (dbConnected) {
            await Comment.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Comment deleted' });
        }

        const comments = await readCommentsFromFile();
        const filtered = comments.filter(c => c._id !== req.params.id);
        await writeCommentsToFile(filtered);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
