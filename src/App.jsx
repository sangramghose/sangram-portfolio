import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import emailjs from '@emailjs/browser';
import { DATA, ICONS, TESTIMONIALS } from './data.js';

// ---------- EmailJS configuration ----------
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

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

// Custom cursor
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [smooth, setSmooth] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target.closest('a, button, .tile, .btn, .btn-nav-cta, .iconbtn');
      setHover(!!target);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    let raf;
    const loop = () => {
      setSmooth(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  return (
    <>
      <div ref={dotRef} id="dot" style={{ left: pos.x, top: pos.y }} />
      <div ref={cursorRef} id="cursor" className={hover ? 'hover' : ''} style={{ left: smooth.x, top: smooth.y }} />
    </>
  );
};

// Typed text hook
const useTyped = (words, typeSpeed = 72, deleteSpeed = 36, pause = 1800) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIndex];
    if (!deleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => setCharIndex(charIndex + 1), typeSpeed);
    } else if (!deleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(charIndex - 1), deleteSpeed);
    } else {
      setDeleting(false);
      setWordIndex((wordIndex + 1) % words.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
};

// Counter
const Counter = ({ value, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const duration = 1100;
            const step = (now) => {
              const p = Math.min((now - start) / duration, 1);
              setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.current.observe(ref.current);
    return () => observer.current?.disconnect();
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
};

// Active section hook
const useActiveSection = () => {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = DATA.nav.map(([id]) => document.getElementById(id)).filter(Boolean);
    const onScroll = () => {
      let current = sections[0]?.id || 'home';
      sections.forEach((sec) => {
        if (sec && sec.getBoundingClientRect().top <= innerHeight * 0.32) {
          current = sec.id;
        }
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return active;
};

// Particle background
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
      constructor() { this.reset(); }
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
    <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <motion.div className="loader-logo" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        SKG
      </motion.div>
      <motion.div className="loader-bar" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
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
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const commands = [
    ...DATA.nav.map(([id, label]) => ({
      id,
      label: `Go to ${label}`,
      action: () => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); onClose(); },
      icon: id,
    })),
    {
      id: 'theme',
      label: `Toggle theme (${theme === 'dark' ? 'Light' : 'Dark'} mode)`,
      action: () => { setTheme(theme === 'dark' ? 'light' : 'dark'); onClose(); },
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

  const filtered = commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="palette-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div className="palette" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onMouseDown={(e) => e.stopPropagation()}>
            <input ref={inputRef} type="text" placeholder="Type a command..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="palette-results">
              {filtered.map(cmd => (
                <button key={cmd.id} className="palette-item" onClick={cmd.action}>
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

// Toast notification
const Toast = ({ message, type }) => (
  <motion.div className={`toast toast-${type}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    {message}
  </motion.div>
);

// Contact form
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
        { from_name: form.name, from_email: form.email, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 4000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {status === 'success' && <Toast message="Message sent successfully!" type="success" />}
        {status === 'error' && <Toast message="Something went wrong. Please try again." type="error" />}
      </AnimatePresence>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required aria-label="Your Name" />
        <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required aria-label="Your Email" />
        <textarea placeholder="Your Message" rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required aria-label="Your Message" />
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
};

// GitHub star count
const GitHubStars = ({ repo }) => {
  const [stars, setStars] = useState(null);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, [repo]);
  if (stars === null) return null;
  return (
    <span className="github-stars">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>
      {stars}
    </span>
  );
};

// Project card with tilt
const ProjectCard = ({ project }) => (
  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffffff" glarePosition="all" className="project-tilt">
    <div className="tile tile-glow glass" style={{ padding: '34px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <Pill accent>{project.tagline}</Pill>
          {project.live && <Pill accent>Live</Pill>}
          <GitHubStars repo="sangramghose/Deploytual" />
        </div>
        <h3 style={{ fontSize: '1.95rem', marginTop: '16px', letterSpacing: '-0.03em' }}>{project.title}</h3>
        <p className="muted" style={{ fontSize: '.9rem', marginTop: '12px', lineHeight: '1.72' }}>{project.desc}</p>
        <div className="mono" style={{ marginTop: '16px' }}>{project.period}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
        {project.actions.map(([label, href, primary], idx) => (
          <a key={idx} className={`btn ${primary ? 'btn-primary' : 'btn-ghost'}`} href={href} target="_blank" rel="noopener">{label}</a>
        ))}
      </div>
    </div>
  </Tilt>
);

// Projects section with filtering
const Projects = () => {
  const [filter, setFilter] = useState('All');
  const allTech = ['All', ...new Set(DATA.proj.flatMap(p => p.techStack))];
  const filteredProjects = filter === 'All' ? DATA.proj : DATA.proj.filter(p => p.techStack.includes(filter));

  return (
    <section id="projects">
      <Reveal>
        <div className="sec-head">
          <div>
            <div className="label"><span className="line"></span><span className="mono">05 / Work</span></div>
            <h2 className="text-grad">Projects</h2>
          </div>
          <p className="desc">Flagship builds — from AI analytics platforms to end-to-end ML pipelines.</p>
        </div>
      </Reveal>
      <div className="sec-rule"></div>

      <div className="project-filter">
        {allTech.map(tech => (
          <button key={tech} className={`filter-btn ${filter === tech ? 'active' : ''}`} onClick={() => setFilter(tech)}>
            {tech}
          </button>
        ))}
      </div>

      <div className="bento" style={{ marginTop: '28px' }}>
        <AnimatePresence>
          {filteredProjects.map((p, i) => (
            <Reveal key={p.title} className="span-6" delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Testimonials section
const Testimonials = () => (
  <section id="testimonials">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">09 / Praise</span></div>
          <h2 className="text-grad">What People Say</h2>
        </div>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {TESTIMONIALS.map((t, i) => (
        <Reveal key={i} className="span-4" delay={i * 0.05}>
          <div className="tile glass testimonial-card">
            <p className="testimonial-text">"{t.quote}"</p>
            <div className="testimonial-author">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-role">{t.role}</span>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Animation wrapper
const Reveal = ({ children, delay = 0, className = '', style = {} }) => (
  <motion.div className={className} style={style} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

// Scroll progress bar
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress((current / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <motion.div className="scroll-progress" style={{ scaleX: progress / 100 }} initial={{ scaleX: 0 }} animate={{ scaleX: progress / 100 }} transition={{ duration: 0.2 }} />;
};

// Scroll to top button
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button className="scroll-to-top" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Side dot navigation
const SideDots = () => {
  const active = useActiveSection();
  return (
    <div className="side-dots">
      {DATA.nav.map(([id]) => (
        <a key={id} href={`#${id}`} className={`side-dot ${active === id ? 'active' : ''}`} aria-label={`Navigate to ${id}`} />
      ))}
    </div>
  );
};

// Nav component
const Nav = ({ theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection();

  const navIcons = {
    home: 'home', highlights: 'rocket', about: 'user', skills: 'settings', experience: 'briefcase',
    projects: 'code', education: 'education', certifications: 'award', contact: 'contact'
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <header id="header" className={scrolled ? 'scrolled' : ''}>
      <div className="navrow">
        <a className="brand" href="#home">SKG</a>
        <nav className="links" aria-label="Primary">
          {DATA.nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
              <span className="nav-icon"><Icon name={navIcons[id]} size={16} /></span>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <motion.button className="iconbtn" whileTap={{ scale: 0.88 }} whileHover={{ y: -2 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" title="Toggle theme">
            <motion.span key={theme} initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </motion.span>
          </motion.button>
          <a className="btn-nav-cta" href="#contact">Get in touch</a>
          <button className="hamburger" onClick={toggleMobile} aria-label="Toggle mobile menu">
            <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
            <nav className="mobile-links">
              {DATA.nav.map(([id, label]) => (
                <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setMobileOpen(false)}>
                  <span className="nav-icon"><Icon name={navIcons[id]} size={18} /></span>
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Hero section
const Hero = () => {
  const typedText = useTyped(DATA.roles);
  return (
    <section id="home" className="hero">
      <div className="bento">
        <Reveal className="span-8">
          <div className="tile tile-glow glass" style={{ padding: '42px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <div className="hero-badge"><span className="pulse"></span> Open to Internship / Full-time</div>
            <div className="mono" style={{ marginTop: '22px', color: 'var(--accent2)' }}>Data Engineering &amp; Analytics</div>
            <h1>Sangram<br/>Keshari<br/><span className="text-grad">Ghose</span></h1>
            <p style={{ fontSize: '1.18rem', fontWeight: '500', margin: '12px 0 14px', letterSpacing: '0.012em' }}>
              Building intelligent data systems · <span className="typed">{typedText}</span>
            </p>
            <p className="muted" style={{ maxWidth: '36rem', fontSize: '1.02rem', lineHeight: '1.78' }}>
              Data Engineering &amp; Analytics professional focused on scalable pipelines, forecasting models, and turning complex datasets into actionable intelligence.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
              <a className="btn btn-primary" href="#contact">Get in Touch</a>
              <a className="btn btn-ghost" href="https://github.com/sangramghose" target="_blank" rel="noopener">GitHub</a>
              <a className="btn btn-ghost" href="https://www.linkedin.com/in/sangramghose/" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
        </Reveal>

        <Reveal className="span-4" delay={0.1} style={{ height: '100%' }}>
          <div className="tile portrait glass" style={{ height: '100%' }}>
            <img src="/profile.png" alt="Sangram Keshari Ghose — Data Engineer" width="640" height="800" />
            <div className="portrait-overlay"></div>
            <div className="portrait-cap">
              <div className="mono">Based in India</div>
              <div style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '1.22rem', marginTop: '6px', letterSpacing: '-0.025em' }}>Open to Data roles</div>
            </div>
          </div>
        </Reveal>

        <Reveal className="span-3" delay={0.2}>
          <div className="tile glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div><div><div className="metric-val"><Counter value={3} /></div><div className="metric-sub">Internships</div></div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.3}>
          <div className="tile glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--elevated)', borderColor: 'var(--border-strong)', height: '100%' }}>
            <div className="metric-label">Metric</div><div><div className="metric-val"><Counter value={7} /></div><div className="metric-sub">Certifications</div></div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.4}>
          <div className="tile glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div><div><div className="metric-val"><Counter value={10} suffix="+" /></div><div className="metric-sub">Forecast Scenarios</div></div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.5}>
          <div className="tile glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div><div><div className="metric-val text-grad">∞</div><div className="metric-sub">Curiosity</div></div>
          </div>
        </Reveal>

        <Reveal className="span-12" delay={0.6}>
          <div className="tile glass" style={{ padding: '16px' }}>
            <div className="marquee-wrap"><div className="marquee-track">{[...DATA.tech, ...DATA.tech].map((t, i) => <span key={i}>{t}</span>)}</div></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// Highlights
const Highlights = () => (
  <section id="highlights">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">01 / Featured</span></div><h2 className="text-grad">Highlights &amp; Achievements</h2></div>
        <p className="desc">A snapshot of the work, certifications and projects that define the journey.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.highlights.map((h, i) => (
        <Reveal key={i} className={h.span} delay={i * 0.05}>
          <div className="tile glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="icon-box"><Icon name={h.icon} /></div>
            <h3 style={{ fontSize: '1.3rem', marginTop: '18px', letterSpacing: '-0.025em' }}>{h.title}</h3>
            <p className="muted" style={{ fontSize: '.9rem', margin: '10px 0 16px', flex: 1, lineHeight: '1.72' }}>{h.body}</p>
            <div><Pill accent>{h.tag}</Pill></div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// About
const About = () => (
  <section id="about">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">02 / Profile</span></div><h2 className="text-grad">About Me</h2></div>
        <p className="desc">Turning messy, large-scale datasets into reliable, production-ready systems.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-7">
        <div className="tile glass" style={{ padding: '34px', height: '100%' }}>
          {DATA.about.map((p, i) => <p key={i} className="muted" style={{ fontSize: '.96rem', margin: '0 0 16px', lineHeight: '1.78' }} dangerouslySetInnerHTML={{ __html: p }} />)}
        </div>
      </Reveal>
      <Reveal className="span-5" delay={0.1}>
        <div className="tile glass" style={{ padding: '34px', height: '100%' }}>
          <div className="mono">Tech I love</div>
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{DATA.loved.map((t, i) => <Pill key={i} accent>{t}</Pill>)}</div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '28px', paddingTop: '24px' }}>
            <div className="mono">Where I'm heading</div>
            <ul style={{ margin: '14px 0 0' }}>
              {DATA.roles.map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.9rem', marginBottom: '10px', color: 'var(--fg)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '99px', background: 'var(--primary)', flexShrink: 0 }}></span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
      <Reveal className="span-12" delay={0.2}>
        <div className="tile glass" style={{ padding: '24px 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'var(--elevated)', borderColor: 'var(--border-strong)' }}>
          <div><div className="mono">Direct line</div><div style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '1.22rem', marginTop: '6px', letterSpacing: '-0.025em' }}>sangramkesharighose@gmail.com</div></div>
          <div className="muted" style={{ fontSize: '.95rem' }}>+91 8456841232</div>
        </div>
      </Reveal>
    </div>
  </section>
);

// Skills
const Skills = () => (
  <section id="skills">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">03 / Core Stack</span></div><h2 className="text-grad">Skills &amp; Tooling</h2></div>
        <p className="desc">The languages, platforms and practices behind the pipelines.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.skills.map((s, i) => (
        <Reveal key={i} className={s.span} delay={i * 0.05}>
          <div className="tile glass" style={{ padding: '28px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="icon-box"><Icon name={s.icon} /></div>
              <h3 style={{ fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{s.title}</h3>
            </div>
            <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{s.items.map(([name, accent], idx) => <Pill key={idx} accent={!!accent}>{name}</Pill>)}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Experience
const Experience = () => (
  <section id="experience">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">04 / History</span></div><h2 className="text-grad">Experience</h2></div>
        <p className="desc">Internships across market research, enterprise engineering and data products.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.exp.map((e, i) => (
        <Reveal key={i} className={e.full ? 'span-12' : 'span-6'} delay={i * 0.05}>
          <div className="tile glass" style={{ padding: '28px', height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img className="exp-logo" src={`/${e.logo}`} alt={`${e.company} logo`} onError={(ev) => { ev.target.style.display = 'none'; ev.target.nextSibling.style.display = 'grid'; }} />
                <div className="mono-circle" style={{ display: 'none' }}>{e.short}</div>
                <div><h3 style={{ fontSize: '1.3rem', letterSpacing: '-0.025em' }}>{e.role}</h3><p className="muted" style={{ fontSize: '.9rem', margin: '4px 0 0' }}>{e.company}</p></div>
              </div>
              <div style={{ textAlign: 'right' }}><div className="mono">{e.duration}</div><p className="muted" style={{ fontSize: '.8rem', margin: '4px 0 0' }}>{e.location}</p></div>
            </div>
            <ul className={`exp-bullets ${e.full ? 'two' : ''}`}>{e.bullets.map((b, idx) => <li key={idx}>{b}</li>)}</ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{e.stack.map((t, idx) => <Pill key={idx}>{t}</Pill>)}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Education
const Education = () => (
  <section id="education">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">06 / Academics</span></div><h2 className="text-grad">Education</h2></div>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-8">
        <div className="tile glass" style={{ padding: '34px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start', height: '100%' }}>
          <img src="/giet-logo.png" alt="GIET University logo" style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'contain', background: '#fff', padding: '6px', border: '1px solid var(--border)' }} onError={(e) => e.target.remove()} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}>B.Tech, Computer Science and Engineering</h3>
            <p className="muted" style={{ fontSize: '.9rem', marginTop: '8px' }}>Gandhi Institute of Engineering and Technology University</p>
            <p className="muted" style={{ fontSize: '.85rem', marginTop: '4px' }}>Gunupur, Odisha, India</p>
          </div>
        </div>
      </Reveal>
      <Reveal className="span-4" delay={0.1}>
        <div className="tile glass" style={{ padding: '34px', background: 'var(--elevated)', borderColor: 'var(--border-strong)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div className="mono">Timeline</div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontFamily: 'Syne', fontSize: '1.55rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Aug 2023 – Present</div>
            <div style={{ marginTop: '12px' }}><Pill accent>Expected Graduation: June 2027</Pill></div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// Certifications
const Certifications = () => (
  <section id="certifications">
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">07 / Credentials</span></div><h2 className="text-grad">Certifications</h2></div>
        <p className="desc">Seven industry certifications across cloud, data engineering and AI.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.cert.map((c, i) => (
        <Reveal key={i} className={c.span} delay={i * 0.05}>
          <a className="tile tile-link glass" href={c.href} target="_blank" rel="noopener" style={{ padding: '24px', height: '100%' }}>
            <img className="cert-badge" src={`/${c.badge}`} alt={`${c.title} certification badge`} onError={(e) => e.target.remove()} />
            <div className="mono">{c.issuer}</div>
            <h3 style={{ fontSize: '1.1rem', marginTop: '8px', letterSpacing: '-0.02em' }}>{c.title}</h3>
            <p className="muted" style={{ fontSize: '.85rem', margin: '10px 0', flex: 1, lineHeight: '1.65' }}>{c.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>{c.skills.map((s, idx) => <Pill key={idx}>{s}</Pill>)}</div>
            <div className="mono" style={{ marginTop: '12px' }}>{c.meta}</div>
          </a>
        </Reveal>
      ))}
    </div>
  </section>
);

// Contact
const Contact = () => (
  <section id="contact" style={{ paddingBottom: '100px' }}>
    <Reveal>
      <div className="sec-head">
        <div><div className="label"><span className="line"></span><span className="mono">08 / Contact</span></div><h2 className="text-grad">Let's build something</h2></div>
        <p className="desc">Open to internships and full-time Data Engineering roles.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-7">
        <div className="tile glass" style={{ padding: '34px', height: '100%' }}>
          <h3 style={{ fontSize: '1.6rem', letterSpacing: '-0.025em' }}>Send me a message</h3>
          <p className="muted" style={{ margin: '6px 0 20px', fontSize: '0.95rem' }}>I'll get back to you within 24 hours.</p>
          <ContactForm />
        </div>
      </Reveal>
      <Reveal className="span-5" delay={0.1}>
        <div className="bento" style={{ height: '100%' }}>
          <Reveal className="span-12">
            <div className="tile glass" style={{ padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '148px', background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' }}>
              <div><h3 style={{ fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.025em' }}>Open for collaboration</h3><p style={{ margin: '6px 0 0', opacity: '.9', fontSize: '0.95rem' }}>Let's build something scalable.</p></div>
              <a className="btn" href="mailto:sangramkesharighose@gmail.com" style={{ background: '#fff', color: 'var(--primary)', marginTop: '16px', alignSelf: 'flex-start' }}>Get in Touch</a>
            </div>
          </Reveal>
          <Reveal className="span-12">
            <a className="tile glass" style={{ padding: '26px', display: 'flex', alignItems: 'center', gap: '16px', minHeight: '100px' }} href="mailto:sangramkesharighose@gmail.com">
              <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
              <div><span className="mono">Email</span><span style={{ display: 'block', fontFamily: 'Syne', fontWeight: '700', fontSize: '.9rem', wordBreak: 'break-all' }}>sangramkesharighose@gmail.com</span></div>
            </a>
          </Reveal>
          <Reveal className="span-12">
            <a className="tile glass" style={{ padding: '26px', display: 'flex', alignItems: 'center', gap: '16px', minHeight: '100px' }} href="tel:+918456841232">
              <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div><span className="mono">Phone</span><span style={{ display: 'block', fontFamily: 'Syne', fontWeight: '700', fontSize: '.95rem' }}>+91 8456841232</span></div>
            </a>
          </Reveal>
          <Reveal className="span-6">
            <a className="tile glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '80px' }} href="https://github.com/sangramghose" target="_blank" rel="noopener">
              <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></div>
              <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.9rem' }}>@sangramghose</span>
            </a>
          </Reveal>
          <Reveal className="span-6">
            <a className="tile glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '80px' }} href="https://www.linkedin.com/in/sangramghose/" target="_blank" rel="noopener">
              <div className="contact-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></div>
              <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.9rem' }}>in/sangramghose</span>
            </a>
          </Reveal>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer><div className="wrap">© {new Date().getFullYear()} Sangram Keshari Ghose · Built with focus &amp; precision</div></footer>
);

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

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

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
        <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
          <Hero />
          <Highlights />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
