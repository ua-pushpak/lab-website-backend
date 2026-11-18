const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

router.get('/collection/:name/:format', async (req, res) => {
    try {
        const collectionName = req.params.name;
        const format = req.params.format;
        const collection = mongoose.connection.db.collection(collectionName);
        const data = await collection.find({}).toArray();
        
        if (format === 'csv') {
            const fields = Object.keys(data[0] || {});
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(data);
            res.header('Content-Type', 'text/csv');
            res.attachment(`${collectionName}.csv`);
            res.send(csv);
        } else if (format === 'json') {
            res.header('Content-Type', 'application/json');
            res.attachment(`${collectionName}.json`);
            res.json(data);
        } else if (format === 'xml') {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<documents>\n';
            data.forEach(doc => {
                xml += '  <document>\n';
                Object.entries(doc).forEach(([key, value]) => {
                    xml += `    <${key}>${value}</${key}>\n`;
                });
                xml += '  </document>\n';
            });
            xml += '</documents>';
            res.header('Content-Type', 'application/xml');
            res.attachment(`${collectionName}.xml`);
            res.send(xml);
        } else {
            res.status(400).json({ success: false, message: 'Invalid format' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/all/:format', async (req, res) => {
    try {
        const format = req.params.format;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const allData = {};
        
        for (const collection of collections) {
            const data = await mongoose.connection.db.collection(collection.name).find({}).toArray();
            allData[collection.name] = data;
        }
        
        if (format === 'json') {
            res.header('Content-Type', 'application/json');
            res.attachment('database-export.json');
            res.json(allData);
        } else if (format === 'csv') {
            res.status(400).json({ success: false, message: 'CSV export only available for single collections' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid format' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;