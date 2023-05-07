// Setup empty JS array to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

// Initialize the main project folder
app.use(express.static(path.resolve('../../dist')));

// Setup Server
const port = 8000;

const server = app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});


/* Routes */
// GET route
app.get('/', (req, res) => {
    res.sendFile(path.resolve('../../dist/index.html'));
})

app.get('/all', (req, res) => {
    res.send(projectData);
});

app.get('/remove', (req, res) => {
    projectData.splice(req.query.index, 1);
    res.send(projectData);
});

// POST route
app.post('/addTrip', (req, res) => {
    const data = req.body;

    const entry = {
        place: data.place,
        date: data.date,
        days: data.days,
        img: data.img,
        temp: data.temp,
        weather: data.weather
    };
    projectData.push(entry);

    res.send(projectData);
});

app.post('/geonames', async (req, res) => {
    const param = req.body;

    const data = await fetch(param.base + param.place + process.env.GEONAMES_KEY)
        .then(response => response.json());

    // return it to the browser
    res.json(data)
});

app.post('/weatherbit', async (req, res) => {
    const param = req.body;

    const data = await fetch(param.base + param.location + process.env.WEATHERBIT_KEY)
        .then(response => response.json());

    // return it to the browser
    res.json(data)
});

app.post('/pixabay', async (req, res) => {
    const param = req.body;

    const data = await fetch(param.base + param.place + process.env.PIXABAY_KEY)
        .then(response => response.json());

    // return it to the browser
    res.json(data)
});

module.exports = server;