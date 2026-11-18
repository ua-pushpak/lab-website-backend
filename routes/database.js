const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/collections', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        res.json({ success: true, data: collectionNames });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/collections/:name', async (req, res) => {
    try {
        const collectionName = req.params.name;
        const collection = mongoose.connection.db.collection(collectionName);
        const documents = await collection.find({}).limit(100).toArray();
        const count = await collection.countDocuments();
        res.json({ success: true, count, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/collections/:name/document/:id', async (req, res) => {
    try {
        const collectionName = req.params.name;
        const documentId = req.params.id;
        const collection = mongoose.connection.db.collection(collectionName);
        const ObjectId = mongoose.Types.ObjectId;
        const result = await collection.deleteOne({ _id: new ObjectId(documentId) });
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/collections/:name/document/:id', async (req, res) => {
    try {
        const collectionName = req.params.name;
        const documentId = req.params.id;
        const updateData = req.body;
        const collection = mongoose.connection.db.collection(collectionName);
        const ObjectId = mongoose.Types.ObjectId;
        delete updateData._id;
        const result = await collection.updateOne(
            { _id: new ObjectId(documentId) },
            { $set: updateData }
        );
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const stats = {};
        
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            stats[collection.name] = count;
        }
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;