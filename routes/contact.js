const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { Resend } = require('resend');

// Initialize Resend with your API Key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // 1. Save to Database (This should already be working)
        const newMessage = await Message.create({ name, email, message });
        
        // 2. Send Email via Resend (HTTP API - Works on Render)
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Use this for testing (Resend's default)
            to: 'uapushpak@gmail.com',   // The email where you want to receive messages
            subject: `New Contact Message from ${name}`,
            text: `From: ${email}\n\nMessage: ${message}`
        });

        res.status(200).json({ success: true, message: 'Message sent and saved!', data: newMessage });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;