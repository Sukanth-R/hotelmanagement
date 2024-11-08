const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes

// MongoDB connection string
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Fetch data from MongoDB
app.get('/interns', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('intern');
        const collection = database.collection('intern_details');
        const interns = await collection.find({}).toArray();
        res.json(interns);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/webs', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('webinar');
        const collection = database.collection('web_details');
        const webs = await collection.find({}).toArray();
        res.json(webs);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/mens', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('mentor');
        const collection = database.collection('mentor_details');
        const mens = await collection.find({}).toArray();
        res.json(mens);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});