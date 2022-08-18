const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require("mysql2/promise");
const log = require('./libs/logger');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const repo = require("./libs/pixelItRepo")(connection, log);
const port = process.env.PORT || 3001;

// defining the Express app
const app = express();
// adding Helmet to enhance your Rest API's security
app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
// enabling CORS for all requests
app.use(cors());

app.get("/api/GetBMP/:id", async (req, res) => {
    const id = req.params.id;
    const bmp = await repo.getBMPByID(id);
    res.send(bmp);
});

app.get("/api/GetBMPNewst", async (req, res) => {
    const bmp = await repo.getBMPNewst();
    res.send(bmp);
});

app.get("/api/GetBMPAll", async (req, res) => {
    const bmp = await repo.getBMPAll();
    res.send(bmp);
});

app.post("/api/SendStats", async (req, res) => {
    await repo.saveStats();
    res.send(bmp);
});

// starting the server
app.listen(port, () => {
    log.info('API listening on port {port}', { port: port });
});