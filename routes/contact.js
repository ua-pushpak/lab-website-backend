const express = require('express');
const router = express.Router();

// POST /api/contact — receives contact form submissions
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  // TODO: send email / store in DB — replace this placeholder
  console.log('Contact form submission:', { name, email, message });

  res.status(200).json({ success: true, message: 'Message received' });
});

module.exports = router;