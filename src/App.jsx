import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import emailjs from '@emailjs/browser';
import { DATA, ICONS } from './data.js';

// ---------- EmailJS configuration ----------
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";    // replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";    // replace with your EmailJS public key

// ---------- Helper components ----------
const Icon = ({ name, size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    {ICONS[name] || null}
  </svg>
);

const Pill = ({ children, accent = false }) => (
  <span className={`pill${accent ? ' pill-accent' : ''}`}>{children}</span>
);

// Custom cursor (unchanged)
const CustomCursor = () => { /* same as before */ };

// Typed text hook (unchanged)
const useTyped = (words, typeSpeed = 72, deleteSpeed = 36, pause = 1800) => { /* same */ };

// Counter (unchanged)
const Counter = ({ value, suffix = '' }) => { /* same */ };

// Active section hook
const useActiveSection = () => { /* same */ };

// ---------- New components ----------

// Particle background canvas
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    const particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(99,102,241,0.6)', 'rgba(168,85,247,0.4)', 'rgba(34,211,238,0.4)'];
    const particleCount = 60;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.reset();
        if (this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('0.6', this.opacity.toString());
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
};

// Loading screen
const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="loader-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        SKG
      </motion.div>
      <motion.div
        className="loader-bar"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

// Command palette
const CommandPalette = ({ isOpen, onClose, theme, setTheme }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const commands = [
    ...DATA.nav.map(([id, label]) => ({
      id,
      label: `Go to ${label}`,
      action: () => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
      icon: id,
    })),
    {
      id: 'theme',
      label: `Toggle theme (${theme === 'dark' ? 'Light' : 'Dark'} mode)`,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onClose();
      },
      icon: 'settings',
    },
    {
      id: 'github',
      label: 'Open GitHub',
      action: () => { window.open('https://github.com/sangramghose', '_blank'); onClose(); },
      icon: 'code',
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn',
      action: () => { window.open('https://www.linkedin.com/in/sangramghose/', '_blank'); onClose(); },
      icon: 'user',
    },
  ];

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="palette"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="palette-results">
              {filtered.map(cmd => (
                <button
                  key={cmd.id}
                  className="palette-item"
                  onClick={cmd.action}
                >
                  <span className="nav-icon"><Icon name={cmd.icon} size={16} /></span>
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Contact form (EmailJS)
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        rows="5"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'success' && <p className="form-success">Message sent successfully!</p>}
      {status === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
    </form>
  );
};

// ---------- Section components (with tilt/glass modifications) ----------

// Wrap project cards with Tilt
const ProjectCard = ({ project }) => (
  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffffff" glarePosition="all" className="project-tilt">
    <div className="tile tile-glow glass" style={{ padding: '34px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* content same as before */}
    </div>
  </Tilt>
);

// Update Projects section to use ProjectCard
const Projects = () => (
  <section id="projects">
    {/* ... same header ... */}
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.proj.map((p, i) => (
        <Reveal key={i} className="span-6" delay={i * 0.05}>
          <ProjectCard project={p} />
        </Reveal>
      ))}
    </div>
  </section>
);

// Add Glass to some tiles in Hero (optional)
const Hero = () => {
  const typedText = useTyped(DATA.roles);
  return (
    <section id="home" className="hero">
      <div className="bento">
        <Reveal className="span-8">
          <div className="tile tile-glow glass" style={{ padding: '42px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            {/* ... same hero content ... */}
          </div>
        </Reveal>
        {/* ... rest of hero ... */}
      </div>
    </section>
  );
};

// ---------- Main App ----------
export default function App() {
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setPaletteOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <div className="bg-mesh" aria-hidden="true"></div>
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="orb orb-1" aria-hidden="true"></div>
      <div className="orb orb-2" aria-hidden="true"></div>
      <div className="orb orb-3" aria-hidden="true"></div>

      <ScrollProgress />
      <Nav theme={theme} setTheme={setTheme} />
      <SideDots />
      <ScrollToTop />

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} theme={theme} setTheme={setTheme} />

      <main className="wrap">
        <Hero />
        <Highlights />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
