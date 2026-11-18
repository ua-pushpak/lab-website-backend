const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://ua-pushpak.github.io', 'http://localhost:3000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});





const helmet = require('helmet');
app.use(helmet());

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

const compression = require('compression');
app.use(compression());

app.use('/api/projects', require('./routes/projects'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/team', require('./routes/team'));
app.use('/api/news', require('./routes/news'));
app.use('/api/site-settings', require('./routes/siteSettings'));
app.use('/api/database', require('./routes/database'));
app.use('/api/system', require('./routes/system'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/versions', require('./routes/versions'));
app.use('/api/export', require('./routes/export'));
app.use('/api/upload', require('./routes/upload'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/import', require('./routes/importPublications'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/contact', require('./routes/contact'));




app.get('/', (req, res) => {
    res.json({ 
        message: 'Drone Research Lab API',
        status: 'running',
        version: '1.0.0',
        endpoints: {
            projects: '/api/projects',
            publications: '/api/publications',
            team: '/api/team',
            news: '/api/news',
            siteSettings: '/api/site-settings',
            database: '/api/database',
            system: '/api/system',
            auth: '/api/auth',
            versions: '/api/versions',
            export: '/api/export',
            upload: '/api/upload',
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date(),
    });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drone_research_lab';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
        
        const PORT = process.env.PORT || 5001;
        
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API available at: http://localhost:${PORT}`);
        });
        
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
                server.listen(PORT + 1);
            } else {
                console.error('Server error:', error);
            }
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});




app.use(helmet());


process.on('SIGINT', () => {
    console.log('Shutting down server...');
    mongoose.connection.close();
    process.exit(0);
});