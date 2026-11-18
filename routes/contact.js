const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // 1. Save to Database
        const newMessage = await Message.create({ name, email, message });
        
        // 2. Send Email (Requires an App Password from Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Add to Render environment variables
                pass: process.env.EMAIL_PASS  // Add to Render environment variables
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Contact Message from ${name}`,
            text: `From: ${email}\n\nMessage: ${message}`
        });

        res.status(200).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;