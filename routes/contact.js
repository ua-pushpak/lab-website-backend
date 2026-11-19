const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // 1. Save to MongoDB
        const newMessage = await Message.create({ name, email, message });
        
        // 2. Setup Email Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sends to yourself
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