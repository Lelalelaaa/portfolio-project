// ProjectDetails.jsx
// This page shows the full case study for a single project.
// It reads the project ID from the URL, fetches that project from
// the backend, and displays all its details.
//
// Example URL: /projects/64abc123...

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../services/api';
import { ArrowLeft, Code, ExternalLink } from 'lucide-react';

const ProjectDetails = () => {
  // Get the project ID from the URL
  const { id } = useParams();

  // Store the project data, loading status, and any error
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // When the page loads, fetch the project from the backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        setProject(res.data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false); // Stop showing loading state either way
      }
    };

    fetchProject();
  }, [id]);

  // While waiting for data, show a blank page (avoids ugly flash of text)
  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}></div>;

  // If something went wrong, show an error message
  if (error) return <div className="container section" style={{ textAlign: 'center', marginTop: '100px' }}>{error}</div>;

  if (!project) return null;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh' }}>
      <div className="container">

        {/* Button to go back to the projects section on the homepage */}
        <a href="/#projects" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Projects
        </a>

        {/* Project title */}
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{project.title}</h1>

        {/* List of technology tags */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {project.technologies.map((tech, i) => (
            <span key={i} style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Project screenshot — anchored to the top so the header of the image is always visible */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', objectPosition: 'top center', borderRadius: '12px', marginBottom: '3rem' }}
          />
        )}

        {/* Two-column layout: left = writeup, right = sidebar links
            On mobile screens these stack into one column automatically */}
        <div className="project-layout">

          {/* LEFT: Project writeup */}
          <div>
            {/* Overview — always shown */}
            <section style={{ marginBottom: '2rem' }}>
              <h2>Overview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>{project.description}</p>
            </section>

            {/* These sections only show if the field has content saved in the database */}
            {project.problem && (
              <section style={{ marginBottom: '2rem' }}>
                <h2>Problem Addressed</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>{project.problem}</p>
              </section>
            )}

            {project.challenges && (
              <section style={{ marginBottom: '2rem' }}>
                <h2>Challenges &amp; Solutions</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>{project.challenges}</p>
              </section>
            )}

            {project.lessonsLearned && (
              <section style={{ marginBottom: '2rem' }}>
                <h2>Lessons Learned</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>{project.lessonsLearned}</p>
              </section>
            )}
          </div>

          {/* RIGHT: Sidebar with links and contribution info */}
          <div>
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Project Links</h3>

              {/* If there's a GitHub link, show a clickable button. If not, show a disabled one. */}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginBottom: '1rem' }}>
                  <Code size={18} /> View Source Code
                </a>
              ) : (
                <button className="btn btn-outline" disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginBottom: '1rem', opacity: 0.6, cursor: 'not-allowed' }}>
                  <Code size={18} /> GitHub Not Available
                </button>
              )}

              {/* Same idea for the live demo link */}
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                  <ExternalLink size={18} /> Live Demo
                </a>
              ) : (
                <button className="btn btn-primary" disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
                  <ExternalLink size={18} /> Demo Not Ready
                </button>
              )}

              <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

              {/* My contribution to this project */}
              <h3 style={{ marginBottom: '1rem' }}>My Contribution</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>
                {project.contribution || 'Full-stack development'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
