var http = require('http');
var url = require('url');
var fs = require('fs');  // For reading files
var path = require('path');  // For handling file paths
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb://localhost:27017/';
var client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

async function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    
    if (pathname === '/submit-men') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // Convert Buffer to string
            });
            req.on('end', async () => {
                try {
                    var qs = querystring.parse(body);
                    await insert(req, res, qs);
                } catch (err) {
                    console.error("Error handling request data:", err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
        }
    } else if (pathname === '/t1.webp') {
        // Serve the image file
        var imagePath = path.join(__dirname, 'public', 't1.webp');
        fs.readFile(imagePath, function(err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/webp' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

async function insert(req, res, qs) {
    try {
        var db = client.db('ment');  // Database name
        var collection = db.collection('men_details');  // Collection name

        var data = {
            email: qs["email"],
            name: qs["name"],
            roll: qs["roll"],
            dep: qs["dep"],
            mail: qs["mail"],
            interest:qs["interest"],
            purpose: qs["purpose"],
            description: qs["description"]
        };

        var result = await collection.insertOne(data);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Webinar Submitted</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    .alert-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        margin-top: 5rem;
                    }
                    .alert {
                        font-size: 50px;
                        color: #002366;
                        font-style: bold;
                    }
                    img {
                        width: 150px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="alert-container">
                        <img src="/t1.webp" alt="Success">
                        <div class="alert" role="alert">
                            mentorship submitted successfully!
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error inserting document:", error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error inserting document');
    }
}

// Create the HTTP server
http.createServer(onRequest).listen(2000);
console.log('Server is running on port 2000...');
