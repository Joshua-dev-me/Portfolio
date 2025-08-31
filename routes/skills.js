const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/skills - Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await db.all(`
      SELECT * FROM skills 
      ORDER BY proficiency DESC, name ASC
    `);
    
    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skills'
    });
  }
});

// GET /api/skills/top - Get top skills by proficiency
router.get('/top', async (req, res) => {
  try {
    const { limit = 5, category } = req.query;
    
    let query = `
      SELECT * FROM skills 
      WHERE proficiency >= 4
    `;
    let params = [];
    
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    
    query += ` ORDER BY proficiency DESC, name ASC LIMIT ?`;
    params.push(parseInt(limit));
    
    const topSkills = await db.all(query, params);
    
    res.json({
      success: true,
      count: topSkills.length,
      data: topSkills
    });
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch top skills'
    });
  }
});

// GET /api/skills/categories - Get all skill categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.all(`
      SELECT DISTINCT category, COUNT(*) as skill_count
      FROM skills 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY skill_count DESC
    `);
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skill categories'
    });
  }
});

// GET /api/skills/:id - Get specific skill by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await db.get('SELECT * FROM skills WHERE id = ?', [id]);
    
    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: `No skill found with ID ${id}`
      });
    }
    
    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skill'
    });
  }
});

// POST /api/skills - Create new skill
router.post('/', async (req, res) => {
  try {
    const { name, proficiency, category } = req.body;
    
    // Validation
    if (!name || !proficiency) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and proficiency are required fields'
      });
    }
    
    if (proficiency < 1 || proficiency > 5) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Proficiency must be between 1 and 5'
      });
    }
    
    // Check if skill already exists
    const existingSkill = await db.get('SELECT id FROM skills WHERE name = ?', [name]);
    if (existingSkill) {
      return res.status(409).json({
        error: 'Skill already exists',
        message: `A skill with name "${name}" already exists`
      });
    }
    
    // Insert new skill
    const result = await db.run(
      'INSERT INTO skills (name, proficiency, category) VALUES (?, ?, ?)',
      [name, proficiency, category || null]
    );
    
    const newSkill = await db.get('SELECT * FROM skills WHERE id = ?', [result.id]);
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: newSkill
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create skill'
    });
  }
});

// PUT /api/skills/:id - Update existing skill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, proficiency, category } = req.body;
    
    // Validation
    if (!name || !proficiency) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and proficiency are required fields'
      });
    }
    
    if (proficiency < 1 || proficiency > 5) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Proficiency must be between 1 and 5'
      });
    }
    
    // Check if skill exists
    const existingSkill = await db.get('SELECT id FROM skills WHERE id = ?', [id]);
    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: `No skill found with ID ${id}`
      });
    }
    
    // Update skill
    await db.run(
      'UPDATE skills SET name = ?, proficiency = ?, category = ? WHERE id = ?',
      [name, proficiency, category || null, id]
    );
    
    const updatedSkill = await db.get('SELECT * FROM skills WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update skill'
    });
  }
});

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if skill exists
    const existingSkill = await db.get('SELECT id FROM skills WHERE id = ?', [id]);
    if (!existingSkill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: `No skill found with ID ${id}`
      });
    }
    
    // Delete skill
    await db.run('DELETE FROM skills WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete skill'
    });
  }
});

module.exports = router;
