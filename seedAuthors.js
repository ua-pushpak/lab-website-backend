const mongoose = require('mongoose');
const Author = require('./models/Author');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Author.deleteMany({});
    
    const authors = [
      { name: 'Dr. Sarah Chen', email: 'sarah.chen@dronelab.org', institution: 'DroneLab' },
      { name: 'Dr. Raj Patel', email: 'raj.patel@dronelab.org', institution: 'DroneLab' },
      { name: 'Alex Kim', email: 'alex.kim@dronelab.org', institution: 'DroneLab' },
      { name: 'Priya Sharma', email: 'priya.sharma@dronelab.org', institution: 'DroneLab' },
      { name: 'James Okafor', email: 'james.okafor@dronelab.org', institution: 'DroneLab' },
    ];
    
    await Author.insertMany(authors);
    console.log('Authors seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });