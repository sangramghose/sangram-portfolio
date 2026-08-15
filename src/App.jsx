import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DATA, ICONS } from './data.js';

// Helper: SVG icon component
const Icon = ({ name, size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    {ICONS[name] || null}
  </svg>
);

// Helper: Pill component
const Pill = ({ children, accent = false }) => (
  <span className={`pill${accent ? ' pill-accent' : ''}`}>{children}</span>
);

// Custom cursor component
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

// Counter component that animates when in view
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

// Nav component with mobile menu and icons
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // mapping nav id to icon name
  const navIcons = {
    home: 'home',
    highlights: 'rocket',
    about: 'user',
    skills: 'settings',
    experience: 'briefcase',
    projects: 'code',
    education: 'education',
    certifications: 'award',
    contact: 'contact'
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const secs = DATA.nav.map(([id]) => document.getElementById(id));
      let current = secs[0]?.id;
      secs.forEach((sec) => {
        if (sec && sec.getBoundingClientRect().top <= innerHeight * 0.32) {
          current = sec.id;
        }
      });
      setActive(current);
    };
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
          <button className="iconbtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle theme" title="Toggle theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </button>
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu"
          >
            <nav className="mobile-links">
              {DATA.nav.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={active === id ? 'active' : ''}
                  onClick={() => setMobileOpen(false)}
                >
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

// Animation wrapper – accepts className and style for grid
const Reveal = ({ children, delay = 0, className = '', style = {} }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Hero section
const Hero = () => {
  const typedText = useTyped(DATA.roles);

  return (
    <section id="home" className="hero">
      <div className="bento">
        <Reveal className="span-8">
          <div className="tile tile-glow" style={{ padding: '42px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <div className="hero-badge">
              <span className="pulse"></span>
              Open to Internship / Full-time
            </div>
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
          <div className="tile portrait" style={{ height: '100%' }}>
            <img src="/profile.png" alt="Sangram Keshari Ghose — Data Engineer" width="640" height="800" />
            <div className="portrait-overlay"></div>
            <div className="portrait-cap">
              <div className="mono">Based in India</div>
              <div style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '1.22rem', marginTop: '6px', letterSpacing: '-0.025em' }}>
                Open to Data roles
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="span-3" delay={0.2}>
          <div className="tile" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div>
            <div>
              <div className="metric-val"><Counter value={3} /></div>
              <div className="metric-sub">Internships</div>
            </div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.3}>
          <div className="tile" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--elevated)', borderColor: 'var(--border-strong)', height: '100%' }}>
            <div className="metric-label">Metric</div>
            <div>
              <div className="metric-val"><Counter value={7} /></div>
              <div className="metric-sub">Certifications</div>
            </div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.4}>
          <div className="tile" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div>
            <div>
              <div className="metric-val"><Counter value={10} suffix="+" /></div>
              <div className="metric-sub">Forecast Scenarios</div>
            </div>
          </div>
        </Reveal>
        <Reveal className="span-3" delay={0.5}>
          <div className="tile" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="metric-label">Metric</div>
            <div>
              <div className="metric-val text-grad">∞</div>
              <div className="metric-sub">Curiosity</div>
            </div>
          </div>
        </Reveal>

        <Reveal className="span-12" delay={0.6}>
          <div className="tile" style={{ padding: '16px' }}>
            <div className="marquee-wrap">
              <div className="marquee-track">
                {[...DATA.tech, ...DATA.tech].map((t, i) => <span key={i}>{t}</span>)}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// Highlights section
const Highlights = () => (
  <section id="highlights">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">01 / Featured</span></div>
          <h2 className="text-grad">Highlights &amp; Achievements</h2>
        </div>
        <p className="desc">A snapshot of the work, certifications and projects that define the journey.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.highlights.map((h, i) => (
        <Reveal key={i} className={h.span} delay={i * 0.05}>
          <div className="tile" style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
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

// About section
const About = () => (
  <section id="about">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">02 / Profile</span></div>
          <h2 className="text-grad">About Me</h2>
        </div>
        <p className="desc">Turning messy, large-scale datasets into reliable, production-ready systems.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-7">
        <div className="tile" style={{ padding: '34px', height: '100%' }}>
          {DATA.about.map((p, i) => <p key={i} className="muted" style={{ fontSize: '.96rem', margin: '0 0 16px', lineHeight: '1.78' }} dangerouslySetInnerHTML={{ __html: p }} />)}
        </div>
      </Reveal>
      <Reveal className="span-5" delay={0.1}>
        <div className="tile" style={{ padding: '34px', height: '100%' }}>
          <div className="mono">Tech I love</div>
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DATA.loved.map((t, i) => <Pill key={i} accent>{t}</Pill>)}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '28px', paddingTop: '24px' }}>
            <div className="mono">Where I'm heading</div>
            <ul style={{ margin: '14px 0 0' }}>
              {DATA.roles.map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.9rem', marginBottom: '10px', color: 'var(--fg)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '99px', background: 'var(--primary)', flexShrink: 0 }}></span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
      <Reveal className="span-12" delay={0.2}>
        <div className="tile" style={{ padding: '24px 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'var(--elevated)', borderColor: 'var(--border-strong)' }}>
          <div>
            <div className="mono">Direct line</div>
            <div style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '1.22rem', marginTop: '6px', letterSpacing: '-0.025em' }}>sangramkesharighose@gmail.com</div>
          </div>
          <div className="muted" style={{ fontSize: '.95rem' }}>+91 8456841232</div>
        </div>
      </Reveal>
    </div>
  </section>
);

// Skills section
const Skills = () => (
  <section id="skills">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">03 / Core Stack</span></div>
          <h2 className="text-grad">Skills &amp; Tooling</h2>
        </div>
        <p className="desc">The languages, platforms and practices behind the pipelines.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.skills.map((s, i) => (
        <Reveal key={i} className={s.span} delay={i * 0.05}>
          <div className="tile" style={{ padding: '28px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="icon-box"><Icon name={s.icon} /></div>
              <h3 style={{ fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{s.title}</h3>
            </div>
            <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {s.items.map(([name, accent], idx) => <Pill key={idx} accent={!!accent}>{name}</Pill>)}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Experience section
const Experience = () => (
  <section id="experience">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">04 / History</span></div>
          <h2 className="text-grad">Experience</h2>
        </div>
        <p className="desc">Internships across market research, enterprise engineering and data products.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.exp.map((e, i) => (
        <Reveal key={i} className={e.full ? 'span-12' : 'span-6'} delay={i * 0.05}>
          <div className="tile" style={{ padding: '28px', height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img className="exp-logo" src={`/${e.logo}`} alt={`${e.company} logo`} onError={(ev) => { ev.target.style.display = 'none'; ev.target.nextSibling.style.display = 'grid'; }} />
                <div className="mono-circle" style={{ display: 'none' }}>{e.short}</div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', letterSpacing: '-0.025em' }}>{e.role}</h3>
                  <p className="muted" style={{ fontSize: '.9rem', margin: '4px 0 0' }}>{e.company}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono">{e.duration}</div>
                <p className="muted" style={{ fontSize: '.8rem', margin: '4px 0 0' }}>{e.location}</p>
              </div>
            </div>
            <ul className={`exp-bullets ${e.full ? 'two' : ''}`}>
              {e.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {e.stack.map((t, idx) => <Pill key={idx}>{t}</Pill>)}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Projects section
const Projects = () => (
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
    <div style={{ marginTop: '28px', display: 'grid', gap: '16px' }}>
      {DATA.proj.map((p, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <div className="bento">
            <Reveal className="span-5">
              <div className="tile tile-glow" style={{ padding: '34px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Pill accent>{p.tagline}</Pill>
                    {p.live && <Pill accent>Live</Pill>}
                  </div>
                  <h3 style={{ fontSize: '1.95rem', marginTop: '16px', letterSpacing: '-0.03em' }}>{p.title}</h3>
                  <p className="muted" style={{ fontSize: '.9rem', marginTop: '12px', lineHeight: '1.72' }}>{p.desc}</p>
                  <div className="mono" style={{ marginTop: '16px' }}>{p.period}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
                  {p.actions.map(([label, href, primary], idx) => (
                    <a key={idx} className={`btn ${primary ? 'btn-primary' : 'btn-ghost'}`} href={href} target="_blank" rel="noopener">{label}</a>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="span-7" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {p.features.map(([title, body], idx) => (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div className="tile" style={{ padding: '20px', height: '100%' }}>
                    <h4 style={{ fontSize: '1rem', letterSpacing: '-0.02em' }}>{title}</h4>
                    <p className="muted" style={{ fontSize: '.85rem', marginTop: '8px', lineHeight: '1.65' }}>{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            {p.preview && (
              <Reveal className="span-12">
                <div className="tile project-preview" style={{ padding: '0' }}>
                  <img src={`/${p.preview}`} alt={`${p.title} project preview`} loading="lazy" onError={(e) => e.target.closest('.project-preview').remove()} />
                </div>
              </Reveal>
            )}
            <Reveal className="span-12">
              <div className="tile" style={{ padding: '20px 28px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {p.stack.map((t, idx) => <Pill key={idx}>{t}</Pill>)}
              </div>
            </Reveal>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// Education section
const Education = () => (
  <section id="education">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">06 / Academics</span></div>
          <h2 className="text-grad">Education</h2>
        </div>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-8">
        <div className="tile" style={{ padding: '34px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start', height: '100%' }}>
          <img src="/giet-logo.png" alt="GIET University logo" style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'contain', background: '#fff', padding: '6px', border: '1px solid var(--border)' }} onError={(e) => e.target.remove()} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}>B.Tech, Computer Science and Engineering</h3>
            <p className="muted" style={{ fontSize: '.9rem', marginTop: '8px' }}>Gandhi Institute of Engineering and Technology University</p>
            <p className="muted" style={{ fontSize: '.85rem', marginTop: '4px' }}>Gunupur, Odisha, India</p>
          </div>
        </div>
      </Reveal>
      <Reveal className="span-4" delay={0.1}>
        <div className="tile" style={{ padding: '34px', background: 'var(--elevated)', borderColor: 'var(--border-strong)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
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

// Certifications section
const Certifications = () => (
  <section id="certifications">
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">07 / Credentials</span></div>
          <h2 className="text-grad">Certifications</h2>
        </div>
        <p className="desc">Seven industry certifications across cloud, data engineering and AI.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      {DATA.cert.map((c, i) => (
        <Reveal key={i} className={c.span} delay={i * 0.05}>
          <a className="tile tile-link" href={c.href} target="_blank" rel="noopener" style={{ padding: '24px', height: '100%' }}>
            <img className="cert-badge" src={`/${c.badge}`} alt={`${c.title} certification badge`} onError={(e) => e.target.remove()} />
            <div className="mono">{c.issuer}</div>
            <h3 style={{ fontSize: '1.1rem', marginTop: '8px', letterSpacing: '-0.02em' }}>{c.title}</h3>
            <p className="muted" style={{ fontSize: '.85rem', margin: '10px 0', flex: 1, lineHeight: '1.65' }}>{c.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {c.skills.map((s, idx) => <Pill key={idx}>{s}</Pill>)}
            </div>
            <div className="mono" style={{ marginTop: '12px' }}>{c.meta}</div>
          </a>
        </Reveal>
      ))}
    </div>
  </section>
);

// Contact section
const Contact = () => (
  <section id="contact" style={{ paddingBottom: '100px' }}>
    <Reveal>
      <div className="sec-head">
        <div>
          <div className="label"><span className="line"></span><span className="mono">08 / Contact</span></div>
          <h2 className="text-grad">Let's build something</h2>
        </div>
        <p className="desc">Open to internships and full-time Data Engineering roles.</p>
      </div>
    </Reveal>
    <div className="sec-rule"></div>
    <div className="bento" style={{ marginTop: '28px' }}>
      <Reveal className="span-12">
        <div className="tile" style={{ padding: '34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: '#fff', letterSpacing: '-0.025em' }}>Open for collaboration</h3>
            <p style={{ margin: '6px 0 0', opacity: '.9', fontSize: '1.02rem' }}>Let's build something scalable.</p>
          </div>
          <a className="btn" href="mailto:sangramkesharighose@gmail.com" style={{ background: '#fff', color: 'var(--primary)' }}>Get in Touch</a>
        </div>
      </Reveal>

      <Reveal className="span-3">
        <a className="tile" style={{ padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '148px' }} href="mailto:sangramkesharighose@gmail.com">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <span className="mono">Email</span>
          <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.9rem', marginTop: '8px', wordBreak: 'break-all', letterSpacing: '-0.015em' }}>sangramkesharighose@gmail.com</span>
        </a>
      </Reveal>

      <Reveal className="span-3" delay={0.05}>
        <a className="tile" style={{ padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '148px' }} href="tel:+918456841232">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <span className="mono">Phone</span>
          <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.95rem', marginTop: '8px', letterSpacing: '-0.015em' }}>+91 8456841232</span>
        </a>
      </Reveal>

      <Reveal className="span-3" delay={0.1}>
        <a className="tile" style={{ padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '148px' }} href="https://github.com/sangramghose" target="_blank" rel="noopener">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </div>
          <span className="mono">GitHub</span>
          <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.95rem', marginTop: '8px', letterSpacing: '-0.015em' }}>@sangramghose</span>
        </a>
      </Reveal>

      <Reveal className="span-3" delay={0.15}>
        <a className="tile" style={{ padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '148px' }} href="https://www.linkedin.com/in/sangramghose/" target="_blank" rel="noopener">
          <div className="contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </div>
          <span className="mono">LinkedIn</span>
          <span style={{ fontFamily: 'Syne', fontWeight: '700', fontSize: '.95rem', marginTop: '8px', letterSpacing: '-0.015em' }}>in/sangramghose</span>
        </a>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer>
    <div className="wrap">
      © {new Date().getFullYear()} Sangram Keshari Ghose · Built with focus &amp; precision
    </div>
  </footer>
);

export default function App() {
  return (
    <>
      <CustomCursor />
      <div className="bg-mesh" aria-hidden="true"></div>
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="orb orb-1" aria-hidden="true"></div>
      <div className="orb orb-2" aria-hidden="true"></div>
      <div className="orb orb-3" aria-hidden="true"></div>

      <Nav />

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
