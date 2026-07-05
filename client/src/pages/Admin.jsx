import React, { useEffect, useState } from 'react';
import { getProjects, createProject, deleteProject, getMessages, updateProject } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Edit } from 'lucide-react';

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', problem: '', technologies: '', imageUrl: '',
    githubUrl: '', liveUrl: '', contribution: '', challenges: '', lessonsLearned: ''
  });

  const fetchData = async () => {
    try {
      const pRes = await getProjects();
      setProjects(pRes.data);
      const mRes = await getMessages();
      setMessages(mRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      problem: project.problem || '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      contribution: project.contribution || '',
      challenges: project.challenges || '',
      lessonsLearned: project.lessonsLearned || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '', description: '', problem: '', technologies: '', imageUrl: '',
      githubUrl: '', liveUrl: '', contribution: '', challenges: '', lessonsLearned: ''
    });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim())
      };
      if (editingId) {
        await updateProject(editingId, dataToSubmit);
        alert('Project updated successfully!');
      } else {
        await createProject(dataToSubmit);
        alert('Project created successfully!');
      }
      handleCancelEdit();
      fetchData(); // Refresh list
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchData(); // Refresh
      } catch (err) {
        alert('Error deleting project');
      }
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}></div>;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="container">
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Website
        </Link>
        <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        <div className="admin-layout">
          {/* Add/Edit Project Form */}
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={24}/> {editingId ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmitProject}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input type="text" name="title" className="form-control" required value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea name="description" className="form-control" required value={formData.description} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Technologies (comma separated)</label>
                <input type="text" name="technologies" className="form-control" placeholder="React, Node, MongoDB" value={formData.technologies} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL or path (e.g. https://... or /project1.png)</label>
                <input type="text" name="imageUrl" className="form-control" placeholder="https://example.com/image.png" value={formData.imageUrl} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Problem Addressed</label>
                <textarea name="problem" className="form-control" value={formData.problem} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Challenges</label>
                <textarea name="challenges" className="form-control" value={formData.challenges} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Lessons Learned</label>
                <textarea name="lessonsLearned" className="form-control" value={formData.lessonsLearned} onChange={handleInputChange}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">GitHub URL</label>
                  <input type="url" name="githubUrl" className="form-control" value={formData.githubUrl} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Live URL</label>
                  <input type="url" name="liveUrl" className="form-control" value={formData.liveUrl} onChange={handleInputChange} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Save Changes' : 'Create Project'}</button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* Manage Projects & Messages */}
          <div>
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Manage Projects</h2>
              {projects.length === 0 ? <p>No projects found.</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {projects.map(p => (
                    <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <span>{p.title}</span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => handleEditClick(p)} style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}>
                          <Edit size={20} />
                        </button>
                        {!p.isDefault && (
                          <button type="button" onClick={() => handleDeleteProject(p._id)} style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                            <Trash2 size={20} />
                          </button>
                        )}
                        {p.isDefault && (
                          <span title="Default projects cannot be deleted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center' }}>🔒</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Contact Messages</h2>
              {messages.length === 0 ? <p>No messages yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map(m => (
                    <div key={m._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <p><strong>From:</strong> {m.name} ({m.email})</p>
                      <p><strong>Subject:</strong> {m.subject}</p>
                      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{m.message}</p>
                      <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>{new Date(m.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
