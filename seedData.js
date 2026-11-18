const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Publication = require('./models/Publication');
const TeamMember = require('./models/TeamMember');
const NewsArticle = require('./models/NewsArticle');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Sample team members
const teamMembers = [
    {
        name: 'Dr. Sarah Chen',
        nameHindi: 'डॉ. सारा चेन',
        title: 'Principal Investigator',
        titleHindi: 'मुख्य अन्वेषक',
        role: 'PI',
        email: 'sarah.chen@dronelab.org',
        photoUrl: 'https://picsum.photos/200/200?random=301',
        bio: 'Leading expert in autonomous systems with 15+ years of experience.',
        researchInterests: ['Autonomous Navigation', 'AI/ML', 'Robotics'],
        socialLinks: {
            linkedin: 'https://linkedin.com/in/sarahchen',
            github: 'https://github.com/sarahchen',
            twitter: 'https://twitter.com/sarahchen',
            googleScholar: 'https://scholar.google.com/citations?user=sarahchen',
        },
        skills: [
            { label: 'Autonomy', value: 95 },
            { label: 'AI/ML', value: 90 },
            { label: 'Robotics', value: 85 },
            { label: 'Vision', value: 80 },
            { label: 'Control', value: 88 },
            { label: 'Safety', value: 92 },
        ],
        featured: true,
    },
    {
        name: 'Dr. Raj Patel',
        nameHindi: 'डॉ. राज पटेल',
        title: 'Co-Principal Investigator',
        titleHindi: 'सह-मुख्य अन्वेषक',
        role: 'Co-PI',
        email: 'raj.patel@dronelab.org',
        photoUrl: 'https://picsum.photos/200/200?random=302',
        bio: 'Specialist in swarm intelligence and multi-agent systems.',
        researchInterests: ['Swarm Intelligence', 'Multi-Agent Systems', 'Distributed Control'],
        socialLinks: {
            linkedin: 'https://linkedin.com/in/rajpatel',
            github: 'https://github.com/rajpatel',
            googleScholar: 'https://scholar.google.com/citations?user=rajpatel',
        },
        skills: [
            { label: 'Autonomy', value: 85 },
            { label: 'AI/ML', value: 88 },
            { label: 'Robotics', value: 92 },
            { label: 'Vision', value: 75 },
            { label: 'Control', value: 90 },
            { label: 'Safety', value: 85 },
        ],
        featured: true,
    },
    {
        name: 'Alex Kim',
        nameHindi: 'एलेक्स किम',
        title: 'Research Scientist',
        titleHindi: 'अनुसंधान वैज्ञानिक',
        role: 'researcher',
        email: 'alex.kim@dronelab.org',
        photoUrl: 'https://picsum.photos/200/200?random=304',
        bio: 'Focusing on computer vision and deep learning for aerial systems.',
        researchInterests: ['Computer Vision', 'Deep Learning', 'Object Detection'],
        socialLinks: {
            github: 'https://github.com/alexkim',
            linkedin: 'https://linkedin.com/in/alexkim',
        },
        skills: [
            { label: 'Vision', value: 92 },
            { label: 'AI/ML', value: 88 },
            { label: 'Robotics', value: 70 },
            { label: 'Control', value: 65 },
        ],
        featured: false,
    },
];

// Sample projects
const projects = [
    {
        title: 'Autonomous Navigation System',
        titleHindi: 'स्वायत्त नेविगेशन प्रणाली',
        description: 'Developing advanced algorithms for obstacle avoidance and path planning in complex environments.',
        descriptionHindi: 'जटिल वातावरण में बाधा से बचाव और पथ नियोजन के लिए उन्नत एल्गोरिदम विकसित करना।',
        status: 'ongoing',
        category: 'Autonomy',
        imageUrl: 'https://picsum.photos/800/600?random=401',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        technologies: ['ROS2', 'Python', 'C++', 'LiDAR', 'SLAM'],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-12-31'),
        funding: 500000,
        progress: 75,
        tags: ['autonomy', 'navigation', 'obstacle-avoidance'],
        featured: true,
        metrics: {
            flights_completed: 1200,
            success_rate: 98.5,
            avg_flight_time: 45,
            data_collected: '2.5 TB',
        },
    },
    {
        title: 'Swarm Intelligence for Aerial Systems',
        titleHindi: 'हवाई प्रणालियों के लिए स्वार्म इंटेलिजेंस',
        description: 'Coordinating multiple drones for complex missions including search and rescue, surveillance, and mapping.',
        descriptionHindi: 'खोज और बचाव, निगरानी और मानचित्रण सहित जटिल मिशनों के लिए कई ड्रोनों का समन्वय।',
        status: 'ongoing',
        category: 'Swarm',
        imageUrl: 'https://picsum.photos/800/600?random=402',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        technologies: ['Python', 'ROS2', 'MATLAB', '5G'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-06-30'),
        funding: 750000,
        progress: 60,
        tags: ['swarm', 'coordination', 'multi-agent'],
        featured: true,
        metrics: {
            flights_completed: 850,
            success_rate: 95.2,
            avg_flight_time: 60,
            data_collected: '4.2 TB',
        },
    },
    {
        title: 'AI-Powered Computer Vision for Drones',
        titleHindi: 'ड्रोन के लिए AI-संचालित कंप्यूटर विज़न',
        description: 'Real-time object detection and tracking for aerial surveillance and inspection.',
        descriptionHindi: 'हवाई निगरानी और निरीक्षण के लिए वास्तविक समय वस्तु पहचान और ट्रैकिंग।',
        status: 'completed',
        category: 'Vision',
        imageUrl: 'https://picsum.photos/800/600?random=403',
        videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        technologies: ['PyTorch', 'TensorFlow', 'CUDA', 'OpenCV'],
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-12-31'),
        funding: 600000,
        progress: 100,
        tags: ['computer-vision', 'deep-learning', 'object-detection'],
        featured: true,
        metrics: {
            flights_completed: 2000,
            success_rate: 97.8,
            avg_flight_time: 35,
            data_collected: '5.8 TB',
        },
    },
];

// Sample publications
const publications = [
    {
        title: 'Deep Learning Approaches for Autonomous Drone Navigation',
        titleHindi: 'स्वायत्त ड्रोन नेविगेशन के लिए डीप लर्निंग दृष्टिकोण',
        authors: ['Sarah Chen', 'Alex Kim', 'Raj Patel'],
        journal: 'IEEE Transactions on Robotics',
        year: 2025,
        doi: '10.1109/TRO.2025.1234567',
        abstract: 'This paper presents novel deep learning approaches for autonomous drone navigation in complex environments.',
        category: 'journal',
        citations: 45,
        featured: true,
        tags: ['deep-learning', 'navigation', 'autonomy'],
    },
    {
        title: 'Swarm Coordination Algorithms for Multi-Drone Systems',
        titleHindi: 'मल्टी-ड्रोन प्रणालियों के लिए स्वार्म समन्वय एल्गोरिदम',
        authors: ['Raj Patel', 'Sarah Chen'],
        journal: 'Science Robotics',
        year: 2024,
        doi: '10.1126/scirobotics.2024.9876543',
        abstract: 'We propose new algorithms for coordinating large-scale drone swarms for complex missions.',
        category: 'journal',
        citations: 32,
        featured: true,
        tags: ['swarm', 'coordination', 'multi-agent'],
    },
    {
        title: 'Real-Time Object Detection for Aerial Surveillance',
        titleHindi: 'हवाई निगरानी के लिए वास्तविक समय वस्तु पहचान',
        authors: ['Alex Kim', 'Priya Sharma'],
        journal: 'CVPR 2024',
        year: 2024,
        doi: '10.1109/CVPR.2024.1111111',
        abstract: 'A novel approach to real-time object detection specifically optimized for aerial surveillance applications.',
        category: 'conference',
        citations: 18,
        featured: false,
        tags: ['computer-vision', 'object-detection', 'real-time'],
    },
];

// Sample news articles
const newsArticles = [
    {
        title: 'DroneLab Secures $2M Grant for Autonomous Navigation Research',
        titleHindi: 'ड्रोनलैब ने स्वायत्त नेविगेशन अनुसंधान के लिए $2M अनुदान प्राप्त किया',
        content: 'We are excited to announce that our lab has secured a $2 million grant to advance autonomous navigation research.',
        category: 'announcement',
        imageUrl: 'https://picsum.photos/800/400?random=501',
        date: new Date('2025-03-15'),
        author: 'Dr. Sarah Chen',
        tags: ['grant', 'funding', 'autonomy'],
        featured: true,
    },
    {
        title: 'Best Paper Award at International Conference on Robotics',
        titleHindi: 'रोबोटिक्स पर अंतर्राष्ट्रीय सम्मेलन में सर्वश्रेष्ठ पेपर पुरस्कार',
        content: 'Our team received the Best Paper Award for our work on swarm coordination algorithms.',
        category: 'achievement',
        imageUrl: 'https://picsum.photos/800/400?random=502',
        date: new Date('2025-02-01'),
        author: 'Dr. Raj Patel',
        tags: ['award', 'achievement'],
        featured: true,
    },
];

// Seed function
async function seedDatabase() {
    try {
        // Clear existing data
        await Promise.all([
            Project.deleteMany({}),
            Publication.deleteMany({}),
            TeamMember.deleteMany({}),
            NewsArticle.deleteMany({}),
        ]);

        console.log('Cleared existing data');

        // Insert team members
        const createdMembers = await TeamMember.insertMany(teamMembers);
        console.log(`Inserted ${createdMembers.length} team members`);

        // Map team member IDs to projects
        projects[0].teamMembers = [createdMembers[0]._id, createdMembers[2]._id];
        projects[1].teamMembers = [createdMembers[0]._id, createdMembers[1]._id];
        projects[2].teamMembers = [createdMembers[0]._id, createdMembers[2]._id];

        // Insert projects
        const createdProjects = await Project.insertMany(projects);
        console.log(`Inserted ${createdProjects.length} projects`);

        // Insert publications
        const createdPublications = await Publication.insertMany(publications);
        console.log(`Inserted ${createdPublications.length} publications`);

        // Link publications to team members
        await TeamMember.findByIdAndUpdate(createdMembers[0]._id, {
            publications: [createdPublications[0]._id, createdPublications[1]._id],
        });
        await TeamMember.findByIdAndUpdate(createdMembers[1]._id, {
            publications: [createdPublications[0]._id, createdPublications[1]._id],
        });
        await TeamMember.findByIdAndUpdate(createdMembers[2]._id, {
            publications: [createdPublications[0]._id, createdPublications[2]._id],
        });

        // Insert news articles
        const createdNews = await NewsArticle.insertMany(newsArticles);
        console.log(`Inserted ${createdNews.length} news articles`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();