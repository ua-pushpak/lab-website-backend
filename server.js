const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// 1. Import the Bouncer
const { verifyToken, requireAdmin } = require('./middleware');

dotenv.config();
const app = express();

// 2. Security & Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: 'https://ua-pushpak.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 3. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// 4. Routes
// PUBLIC ROUTES (Everyone can see)
app.use('/api/projects', require('./routes/projects'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/team', require('./routes/team'));
app.use('/api/news', require('./routes/news'));
app.use('/api/site-settings', require('./routes/siteSettings'));
app.use('/api/auth', verifyToken, requireAdmin, require('./routes/auth'));

// PROTECTED ROUTES (Bouncer checks JWT + Admin role)
app.use('/api/database', verifyToken, requireAdmin, require('./routes/database'));
app.use('/api/system', verifyToken, requireAdmin, require('./routes/system'));
app.use('/api/versions', verifyToken, requireAdmin, require('./routes/versions'));
app.use('/api/export', verifyToken, requireAdmin, require('./routes/export'));
app.use('/api/upload', verifyToken, requireAdmin, require('./routes/upload'));
app.use('/api/analytics', verifyToken, requireAdmin, require('./routes/analytics'));
app.use('/api/authors', verifyToken, requireAdmin, require('./routes/authors'));
app.use('/api/import', verifyToken, requireAdmin, require('./routes/importPublications'));
app.use('/api/backup', verifyToken, requireAdmin, require('./routes/backup'));

// Public Contact route
app.use('/api/contact', require('./routes/contact'));

// 5. Base routes
app.get('/', (req, res) => {
    res.json({ message: 'Drone Research Lab API', status: 'running' });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// 6. Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drone_research_lab';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });

// 7. Error Handling
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

process.on('SIGINT', () => {
    mongoose.connection.close();
    process.exit(0);
});