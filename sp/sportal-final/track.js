const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 2005;

// Middleware
app.use(express.json()); // Use express built-in JSON parser
app.use(cors()); // Handle CORS issues
app.use(express.static('public')); // Serve static files
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/alumni', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Alumni Schema (Using Mongoose)
const alumniSchema = new mongoose.Schema({
    name: String,
    dept: String,
    year: String,
    email: String,
    linkedin: String,
    mobile: String
});
const Alumni = mongoose.model('details', alumniSchema);

// Define Session Schema (Using Mongoose)

// Define Announcement Schema (Using Mongoose)
const announcementSchema = new mongoose.Schema({
    title: String,
    startDate: String,
    description: String
});
const Announcement = mongoose.model('Announcement', announcementSchema);

// Define Query Schema (Using Mongoose)
// Updated schema: using `email` instead of `name`
const querySchema = new mongoose.Schema({
    email: { type: String, required: true },
    name:{type:String,required:true},
    message: { type: String, required: true }
});
const Query = mongoose.model('Query', querySchema);

// Fetch all alumni data
app.get('/alumnis', async (req, res) => {
    try {
        const alumnis = await Alumni.find();
        res.status(200).json(alumnis);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle session scheduling
app.post('/schedule-session', async (req, res) => {
    try {
        const sessionData = req.body;
        const session = new Session(sessionData);
        await session.save();
        res.status(200).json({ message: 'Session scheduled successfully!' });
    } catch (error) {
        console.error('Error scheduling session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch all announcements
app.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

// Add a new announcement
app.post('/announcements', async (req, res) => {
    const { title, startDate, description } = req.body;

    try {
        const newAnnouncement = new Announcement({ title, startDate, description });
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error adding announcement' });
    }
});

// Handle POST requests to /queries (for the contact form submission)
// Updated to use `email` instead of `name`
app.post('/queries', async (req, res) => {
    try {
        const { email,name, message } = req.body;

        // Validate the inputs
        if (!email ||!name|| !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        // Insert the query into the MongoDB collection
        const newQuery = new Query({ email,name, message });
        await newQuery.save();

        res.status(201).json({ success: 'Query submitted successfully' });
    } catch (error) {
        console.error('Error inserting query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
