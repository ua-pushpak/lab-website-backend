const express = require('express');
const router = express.Router();
const SiteBackup = require('../models/SiteBackup');
const Project = require('../models/Project');
const Publication = require('../models/Publication');
const Author = require('../models/Author');
const TeamMember = require('../models/TeamMember');
const NewsArticle = require('../models/NewsArticle');
const SiteSettings = require('../models/SiteSettings');
const User = require('../models/User');
const Version = require('../models/Version');

router.post('/create', async (req, res) => {
    try {
        const { backupName } = req.body;
        
        const [projects, publications, authors, teamMembers, news, siteSettings, users, versions] = await Promise.all([
            Project.find(),
            Publication.find(),
            Author.find(),
            TeamMember.find(),
            NewsArticle.find(),
            SiteSettings.findOne(),
            User.find().select('-password'),
            Version.find(),
        ]);
        
        const backup = await SiteBackup.create({
            backupName: backupName || `Backup - ${new Date().toLocaleString()}`,
            data: {
                projects,
                publications,
                authors,
                teamMembers,
                news,
                siteSettings,
                users,
                versions,
            },
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Backup created successfully',
            data: backup,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const backups = await SiteBackup.find().sort({ createdAt: -1 }).select('-data');
        res.json({ success: true, data: backups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const backup = await SiteBackup.findById(req.params.id);
        if (!backup) {
            return res.status(404).json({ success: false, message: 'Backup not found' });
        }
        res.json({ success: true, data: backup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/:id/restore', async (req, res) => {
    try {
        const backup = await SiteBackup.findById(req.params.id);
        if (!backup) {
            return res.status(404).json({ success: false, message: 'Backup not found' });
        }
        
        const { data } = backup;
        
        await Promise.all([
            Project.deleteMany({}),
            Publication.deleteMany({}),
            Author.deleteMany({}),
            TeamMember.deleteMany({}),
            NewsArticle.deleteMany({}),
            SiteSettings.deleteMany({}),
            User.deleteMany({}),
            Version.deleteMany({}),
        ]);
        
        if (data.projects.length) await Project.insertMany(data.projects);
        if (data.publications.length) await Publication.insertMany(data.publications);
        if (data.authors.length) await Author.insertMany(data.authors);
        if (data.teamMembers.length) await TeamMember.insertMany(data.teamMembers);
        if (data.news.length) await NewsArticle.insertMany(data.news);
        if (data.siteSettings) await SiteSettings.create(data.siteSettings);
        if (data.users.length) await User.insertMany(data.users);
        if (data.versions.length) await Version.insertMany(data.versions);
        
        res.json({ success: true, message: 'Backup restored successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const backup = await SiteBackup.findByIdAndDelete(req.params.id);
        if (!backup) {
            return res.status(404).json({ success: false, message: 'Backup not found' });
        }
        res.json({ success: true, message: 'Backup deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;