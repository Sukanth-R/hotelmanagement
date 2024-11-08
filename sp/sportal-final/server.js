const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes

// MongoDB connection string
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Fetch offers data from MongoDB
app.get('/jobs', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('job');
        const collection = database.collection('job_details');
        const jobs = await collection.find({}).toArray();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch success stories from MongoDB
app.get('/stories', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('story');
        const collection = database.collection('story_details');
        const stories = await collection.find({}).toArray();
        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(3005, () => {
    console.log('Server is running on http://localhost:3005');
});
