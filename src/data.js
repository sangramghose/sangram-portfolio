// Single source of truth for all portfolio content.
export const ASSET_BASE = "/";

export const PROFILE = {
  first: "Sangram",
  last: "Ghose",
  full: "Sangram Keshari Ghose",
  discipline: "Data Engineering & Analytics",
  roles: [
    "Data Engineer",
    "AI Data Engineer",
    "Machine Learning Engineer",
    "Data Consultant",
    "Data Analyst",
  ],
  status: "Open to internship & full-time roles",
  location: "Gunupur, Odisha, India",
  email: "sangramkesharighose@gmail.com",
  phone: "+91 8456841232",
  github: "https://github.com/sangramghose",
  linkedin: "https://www.linkedin.com/in/sangramghose/",
  site: "https://sangram.qzz.io/",
  photo: "profile.png",
};

export const NAV = [
  ["home", "Home"],
  ["highlights", "Highlights"],
  ["about", "About"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["certifications", "Certifications"],
  ["contact", "Contact"],
];

export const STATS = [
  { value: 3, suffix: "", label: "Industry internships" },
  { value: 7, suffix: "", label: "Certifications" },
  { value: 10, suffix: "+", label: "Forecast scenarios" },
  { value: 50, suffix: "K+", label: "Records modelled" },
];

export const MARQUEE = [
  "Python",
  "SQL",
  "Pandas",
  "Machine Learning",
  "Time Series",
  "Google Cloud",
  "Microsoft Fabric",
  "Agentic AI",
  "EDA",
  "ETL Pipelines",
];

export const HIGHLIGHTS = [
  {
    title: "Three industry internships",
    body: "Frost & Sullivan, Infinite Computer Solutions and Zoho — shipping real analytics against real production data.",
    tags: ["Frost & Sullivan", "Infinite", "Zoho"],
  },
  {
    title: "Agentic AI, certified",
    body: "Nebius Academy Agentic AI Builder — autonomous agents, generative workflows and RAG pipelines.",
    tags: ["Agents", "RAG"],
  },
  {
    title: "Microsoft Fabric associate",
    body: "End-to-end data engineering on Microsoft's unified analytics platform: ingestion, transformation, serving.",
    tags: ["Fabric", "Lakehouse"],
  },
  {
    title: "Google Cloud engineer",
    body: "Associate Cloud Engineer — designing, deploying and operating secure, scalable workloads on GCP.",
    tags: ["GCP", "GKE", "IAM"],
  },
  {
    title: "Deploytual",
    body: "Deploy intelligence. Any data. Anywhere. AutoML, natural-language querying and one-click executive reports.",
    tags: ["FastAPI", "AutoML"],
  },
  {
    title: "WorkforceIQ",
    body: "50K employee records and 10K call transcripts through attrition prediction, clustering and sentiment scoring.",
    tags: ["Random Forest", "K-Means"],
  },
];

export const ABOUT = [
  "I build the layer between messy data and decisions people actually trust — pipelines that hold, models that are honest about their error, and reports a stakeholder can read in ninety seconds.",
  "Across internships at Frost & Sullivan, Infinite Computer Solutions and Zoho I have cleaned industry datasets, engineered forecasting features, migrated enterprise data between SQL and NoSQL stores, and cut reporting turnaround for teams that were doing it by hand.",
  "My centre of gravity is data engineering and analytics: ingestion, modelling, forecasting, and the communication that makes any of it matter. Increasingly that work overlaps with agentic AI, which is where I spend my own time.",
];

export const SKILLS = [
  {
    group: "Programming & data",
    items: [
      ["Python", 1],
      ["SQL", 1],
      ["Pandas", 1],
      ["NumPy", 0],
      ["N1QL", 0],
      ["Node.js", 0],
    ],
  },
  {
    group: "Machine learning & AI",
    items: [
      ["Machine Learning", 1],
      ["Prophet / SARIMAX", 1],
      ["Agentic AI", 1],
      ["Scikit-learn", 0],
      ["Random Forest", 0],
      ["K-Means", 0],
      ["RAG", 0],
      ["VADER / NLP", 0],
    ],
  },
  {
    group: "Data engineering",
    items: [
      ["ETL Pipelines", 1],
      ["Cleaning & EDA", 1],
      ["Microsoft Fabric", 1],
      ["Data Modeling", 0],
      ["Couchbase", 0],
      ["Data Profiling", 0],
      ["Schema Mapping", 0],
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      ["Google Cloud", 1],
      ["Docker", 0],
      ["Kubernetes", 0],
      ["Helm", 0],
      ["CI/CD", 0],
      ["FastAPI", 0],
    ],
  },
  {
    group: "Visualization & BI",
    items: [
      ["Tableau", 1],
      ["Plotly", 0],
      ["Chart.js", 0],
      ["Power Automate", 0],
      ["Executive Reporting", 0],
    ],
  },
  {
    group: "Practices & tools",
    items: [
      ["Git & GitHub", 0],
      ["Agile / Scrum", 0],
      ["REST APIs", 0],
      ["JWT + OAuth", 0],
      ["WebSocket", 0],
      ["RMSE / MAE / MAPE", 0],
    ],
  },
];

export const EXPERIENCE = [
  {
    company: "Frost & Sullivan",
    role: "Data & Analytics Intern",
    period: "Jun 2025 — Aug 2025",
    location: "Mumbai, India",
    logo: "frost-logo.png",
    bullets: [
      "Analysed large-scale industry datasets in Python, Pandas and SQL to support market intelligence, trend analysis and demand forecasting across two sectors.",
      "Built SARIMAX and Prophet forecasting models, handling cleaning, feature engineering and EDA to lift dataset reliability.",
      "Validated 10+ forecasting scenarios against RMSE, MAE and MAPE, feeding the outputs into internal research and consulting deliverables.",
      "Worked with a six-person analytics team to turn findings into client-facing business reports.",
    ],
    stack: ["Python", "SQL", "EDA", "Time Series", "Machine Learning"],
  },
  {
    company: "Infinite Computer Solutions",
    role: "Software Engineer Intern",
    period: "Apr 2025 — Jun 2025",
    location: "Bengaluru, India",
    logo: "infinite-logo.png",
    bullets: [
      "Built analytics microservices and automated KPI dashboards on Node.js, Couchbase (N1QL) and REST APIs, serving 20+ stakeholders and cutting report turnaround by 60%.",
      "Engineered ETL-style pipelines producing analytics-ready datasets, removing roughly four hours of manual reporting a week.",
      "Contributed to an IBM DB2 → Couchbase migration over a pub-sub architecture for scalable real-time analytics.",
      "Collaborated across engineering teams in Agile to test and optimise backend services.",
    ],
    stack: ["Node.js", "Couchbase", "N1QL", "ETL", "Pub-Sub"],
  },
  {
    company: "Zoho · DataPrep 2.0",
    role: "Summer Intern",
    period: "Jun 2024 — Jul 2024",
    location: "Chennai, India",
    logo: "zoho-logo.png",
    bullets: [
      "Learned data preparation end to end on Zoho DataPrep 2.0 — cleaning, transformation and validation.",
      "Worked hands-on with ETL workflows, data profiling and schema mapping.",
      "Assisted feature testing and dataset validation, surfacing data-quality issues during product development.",
      "Used SQL against sample datasets to trace transformation and analytics workflows.",
    ],
    stack: ["Zoho DataPrep", "ETL", "Data Profiling", "SQL"],
  },
];

export const PROJECTS = [
  {
    title: "Deploytual",
    tagline: "Deploy intelligence. Any data. Anywhere.",
    live: true,
    period: "Jun 2026 — Present",
    preview: "deploytual-preview.png",
    desc: "An AI analytics platform folding data connectivity, natural-language querying, AutoML and one-click reporting into a single deployable engine.",
    features: [
      ["Natural-language querying", "Plain English in, SQL or Pandas out."],
      ["AutoML engine", "Anomaly detection, Prophet forecasting and clustering with no ML expertise required."],
      ["AI cleaning studio", "Missing-value alerts, outlier detection, one-click fixes."],
      ["Explainable by default", "Every answer exposes the exact code that produced it."],
      ["One-click reports", "Boardroom PDFs with AI summaries, charts and forecasts."],
      ["Pipeline builder", "Plain-English commands compiled into ETL → ML → report workflows."],
    ],
    stack: ["Python", "FastAPI", "Pandas", "scikit-learn", "Prophet", "Docker", "Kubernetes", "Helm", "CI/CD"],
    actions: [
      ["Live demo", "https://deploytual.netlify.app/", true],
      ["GitHub", "https://github.com/sangramghose/Deploytual", false],
      ["API docs", "https://deploytual.onrender.com/docs", false],
    ],
  },
  {
    title: "WorkforceIQ",
    tagline: "Workforce analytics platform",
    live: false,
    period: "Jan 2026 — May 2026",
    preview: null,
    desc: "An end-to-end pipeline over 50K employee records and 10K call transcripts covering attrition prediction, segmentation and sentiment analysis.",
    features: [
      ["Attrition prediction", "Random Forest across 50K records at 85%+ accuracy."],
      ["Employee segmentation", "K-Means surfaced four behavioural personas, one high-risk."],
      ["Call sentiment", "VADER scoring of 10K transcripts, ~92% label agreement."],
      ["Interactive dashboards", "Tableau plus self-contained Plotly HTML."],
      ["Automated reporting", "Power Automate cut HR reporting turnaround by 60%."],
      ["Modular pipeline", "Every stage writes to disk — independently re-runnable."],
    ],
    stack: ["Python", "Pandas", "Scikit-learn", "NLTK", "Tableau", "Plotly", "Power Automate"],
    actions: [["View on GitHub", "https://github.com/sangramghose/Workforce-and-Industry-Trend-Analyzer", true]],
  },
];

export const EDUCATION = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "Gandhi Institute of Engineering and Technology University",
  location: "Gunupur, Odisha, India",
  period: "Aug 2023 — Present",
  note: "Expected graduation: June 2027",
  logo: "giet-logo.png",
};

export const CERTS = [
  {
    issuer: "Google Cloud",
    title: "Associate Cloud Engineer",
    meta: "Jul 2026 → Jul 2029",
    badge: "gcp-badge.png",
    skills: ["GCP", "GKE", "IAM"],
    href: "https://www.credly.com/badges/00aa87ff-d48f-4b9c-9282-800a1d5a45ef/public_url",
  },
  {
    issuer: "Nebius Academy",
    title: "Agentic AI Builder",
    meta: "Jul 2026",
    badge: "nebius-badge.png",
    skills: ["AI Agents", "RAG"],
    href: "https://www.credly.com/badges/5d0821dd-6916-48d6-b3a8-99170ca85762/public_url",
  },
  {
    issuer: "Microsoft",
    title: "Fabric Data Engineer Associate",
    meta: "May 2026 → May 2027",
    badge: "fabric-badge.png",
    skills: ["Fabric", "Ingestion"],
    href: "https://learn.microsoft.com/en-us/users/sangramkesharighose-1289/credentials/6b4e231e67ca56a",
  },
  {
    issuer: "SAP",
    title: "Business Data Cloud",
    meta: "Apr 2026 → Apr 2027",
    badge: "sap-badge.png",
    skills: ["SAP BDC", "Analytics"],
    href: "https://www.credly.com/badges/d1d7893b-7941-4cf2-8c4a-e60ce0ffb237/public_url",
  },
  {
    issuer: "Oracle",
    title: "Analytics Cloud 2025 Professional",
    meta: "Oct 2025 → Oct 2027",
    badge: "oracle-badge.png",
    skills: ["OAC", "Modeling"],
    href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=0BB79A43527A363EEFEE1781A86FB0ABE3578255543741933149A1E845EDE800",
  },
  {
    issuer: "Altair (RapidMiner)",
    title: "Machine Learning Professional",
    meta: "Sep 2025",
    badge: "ml-badge.png",
    skills: ["ML", "Clustering"],
    href: "https://openbadgefactory.com/obv3/credentials/dc5642318198228c654ed0695527511075261bff",
  },
  {
    issuer: "Altair (RapidMiner)",
    title: "Data Engineering Professional",
    meta: "Aug 2025",
    badge: "data-eng-badge.png",
    skills: ["Data Access", "Transformation"],
    href: "https://openbadgefactory.com/obv3/credentials/2ff63de886d187a4ff7a27ae751c75f6ab3656ff",
  },
];
