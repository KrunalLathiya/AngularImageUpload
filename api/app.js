const express = require('express');
const cors = require('cors');
const path = require("path");
const multerUpload = require('./multerConfig');


function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(express.json());
    app.post('/add', multerUpload.single('file'), async (req, res) => {
        res.json({ title: "File uploaded successfully" })
    });

    return app;
}

module.exports = createApp;