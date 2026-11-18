const express = require('express');
const router = express.Router();

// Temporary in-memory resources.
// We can connect this to MongoDB later if you need
// resources to persist in the database.

let resources = [];

// GET all resources
router.get('/', (req, res) => {
    res.json(resources);
});

// GET a single resource
router.get('/:id', (req, res) => {
    const resource = resources.find(item => item.id === req.params.id);

    if (!resource) {
        return res.status(404).json({
            message: 'Resource not found'
        });
    }

    res.json(resource);
});

// CREATE a resource
router.post('/', (req, res) => {
    const resource = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };

    resources.push(resource);

    res.status(201).json(resource);
});

// UPDATE a resource
router.put('/:id', (req, res) => {
    const index = resources.findIndex(
        item => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Resource not found'
        });
    }

    resources[index] = {
        ...resources[index],
        ...req.body,
        id: resources[index].id
    };

    res.json(resources[index]);
});

// DELETE a resource
router.delete('/:id', (req, res) => {
    const index = resources.findIndex(
        item => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Resource not found'
        });
    }

    resources.splice(index, 1);

    res.json({
        message: 'Resource deleted successfully'
    });
});

module.exports = router;