const mongoose = require('mongoose');
const Publication = require('./models/Publication');
const NewsArticle = require('./models/NewsArticle');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    
    const publications = [
      {
        title: 'Predicting human perception of the urban environment in a spatiotemporal urban setting using locally acquired street view images and audio clips',
        authors: [
          { name: 'Deepak Verma', email: 'deepak.verma@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
          { name: 'Krithi Ramamritham', email: 'krithi.ramamritham@dronelab.org' },
        ],
        journal: 'Building and Environment',
        year: 2020,
        doi: 'https://doi.org/10.1016/j.buildenv.2020.107340',
        abstract: 'This paper presents a novel approach to predict human perception of urban environments using street view images and audio clips collected locally.',
        category: 'journal',
        citations: 107,
      },
      {
        title: 'Transfer learning approach to map urban slums using high and medium resolution satellite imagery',
        authors: [
          { name: 'Deepak Verma', email: 'deepak.verma@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
          { name: 'Krithi Ramamritham', email: 'krithi.ramamritham@dronelab.org' },
        ],
        journal: 'Habitat International',
        year: 2019,
        doi: 'https://doi.org/10.1016/j.habitatint.2019.101981',
        abstract: 'This study explores transfer learning techniques to map urban slums using satellite imagery at different resolutions.',
        category: 'journal',
        citations: 109,
      },
      {
        title: 'Impact of ICT on multitasking during travel and the value of travel time savings: Empirical evidences from Mumbai, India',
        authors: [
          { name: 'Varun Varghese', email: 'varun.varghese@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
        ],
        journal: 'Travel Behaviour and Society',
        year: 2018,
        doi: 'https://doi.org/10.1016/j.tbs.2018.03.003',
        abstract: 'This paper examines the impact of ICT on multitasking during travel and its implications for the value of travel time savings.',
        category: 'journal',
        citations: 111,
      },
      {
        title: 'Mumbai slums since independence: Evaluating the policy outcomes',
        authors: [
          { name: 'Ronita Bardhan', email: 'ronita.bardhan@dronelab.org' },
          { name: 'Ahana Sarkar', email: 'ahana.sarkar@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
          { name: 'Nagendra R. Velaga', email: 'nagendra.velaga@dronelab.org' },
        ],
        journal: 'Habitat International',
        year: 2015,
        doi: 'https://doi.org/10.1016/j.habitatint.2015.07.009',
        abstract: 'This paper evaluates policy outcomes for Mumbai slums since independence and their implications for urban housing.',
        category: 'journal',
        citations: 158,
      },
      {
        title: 'A good-governance framework for urban management',
        authors: [
          { name: 'Rohan Biswas', email: 'rohan.biswas@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
          { name: 'Kavi Arya', email: 'kavi.arya@dronelab.org' },
          { name: 'Krithi Ramamritham', email: 'krithi.ramamritham@dronelab.org' },
        ],
        journal: 'Journal of Urban Management',
        year: 2019,
        doi: 'https://doi.org/10.1016/j.jum.2018.12.001',
        abstract: 'This paper proposes a good-governance framework for effective urban management in developing nations.',
        category: 'journal',
        citations: 141,
      },
      {
        title: 'Interpreting the energy choices and environmental satisfaction determinants in low-income housing typologies: Cases from slums and slum rehabilitation housing of Mumbai, India',
        authors: [
          { name: 'Ahana Sarkar', email: 'ahana.sarkar@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
        ],
        journal: 'Cities',
        year: 2023,
        doi: 'https://doi.org/10.1016/j.cities.2023.104576',
        abstract: 'This study examines the determinants of energy choices and environmental satisfaction in low-income housing typologies in Mumbai.',
        category: 'journal',
        citations: 17,
      },
      {
        title: 'Exploring the limits of energy use in urban poor communities',
        authors: [
          { name: 'Ahana Sarkar', email: 'ahana.sarkar@dronelab.org' },
          { name: 'Arnab Jana', email: 'arnab.jana@dronelab.org' },
        ],
        journal: 'Nature Cities',
        year: 2025,
        doi: 'https://doi.org/10.1038/s44284-025-00123-4',
        abstract: 'This paper explores the limits of energy use in urban poor communities and implications for sustainable development.',
        category: 'journal',
        citations: 1,
      },
    ];

    const newsArticles = [
      {
        title: 'DroneLab Secures $2M Grant for Autonomous Navigation Research',
        content: 'We are excited to announce that our lab has secured a $2 million grant to advance autonomous navigation research.',
        category: 'announcement',
        date: new Date('2025-03-15'),
        author: 'Dr. Sarah Chen',
        featured: true,
      },
      {
        title: 'Best Paper Award at International Conference on Robotics',
        content: 'Our team received the Best Paper Award for our work on swarm coordination algorithms.',
        category: 'achievement',
        date: new Date('2025-02-01'),
        author: 'Dr. Raj Patel',
        featured: true,
      },
      {
        title: 'New Drone Lab Facility Opening',
        content: 'Join us for the grand opening of our new state-of-the-art drone testing facility.',
        category: 'event',
        date: new Date('2025-01-20'),
        author: 'Admin',
        featured: false,
      },
    ];

    await Publication.insertMany(publications);
    console.log('Inserted', publications.length, 'publications');

    await NewsArticle.insertMany(newsArticles);
    console.log('Inserted', newsArticles.length, 'news articles');

    console.log('Data restored successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });