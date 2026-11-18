const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find().select('-password');
    console.log('Existing users:');
    users.forEach(user => {
      console.log('-', user.username, '|', user.email, '|', user.role);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });