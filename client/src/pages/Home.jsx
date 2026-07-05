import React, { useEffect, useState, useRef } from 'react';
import { getProjects, submitContactMessage } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react';



/* ─── Skeleton loader card ────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="project-card" style={{ pointerEvents: 'none' }}>
    <div className="skeleton" style={{ height: '200px', borderRadius: 0 }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: '12px', width: '40%' }} />
      <div className="skeleton" style={{ height: '20px', width: '75%' }} />
      <div className="skeleton" style={{ height: '14px', width: '90%' }} />
      <div className="skeleton" style={{ height: '14px', width: '60%' }} />
    </div>
  </div>
);

/* ─── Inline field validation ─────────────────────────────────── */
const validate = (name, value) => {
  if (!value.trim()) return `${name} is required`;
  if (name === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Enter a valid email address';
  return '';
};

/* ─── Main component ──────────────────────────────────────────── */
const Home = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [formData, setFormData]   = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [sending, setSending]     = useState(false);
  const formRef = useRef(null);
  const { hash } = useLocation();

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    // Disable browser's automatic scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash && !loading) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Erase the hash from the URL so a refresh puts us back at the top
          window.history.replaceState(null, '', window.location.pathname);
        }
      }, 100);
    } else if (!hash && !loading) {
      window.scrollTo(0, 0); // Always start at the top on a fresh load without a hash
    }
  }, [hash, loading]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  /* Real-time validation on blur */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(er => ({ ...er, [name]: validate(label, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      setErrors(er => ({ ...er, [name]: validate(label, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* Validate all fields before submit */
    const newErrors = {
      name:    validate('Name', formData.name),
      email:   validate('Email', formData.email),
      subject: validate('Subject', formData.subject),
      message: validate('Message', formData.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setSending(true);
    try {
      await submitContactMessage(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setSending(false);
    }
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <div>

      {/* ══════════════════════════════════════════════════════
          HERO — F-Pattern: Name top-left anchors the scan
          ══════════════════════════════════════════════════════ */}
      <section className="hero-section" id="home">

        {/* Row 1 of F — biggest, leftmost — eye lands here first */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* H1 is the NAME — not "Portfolio" (users scan for the person) */}
          <h1 className="hero-name">
            Hi, I'm <br />
            Chau Seng<span style={{ color: 'var(--primary-color)' }}>hong</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            marginTop: '0.75rem',
            letterSpacing: '0.5px'
          }}>
            Software Engineering Student at CamTech University
          </p>
        </motion.div>

        {/* Row 2 of F — tagline + CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 0' }}
        >
          <p style={{
            fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
            maxWidth: '560px',
            color: 'var(--text-muted)',
            lineHeight: 1.85,
            marginBottom: '2rem',
          }}>
            Building thoughtful software and user-centered experiences.
          </p>

          {/* CTAs — primary action most prominent (affordance hierarchy) */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary" id="hero-cta-projects">
              View My Work <ArrowRight size={16} />
            </a>
            <a href="#about" className="btn btn-outline">
              About Me
            </a>
          </div>
        </motion.div>

        {/* Bottom strip — context labels, not fake nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Scroll signifier — tells users there is more below */}
          <div className="scroll-indicator">
            <div className="arrow"><ArrowDown size={14} /></div>
            Scroll to explore
          </div>

        </motion.div>
      </section>



      {/* ══════════════════════════════════════════════════════
          ABOUT — 2-col: portrait left anchors F vertical bar
          ══════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'white' }} id="about">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label — small, uppercase, coloured: signifies section identity */}
            <p className="section-label">About Me</p>
            <h2 className="section-title">Hello, I am <span style={{ color: 'var(--primary-color)' }}>Chau Senghong</span></h2>
          </motion.div>

          <div className="about-grid" style={{ marginTop: '2.5rem' }}>

            {/* Left column — portrait + contact chips */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="portrait-frame">
                <img 
                  src="/pfp.png" 
                  alt="Chau Senghong"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Info chips — icon + label pattern is a clear signifier */}
              <div className="info-chip"><MapPin size={16} color="var(--primary-color)" /> Phnom Penh, Cambodia</div>
              <div className="info-chip"><Phone size={16} color="var(--primary-color)" /> +855 14 545 654</div>
              <div className="info-chip"><Mail size={16} color="var(--primary-color)" /> senghongchau@gmail.com</div>
            </motion.div>

            {/* Right column — bio + education */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                I am a second-year Digital Technology student with interest for software development, UX/UI design, and emerging technologies. Through academic projects, I have developed skills in user research, interface design, and problem-solving. I enjoy collaborating with others and continuously learning to build meaningful digital solutions.
              </p>

              {/* Education — left-anchored for F vertical scan */}
              <p className="section-label">Education</p>

              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>CamTech University</div>
                <div className="timeline-year">2025 – Present</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>B.Sc. Software Engineering (Year 2)</div>
              </div>

              <div className="timeline-item">
                <div className="timeline-year">2023 – 2025</div>
                <div className="timeline-title">Kasem Bundit University</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Digital Technology Innovation (Transferred)</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-title">Russey Keo High School</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High School Diploma</p>
              </div>

              {/* Skills */}
              <p className="section-label" style={{ marginTop: '2rem' }}>Technical Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginTop: '0.5rem' }}>
                {['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB',
                  'Express', 'REST APIs', 'UX/UI Design', 'Figma', 'User Research',
                  'Git & GitHub', 'Python', 'Agile'].map(s => (
                  <span key={s} className="tool-tag">{s}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROJECTS — Cards with F-pattern: category top-left
          ══════════════════════════════════════════════════════ */}
      <section className="section" id="projects" style={{ background: 'var(--bg-color)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label">My Work</p>
            <h2 className="section-title">Projects</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.85 }}>
              A selection of academic and personal projects that demonstrate my technical abilities.
            </p>
          </motion.div>

          {/* Feedback: loading skeleton so users know content is coming */}
          {loading ? (
            <div className="projects-grid">
              {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No projects yet</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Add your first project from the admin panel.
              </p>
              <Link to="/admin" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Open Admin <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="project-card"
                  id={`project-card-${project._id}`}
                >
                  <img
                    className="project-card-img"
                    src={project.imageUrl || `https://placehold.co/600x300/f9f6f0/2c3625?text=${encodeURIComponent(project.title)}`}
                    alt={project.title}
                  />

                  {/* F-pattern: category tag appears top-left — first thing eyes hit */}
                  <div className="project-card-header">
                    {project.technologies?.[0] && (
                      <span className="tool-tag" style={{ marginTop: 0 }}>{project.technologies[0]}</span>
                    )}
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.title}</h3>

                    {/* Tech tags row */}
                    {project.technologies?.length > 1 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        {project.technologies.slice(1).map(t => (
                          <span key={t} className="tool-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    <p className="project-card-desc">
                      {project.description?.substring(0, 110)}{project.description?.length > 110 ? '…' : ''}
                    </p>

                    {/* Arrow signifier tells user "this goes somewhere" */}
                    <Link to={`/projects/${project._id}`} className="card-link" id={`project-link-${project._id}`}>
                      View Case Study <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT — Form with inline validation feedback
          ══════════════════════════════════════════════════════ */}
      <section className="section" id="contact" style={{ background: 'white' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <p className="section-label">Say Hello</p>
            <h2 className="section-title">Get In Touch</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.85 }}>
              Open to internship opportunities, collaborations, or just a friendly chat about tech and design.
            </p>
          </motion.div>

          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="contact-card">

              {/* Feedback banner — success or error state */}
              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`status-banner ${submitStatus}`}
                  >
                    {submitStatus === 'success'
                      ? '✅ Message sent! I\'ll get back to you soon.'
                      : '❌ Something went wrong. Please try again.'}
                    <button
                      onClick={() => setSubmitStatus(null)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                      aria-label="Dismiss"
                    >×</button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate id="contact-form">

                {/* Name field */}
                <div className="form-group">
                  <label className="form-label required" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control${errors.name && touched.name ? ' error' : ''}`}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {/* Feedback: error text appears below field */}
                  {errors.name && touched.name && (
                    <p className="field-error">⚠ {errors.name}</p>
                  )}
                </div>

                {/* Email field */}
                <div className="form-group">
                  <label className="form-label required" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control${errors.email && touched.email ? ' error' : ''}`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.email && touched.email && (
                    <p className="field-error">⚠ {errors.email}</p>
                  )}
                </div>

                {/* Subject field */}
                <div className="form-group">
                  <label className="form-label required" htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control${errors.subject && touched.subject ? ' error' : ''}`}
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && touched.subject && (
                    <p className="field-error">⚠ {errors.subject}</p>
                  )}
                </div>

                {/* Message field */}
                <div className="form-group">
                  <label className="form-label required" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control${errors.message && touched.message ? ' error' : ''}`}
                    rows="5"
                    placeholder="What would you like to say?"
                  />
                  {errors.message && touched.message && (
                    <p className="field-error">⚠ {errors.message}</p>
                  )}
                </div>

                {/* Submit — disabled + loading state = feedback */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submit-contact"
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                  disabled={sending}
                >
                  {sending ? 'Sending…' : <>Send Message <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
