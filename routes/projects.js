const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
    try {
        const { category, status, featured } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (status) query.status = status;
        if (featured) query.featured = featured === 'true';
        
        const projects = await Project.find(query)
            .populate('teamMembers', 'name title role')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching projects',
            error: error.message,
        });
    }
});

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('teamMembers', 'name title role photoUrl');
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        
        res.json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching project',
            error: error.message,
        });
    }
});

// POST create project
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating project',
            error: error.message,
        });
    }
});

// PUT update project
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        
        res.json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating project',
            error: error.message,
        });
    }
});

// DELETE project
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        
        res.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting project',
            error: error.message,
        });
    }
});

router.patch('/:id/toggle-visibility', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        project.isVisible = !project.isVisible;
        await project.save();
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;