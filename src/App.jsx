import { useCallback, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ABOUT,
  ASSET_BASE,
  CERTS,
  EDUCATION,
  EXPERIENCE,
  HIGHLIGHTS,
  MARQUEE,
  NAV,
  PROFILE,
  PROJECTS,
  SKILLS,
  STATS,
} from "./data.js";

/* ---------- EmailJS: fill these in from your EmailJS dashboard ---------- */
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_READY =
  EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";

const asset = (file) => `${ASSET_BASE}${file}`;
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ utils */

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (prefersReduced()) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState(NAV[0][0]);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        let current = NAV[0][0];
        for (const [id] of NAV) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.32) current = id;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return active;
}

function useTyped(words) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (prefersReduced()) return;
    let word = 0;
    let char = words[0].length;
    let deleting = true;
    let timer;
    const tick = () => {
      const target = words[word];
      char += deleting ? -1 : 1;
      setText(target.slice(0, char));
      let delay = deleting ? 34 : 70;
      if (!deleting && char === target.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && char === 0) {
        deleting = false;
        word = (word + 1) % words.length;
        delay = 260;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 1700);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

/* --------------------------------------------------------------- graphics */

function PlotBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReduced()) return;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const STEP = 56;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(26,26,26,0.055)";
      ctx.beginPath();
      for (let x = 0; x <= w; x += STEP) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      for (let y = 0; y <= h; y += STEP) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      // plotted signal drifting across the grid
      const t = frame / 190;
      ctx.strokeStyle = "rgba(0,85,255,0.16)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y =
          h * 0.62 +
          Math.sin(x / 210 + t) * 46 +
          Math.sin(x / 77 - t * 1.6) * 16 +
          Math.sin(x / 33 + t * 0.7) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      frame += 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return <canvas ref={ref} className="plot" aria-hidden="true" />;
}

function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const hot = e.target instanceof Element && e.target.closest("a, button, .cell, .stat, input, textarea");
      if (ring.current) ring.current.classList.toggle("hot", !!hot);
    };

    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let done = false;
    let raf = 0;
    let value = 0;
    const finish = () => {
      done = true;
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = setTimeout(finish, 3500);

    const tick = () => {
      const ceiling = done ? 100 : 92;
      value += Math.max(0.6, (ceiling - value) * 0.08);
      if (value >= 100) {
        value = 100;
        setPct(100);
        setTimeout(() => setGone(true), 220);
        return;
      }
      setPct(Math.round(value));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <div className={`loader${gone ? " gone" : ""}`} aria-hidden={gone}>
      <div className="loader-inner">
        <b>{PROFILE.full}</b>
        <div className="loader-bar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="loader-pct">Loading — {pct}%</div>
      </div>
    </div>
  );
}

function Counter({ value, suffix }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      setN(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / 1000, 1);
            setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <b ref={ref}>
      {n}
      {suffix}
    </b>
  );
}

function useTilt() {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el || prefersReduced() || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function TiltStat({ stat }) {
  const tilt = useTilt();
  return (
    <div className="stat reveal" {...tilt}>
      <Counter value={stat.value} suffix={stat.suffix} />
      <span>{stat.label}</span>
    </div>
  );
}

/* --------------------------------------------------------------- sections */

function Nav({ active }) {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-mark" href="#home">
        SKG
      </a>
      <div className="nav-links">
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-active={active === id}>
            {label}
          </a>
        ))}
      </div>
      <a className="nav-cta" href={`mailto:${PROFILE.email}`}>
        Hire me
      </a>
    </nav>
  );
}

function Hero() {
  const typed = useTyped(PROFILE.roles);
  return (
    <section id="home" className="hero rule-b">
      <span className="status">
        <i /> {PROFILE.status}
      </span>

      <div className="hero-top">
        <div>
          <h1 className="hero-name">
            {PROFILE.first}
            <br />
            <span>{PROFILE.last}</span>
          </h1>
          <div className="hero-role">
            <i />
            <p aria-live="polite">
              {typed}
              <span className="caret" />
            </p>
          </div>
          <p className="hero-lede">
            {PROFILE.discipline} — building pipelines that hold under real data, forecasting models
            that are honest about their error, and reports people act on.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#projects">
              See the work
            </a>
            <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            <a className="btn" href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
          </div>
        </div>

        <figure className="hero-portrait">
          <img
            src={asset(PROFILE.photo)}
            alt={`Portrait of ${PROFILE.full}`}
            width="520"
            height="520"
            loading="eager"
          />
          <figcaption>{PROFILE.location}</figcaption>
        </figure>
      </div>

      <div className="stats">
        {STATS.map((s) => (
          <TiltStat key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}

function Ticker() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row.map((t, i) => (
          <span key={`${t}-${i}`}>
            <em>/</em> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Highlights() {
  return (
    <section id="highlights">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">01 / Signal</p>
        <h2 className="sec-title reveal">Highlights</h2>
      </div>
      <div className="grid-3" style={{ marginTop: 40, borderTop: "2px solid #000" }}>
        {HIGHLIGHTS.map((h, i) => (
          <article className="cell reveal" key={h.title}>
            <span className="cell-num">[{String(i + 1).padStart(2, "0")}]</span>
            <h3>{h.title}</h3>
            <p>{h.body}</p>
            <div className="tags">
              {h.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="pad rule-b">
      <p className="eyebrow">02 / Profile</p>
      <div className="about">
        <h2 className="sec-title">About</h2>
        <div className="about-body reveal">
          {ABOUT.map((p, i) => (
            <p key={i}>
              {i === 0 ? (
                <>
                  I build the layer between <span className="mark">messy data and decisions</span>{" "}
                  people actually trust — pipelines that hold, models that are honest about their
                  error, and reports a stakeholder can read in ninety seconds.
                </>
              ) : (
                p
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">03 / Toolkit</p>
        <h2 className="sec-title reveal">Skills</h2>
      </div>
      <div className="grid-3" style={{ marginTop: 40, borderTop: "2px solid #000" }}>
        {SKILLS.map((group) => (
          <div className="cell skill-cell reveal" key={group.group} style={{ background: "#fff" }}>
            <h4>{group.group}</h4>
            <ul>
              {group.items.map(([name, core]) => (
                <li key={name}>
                  <span>{name}</span>
                  {core ? <em>core</em> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">04 / Track record</p>
        <h2 className="sec-title reveal">Experience</h2>
      </div>
      <div style={{ marginTop: 40, borderTop: "2px solid #000" }}>
        {EXPERIENCE.map((job) => (
          <article className="exp reveal" key={job.company}>
            <div className="exp-side">
              <img src={asset(job.logo)} alt="" width="44" height="44" loading="lazy" />
              <div className="when">{job.period}</div>
              <div className="where">{job.location}</div>
            </div>
            <div className="exp-main">
              <h3>{job.company}</h3>
              <div className="role">{job.role}</div>
              <ul>
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="tags">
                {job.stack.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="work">
      <div className="pad">
        <p className="eyebrow">05 / Case studies</p>
        <h2 className="sec-title" style={{ marginBottom: 44 }}>
          Selected work
        </h2>

        {PROJECTS.map((p) => (
          <article className="case reveal" key={p.title}>
            <div>
              <div className="shot">
                {p.preview ? (
                  <img
                    src={asset(p.preview)}
                    alt={`${p.title} interface preview`}
                    loading="lazy"
                  />
                ) : (
                  <span className="shot-empty">{p.title} — pipeline</span>
                )}
              </div>
              <h3>{p.title}</h3>
              <div className="tagline">
                {p.tagline} · {p.period}
              </div>
              <p className="desc">{p.desc}</p>
              <div className="stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="hero-actions" style={{ marginTop: 0 }}>
                {p.actions.map(([label, href, primary]) => (
                  <a
                    key={label}
                    className={`btn${primary ? " btn-solid" : ""}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              {p.features.map(([title, body]) => (
                <div className="feat" key={title}>
                  <b>{title}</b>
                  <span>{body}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">06 / Academics</p>
        <h2 className="sec-title reveal">Education</h2>
      </div>
      <div className="edu reveal" style={{ marginTop: 40, borderTop: "2px solid #000", borderBottom: "2px solid #000" }}>
        <div className="edu-main">
          <img src={asset(EDUCATION.logo)} alt="" width="52" height="52" loading="lazy" />
          <div>
            <h3>{EDUCATION.degree}</h3>
            <p>{EDUCATION.school}</p>
            <p>{EDUCATION.location}</p>
          </div>
        </div>
        <div className="edu-side">
          <div className="when">{EDUCATION.period}</div>
          <div className="tags" style={{ marginTop: 14 }}>
            <span className="tag">{EDUCATION.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications">
      <div className="pad" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">07 / Credentials</p>
        <h2 className="sec-title reveal">Certifications</h2>
      </div>
      <div className="grid-3" style={{ marginTop: 40, borderTop: "2px solid #000" }}>
        {CERTS.map((c) => (
          <a
            className="cell cert reveal"
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={asset(c.badge)} alt="" width="52" height="52" loading="lazy" />
            <div>
              <div className="issuer">{c.issuer}</div>
              <h3>{c.title}</h3>
              <div className="meta">{c.meta}</div>
              <div className="tags" style={{ marginTop: 10 }}>
                {c.skills.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Tell me your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = "A valid email, please";
    if (form.message.trim().length < 10) next.message = "A little more detail (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!EMAILJS_READY) {
      setState("unconfigured");
      window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
        `Portfolio enquiry from ${form.name}`,
      )}&body=${encodeURIComponent(form.message)}`;
      return;
    }

    setState("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setState("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS send failed", err);
      setState("failed");
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-side">
        <p className="eyebrow">08 / Contact</p>
        <h2>
          Let&apos;s build
          <br />
          something
          <br />
          that holds.
        </h2>
        <div style={{ marginTop: 40 }}>
          <a className="line-item" href={`mailto:${PROFILE.email}`}>
            <small>Email</small>
            {PROFILE.email}
          </a>
          <a className="line-item" href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}>
            <small>Phone</small>
            {PROFILE.phone}
          </a>
          <a
            className="line-item"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            <small>LinkedIn</small>
            /in/sangramghose
          </a>
          <a className="line-item" href={PROFILE.github} target="_blank" rel="noreferrer noopener">
            <small>GitHub</small>
            @sangramghose
          </a>
        </div>
      </div>

      <div className="contact-form">
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              type="text"
              value={form.name}
              onChange={set("name")}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name ? <div className="err">{errors.name}</div> : null}
          </div>
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email ? <div className="err">{errors.email}</div> : null}
          </div>
          <div className="field">
            <label htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              rows="4"
              value={form.message}
              onChange={set("message")}
              aria-invalid={!!errors.message}
            />
            {errors.message ? <div className="err">{errors.message}</div> : null}
          </div>
          <button className="submit" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send message"}
          </button>
          <p className="form-note" role="status">
            {state === "sent" ? <span className="ok">Sent — I&apos;ll reply shortly.</span> : null}
            {state === "failed" ? (
              <span className="bad">
                Didn&apos;t send. Email me directly at {PROFILE.email}.
              </span>
            ) : null}
            {state === "unconfigured" ? <>Opening your mail client…</> : null}
            {state === "idle" ? <>Replies usually within a day.</> : null}
          </p>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- root */

export default function App() {
  const active = useActiveSection();
  useReveal();

  return (
    <>
      <Loader />
      <PlotBackground />
      <Cursor />
      <a className="skip" href="#home">
        Skip to content
      </a>
      <div className="shell">
        <Nav active={active} />
        <main id="main">
          <Hero />
          <Ticker />
          <Highlights />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Contact />
        </main>
        <footer className="foot">
          <span>© {new Date().getFullYear()} {PROFILE.full}</span>
          <span>{PROFILE.discipline}</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
