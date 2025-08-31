const db = require('../database/db');

const seedData = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    education: 'Bachelor of Science in Computer Science, University of Technology',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    portfolio: 'https://johndoe.dev'
  },
  
  skills: [
    { name: 'JavaScript', proficiency: 5, category: 'Frontend' },
    { name: 'Python', proficiency: 4, category: 'Backend' },
    { name: 'React', proficiency: 5, category: 'Frontend' },
    { name: 'Node.js', proficiency: 4, category: 'Backend' },
    { name: 'SQL', proficiency: 4, category: 'Database' },
    { name: 'MongoDB', proficiency: 3, category: 'Database' },
    { name: 'Docker', proficiency: 3, category: 'DevOps' },
    { name: 'Git', proficiency: 5, category: 'Tools' },
    { name: 'TypeScript', proficiency: 4, category: 'Frontend' },
    { name: 'Express.js', proficiency: 4, category: 'Backend' }
  ],
  
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
      github_link: 'https://github.com/johndoe/ecommerce-platform',
      live_link: 'https://ecommerce-demo.johndoe.dev'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      github_link: 'https://github.com/johndoe/task-manager',
      live_link: 'https://tasks.johndoe.dev'
    },
    {
      title: 'Weather Dashboard',
      description: 'A weather application that displays current weather conditions and forecasts using OpenWeatherMap API with beautiful visualizations.',
      github_link: 'https://github.com/johndoe/weather-dashboard',
      live_link: 'https://weather.johndoe.dev'
    },
    {
      title: 'Portfolio Website',
      description: 'A responsive portfolio website built with modern web technologies showcasing projects and skills.',
      github_link: 'https://github.com/johndoe/portfolio',
      live_link: 'https://johndoe.dev'
    }
  ],
  
  workExperience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      description: 'Led development of multiple web applications, mentored junior developers, and implemented best practices for code quality and testing.',
      start_date: '2022-01-01',
      end_date: null,
      current: true
    },
    {
      company: 'Digital Innovations Ltd.',
      position: 'Frontend Developer',
      description: 'Developed responsive user interfaces using React and modern CSS frameworks, collaborated with design team to implement pixel-perfect designs.',
      start_date: '2020-06-01',
      end_date: '2021-12-31',
      current: false
    },
    {
      company: 'StartupXYZ',
      position: 'Junior Developer',
      description: 'Built and maintained various web applications, learned modern development practices and technologies.',
      start_date: '2019-01-01',
      end_date: '2020-05-31',
      current: false
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Initialize database first
    await db.initialize();
    console.log('Database initialized successfully');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await db.run('DELETE FROM project_skills');
    await db.run('DELETE FROM projects');
    await db.run('DELETE FROM skills');
    await db.run('DELETE FROM work_experience');
    await db.run('DELETE FROM profile');
    console.log('Existing data cleared');
    
    // Insert profile
    const profileResult = await db.run(
      'INSERT INTO profile (name, email, education, github, linkedin, portfolio) VALUES (?, ?, ?, ?, ?, ?)',
      [seedData.profile.name, seedData.profile.email, seedData.profile.education, 
       seedData.profile.github, seedData.profile.linkedin, seedData.profile.portfolio]
    );
    console.log('Profile seeded successfully');
    
    // Insert skills and collect their IDs
    const skillIds = [];
    for (const skill of seedData.skills) {
      const skillResult = await db.run(
        'INSERT INTO skills (name, proficiency, category) VALUES (?, ?, ?)',
        [skill.name, skill.proficiency, skill.category]
      );
      skillIds.push(skillResult.id);
    }
    console.log('Skills seeded successfully');
    
    // Insert projects
    for (const project of seedData.projects) {
      const projectResult = await db.run(
        'INSERT INTO projects (title, description, github_link, live_link) VALUES (?, ?, ?, ?)',
        [project.title, project.description, project.github_link, project.live_link]
      );
      
      // Link projects to skills using actual skill IDs from database
      const projectSkills = skillIds.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 skills per project
      
      for (const skillId of projectSkills) {
        await db.run(
          'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
          [projectResult.id, skillId]
        );
      }
    }
    console.log('Projects seeded successfully');
    
    // Insert work experience
    for (const work of seedData.workExperience) {
      await db.run(
        'INSERT INTO work_experience (company, position, description, start_date, end_date, current) VALUES (?, ?, ?, ?, ?, ?)',
        [work.company, work.position, work.description, work.start_date, work.end_date, work.current]
      );
    }
    console.log('Work experience seeded successfully');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
