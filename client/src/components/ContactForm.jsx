import React, { useState } from 'react';
import { submitContactMessage } from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactMessage(formData);
      setStatus({ type: 'success', msg: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      {status && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          backgroundColor: status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
          color: 'white'
        }}>
          {status.msg}
        </div>
      )}
      <div className="form-group">
        <label className="form-label">Name</label>
        <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Subject</label>
        <input type="text" name="subject" className="form-control" required value={formData.subject} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea name="message" className="form-control" rows="5" required value={formData.message} onChange={handleChange}></textarea>
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
    </form>
  );
};

export default ContactForm;
