const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

router.get('/', async (req, res) => {
    try {
        const authors = await Author.find().sort({ name: 1 });
        res.json({ success: true, data: authors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, institution } = req.body;
        
        const existingAuthor = await Author.findOne({ email });
        if (existingAuthor) {
            return res.json({ success: true, data: existingAuthor, message: 'Author already exists' });
        }
        
        const author = await Author.create({ name, email, institution });
        res.status(201).json({ success: true, data: author });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }
        res.json({ success: true, data: author });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }
        res.json({ success: true, message: 'Author deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/toggle-visibility', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }
        author.isVisible = !author.isVisible;
        await author.save();
        res.json({ success: true, data: author });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;