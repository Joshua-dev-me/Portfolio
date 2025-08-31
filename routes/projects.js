const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/projects - Get all projects with optional skill filtering
router.get('/', async (req, res) => {
  try {
    const { skill } = req.query;
    
    let projects;
    let query;
    let params = [];
    
    if (skill) {
      // Filter projects by skill
      query = `
        SELECT DISTINCT p.*, GROUP_CONCAT(s.name) as skills
        FROM projects p
        LEFT JOIN project_skills ps ON p.id = ps.project_id
        LEFT JOIN skills s ON ps.skill_id = s.id
        WHERE s.name LIKE ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      params = [`%${skill}%`];
    } else {
      // Get all projects with their skills
      query = `
        SELECT p.*, GROUP_CONCAT(s.name) as skills
        FROM projects p
        LEFT JOIN project_skills ps ON p.id = ps.project_id
        LEFT JOIN skills s ON ps.skill_id = s.id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
    }
    
    projects = await db.all(query, params);
    
    // Process skills string into array
    projects = projects.map(project => ({
      ...project,
      skills: project.skills ? project.skills.split(',').map(s => s.trim()) : []
    }));
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await db.get(`
      SELECT p.*, GROUP_CONCAT(s.name) as skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `No project found with ID ${id}`
      });
    }
    
    // Process skills string into array
    project.skills = project.skills ? project.skills.split(',').map(s => s.trim()) : [];
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { title, description, github_link, live_link, skills } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and description are required fields'
      });
    }
    
    // Insert new project
    const result = await db.run(
      'INSERT INTO projects (title, description, github_link, live_link) VALUES (?, ?, ?, ?)',
      [title, description, github_link || null, live_link || null]
    );
    
    // If skills are provided, link them to the project
    if (skills && Array.isArray(skills) && skills.length > 0) {
      for (const skillName of skills) {
        // Find skill by name
        const skill = await db.get('SELECT id FROM skills WHERE name = ?', [skillName]);
        if (skill) {
          await db.run(
            'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
            [result.id, skill.id]
          );
        }
      }
    }
    
    const newProject = await db.get(`
      SELECT p.*, GROUP_CONCAT(s.name) as skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [result.id]);
    
    // Process skills string into array
    newProject.skills = newProject.skills ? newProject.skills.split(',').map(s => s.trim()) : [];
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update existing project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_link, live_link, skills } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and description are required fields'
      });
    }
    
    // Check if project exists
    const existingProject = await db.get('SELECT id FROM projects WHERE id = ?', [id]);
    if (!existingProject) {
      return res.status(404).json({
        error: 'Project not found',
        message: `No project found with ID ${id}`
      });
    }
    
    // Update project
    await db.run(
      'UPDATE projects SET title = ?, description = ?, github_link = ?, live_link = ? WHERE id = ?',
      [title, description, github_link || null, live_link || null, id]
    );
    
    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      // Remove existing skill links
      await db.run('DELETE FROM project_skills WHERE project_id = ?', [id]);
      
      // Add new skill links
      for (const skillName of skills) {
        const skill = await db.get('SELECT id FROM skills WHERE name = ?', [skillName]);
        if (skill) {
          await db.run(
            'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
            [id, skill.id]
          );
        }
      }
    }
    
    const updatedProject = await db.get(`
      SELECT p.*, GROUP_CONCAT(s.name) as skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    // Process skills string into array
    updatedProject.skills = updatedProject.skills ? updatedProject.skills.split(',').map(s => s.trim()) : [];
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const existingProject = await db.get('SELECT id FROM projects WHERE id = ?', [id]);
    if (!existingProject) {
      return res.status(404).json({
        error: 'Project not found',
        message: `No project found with ID ${id}`
      });
    }
    
    // Delete project (project_skills will be deleted automatically due to CASCADE)
    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;
