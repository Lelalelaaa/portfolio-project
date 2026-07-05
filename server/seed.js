require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const projects = [
  {
    title: 'Personal Developer Portfolio',
    description: 'A modern, full-stack personal portfolio designed with a focus on User Experience (UX), F-pattern layout scanning, and responsive design. Built to showcase academic projects and technical skills.',
    problem: 'Needed a professional online presence to display coursework and skills for internships.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Framer Motion'],
    imageUrl: '/project3.png',
    githubUrl: 'https://github.com/senghong/portfolio',
    liveUrl: '',
    contribution: 'Full-stack development, UX/UI design, database architecture.',
    challenges: 'Ensuring high performance and smooth animations without sacrificing accessibility.',
    lessonsLearned: 'Mastered React Router and MongoDB integration for dynamic content.',
    featured: true
  },
  {
    title: 'Interna (Internship Finder)',
    description: 'A UI/UX design project focused on creating a seamless and intuitive platform to help students find and apply for internships.',
    problem: 'Students struggle to find relevant internships due to cluttered and confusing interfaces on existing platforms.',
    technologies: ['Figma', 'UX Research', 'Prototyping', 'Wireframing'],
    imageUrl: '/project2.png',
    githubUrl: '',
    liveUrl: '',
    contribution: 'Lead UI/UX Designer handling user research, wireframing, and interactive prototyping.',
    challenges: 'Designing a search and filter system that was powerful but not overwhelming.',
    lessonsLearned: 'Gained deep insights into user-centered design principles and usability testing.',
    featured: true
  },
  {
    title: 'Classroom Engagement Platform',
    description: 'An interactive platform designed to boost student participation and track engagement in real-time during lectures.',
    problem: 'Students often hesitate to ask questions or engage in large classroom settings.',
    technologies: ['React', 'Firebase', 'Socket.io', 'Tailwind CSS'],
    imageUrl: '/project1.png',
    githubUrl: '',
    liveUrl: '',
    contribution: 'Frontend development and real-time socket integration.',
    challenges: 'Handling concurrent websocket connections for live polling.',
    lessonsLearned: 'Learned how to manage real-time state across multiple clients.',
    featured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    
    // Clear existing projects
    await Project.deleteMany();
    console.log('Cleared existing projects');
    
    // Insert new projects
    await Project.insertMany(projects);
    console.log('Successfully seeded 3 projects!');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
