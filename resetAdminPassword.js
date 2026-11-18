const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ username: 'admin' });
    if (user) {
      user.password = 'admin123';
      user.email = 'admin@dronelab.org';
      await user.save();
      console.log('Admin updated successfully!');
      console.log('Email: admin@dronelab.org');
      console.log('Password: admin123');
    } else {
      console.log('No admin user found');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });