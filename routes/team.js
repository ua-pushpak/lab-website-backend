const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// GET all team members
router.get('/', async (req, res) => {
    try {
        const { role, featured } = req.query;
        let query = {};
        
        if (role) query.role = role;
        if (featured) query.featured = featured === 'true';
        
        const teamMembers = await TeamMember.find(query)
            .populate('publications', 'title journal year')
            .sort({ role: 1, name: 1 });
        
        res.json({
            success: true,
            count: teamMembers.length,
            data: teamMembers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team members',
            error: error.message,
        });
    }
});

// GET team member by ID
router.get('/:id', async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id)
            .populate('publications', 'title journal year doi');
        
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }
        
        res.json({
            success: true,
            data: member,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team member',
            error: error.message,
        });
    }
});

// POST create team member
router.post('/', async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json({
            success: true,
            data: member,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating team member',
            error: error.message,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }
        
        res.json({
            success: true,
            data: member,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating team member',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }
        
        res.json({
            success: true,
            message: 'Team member deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting team member',
            error: error.message,
        });
    }
});

router.patch('/:id/toggle-visibility', async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        member.isVisible = !member.isVisible;
        await member.save();
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;