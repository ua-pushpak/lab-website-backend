require('dotenv').config();

const mongoose = require('mongoose');

async function testDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connection successful!');
        console.log(`Connected to: ${mongoose.connection.host}`);
        console.log(`Database: ${mongoose.connection.name}`);

        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    } catch (error) {
        console.error('MongoDB connection failed:');
        console.error(error.message);
        process.exit(1);
    }
}

testDatabase();
