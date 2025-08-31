const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/profile - Get profile information
router.get('/', async (req, res) => {
  try {
    const profile = await db.get('SELECT * FROM profile LIMIT 1');
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile data available. Please create a profile first.'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch profile information'
    });
  }
});

// POST /api/profile - Create new profile
router.post('/', async (req, res) => {
  try {
    const { name, email, education, github, linkedin, portfolio } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required fields'
      });
    }
    
    // Check if profile already exists
    const existingProfile = await db.get('SELECT id FROM profile LIMIT 1');
    if (existingProfile) {
      return res.status(409).json({
        error: 'Profile already exists',
        message: 'A profile already exists. Use PUT to update instead.'
      });
    }
    
    // Insert new profile
    const result = await db.run(
      'INSERT INTO profile (name, email, education, github, linkedin, portfolio) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, education || null, github || null, linkedin || null, portfolio || null]
    );
    
    const newProfile = await db.get('SELECT * FROM profile WHERE id = ?', [result.id]);
    
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: newProfile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create profile'
    });
  }
});

// PUT /api/profile - Update existing profile
router.put('/', async (req, res) => {
  try {
    const { name, email, education, github, linkedin, portfolio } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required fields'
      });
    }
    
    // Check if profile exists
    const existingProfile = await db.get('SELECT id FROM profile LIMIT 1');
    if (!existingProfile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'No profile exists to update. Create one first with POST.'
      });
    }
    
    // Update profile
    await db.run(
      'UPDATE profile SET name = ?, email = ?, education = ?, github = ?, linkedin = ?, portfolio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, education || null, github || null, linkedin || null, portfolio || null, existingProfile.id]
    );
    
    const updatedProfile = await db.get('SELECT * FROM profile WHERE id = ?', [existingProfile.id]);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
