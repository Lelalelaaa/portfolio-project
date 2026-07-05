// Project.js
// This defines what a "project" looks like when stored in MongoDB.
// Think of it like a template — every project must follow this structure.

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:         { type: String, required: [true, 'Project title is required'], trim: true },
  description:   { type: String, required: [true, 'Description is required'] }, // Short summary shown on the card
  problem:       { type: String },          // The problem the project was solving
  technologies:  { type: [String], default: [] }, // e.g. ['React', 'Node.js']
  imageUrl:      { type: String },          // Path or URL to the project screenshot
  githubUrl:     { type: String },          // Link to the GitHub repo
  liveUrl:       { type: String },          // Link to the live demo
  contribution:  { type: String },          // What the student specifically did
  challenges:    { type: String },          // Difficulties faced during the project
  lessonsLearned:{ type: String },          // What was learned from the project
  featured:      { type: Boolean, default: false }, // Whether to highlight this project
  createdAt:     { type: Date, default: Date.now }  // Automatically set when created
});

module.exports = mongoose.model('Project', projectSchema);
