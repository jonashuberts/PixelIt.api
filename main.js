const express = require('express');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require("mysql2/promise");
const log = require('./libs/logger');
const tools = require('./libs/tools');

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
app.use(useragent.express());
// adding Helmet to enhance your Rest API's security
app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
// enabling CORS for all requests
app.use(cors());

app.get("/api/GetBMPByID/:id", async (req, res) => {
    ip = tools.getIPFromRequest(req);
    const id = req.params.id;
    const bmp = await repo.getBMPByID(id);

    log.info("GetBMPByID: BMP with ID {id} and name {name} successfully delivered", { id: bmp.id, name: bmp.name, ip: ip, useragent: req.useragent });
    res.send(bmp);
});

app.get("/api/GetBMPNewst", async (req, res) => {
    ip = tools.getIPFromRequest(req);
    const bmp = await repo.getBMPNewst();

    log.info("GetBMPNewst: BMP with ID {id} and name {name} successfully delivered", { id: bmp.id, name: bmp.name, ip: ip, useragent: req.useragent });
    res.send(bmp);
});

app.get("/api/GetBMPAll", async (req, res) => {
    ip = tools.getIPFromRequest(req);
    const bmps = await repo.getBMPAll();

    log.info("GetBMPAll: {count} BMPs successfully delivered", { count: bmps.length, ip: ip, useragent: req.useragent });
    res.send(bmps);
});

app.post("/api/SendStats", async (req, res) => {
    ip = tools.getIPFromRequest(req);
    await repo.saveStats();

    //log.info("BMP with ID {id} and name {name} successfully delivered", { id: bmp.id, name: bmp.name, ip: ip, useragent: useragent });
    res.send(bmp);
});

// starting the server
app.listen(port, () => {
    log.info('API listening on port {port}', { port: port });
});