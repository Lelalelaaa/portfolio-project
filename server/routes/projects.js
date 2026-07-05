// projects.js
// This file handles all the API routes for projects.
// It connects to MongoDB to get, add, edit, or delete projects.
//
// Routes:
//   GET    /api/projects        = get all projects
//   GET    /api/projects/:id    = get one project by ID
//   POST   /api/projects        = add a new project
//   PUT    /api/projects/:id    = update a project
//   DELETE /api/projects/:id    = delete a project

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects — sorted by newest first
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get one project by its ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server Error' });
  }
});

// Add a new project
router.post('/', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const project = await newProject.save();
    res.status(201).json(project); // 201 means "something was created"
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: 'Failed to create project', details: err.message });
  }
});

// Update an existing project — only changes the fields that are sent
router.put('/:id', async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // $set means "only update these specific fields, leave everything else alone"
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // new: true returns the updated version
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid ID' });
    res.status(400).json({ error: 'Failed to update project', details: err.message });
  }
});

// Delete a project permanently
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.isDefault) {
      return res.status(403).json({ error: 'Default projects cannot be deleted.' });
    }

    await project.deleteOne();
    res.json({ msg: 'Project removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
