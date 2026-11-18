const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');

router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({
                stats: [
                    { value: '50+', label: 'Projects' },
                    { value: '200+', label: 'Publications' },
                    { value: '30+', label: 'Active Drones' },
                ],
                navigationItems: [
                    { name: 'Home', path: '/', order: 1 },
                    { name: 'Research', path: '/research', order: 2 },
                    { name: 'Team', path: '/team', order: 3 },
                    { name: 'Publications', path: '/publications', order: 4 },
                    { name: 'News', path: '/news', order: 5 },
                    { name: 'Contact', path: '/contact', order: 6 },
                    { name: 'Admin', path: '/admin', order: 7 },
                ],
                sections: [
                    { name: 'hero', title: 'Hero Section', subtitle: 'Main landing section', content: '', order: 1, enabled: true },
                    { name: 'research', title: 'Research Areas', subtitle: 'Our research focus areas', content: '', order: 2, enabled: true },
                    { name: 'team', title: 'Our Team', subtitle: 'Meet our researchers', content: '', order: 3, enabled: true },
                    { name: 'publications', title: 'Publications', subtitle: 'Our latest papers', content: '', order: 4, enabled: true },
                    { name: 'news', title: 'News', subtitle: 'Latest updates', content: '', order: 5, enabled: true },
                    { name: 'contact', title: 'Contact Us', subtitle: 'Get in touch', content: '', order: 6, enabled: true },
                ],
            });
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create(req.body);
        } else {
            settings = await SiteSettings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;