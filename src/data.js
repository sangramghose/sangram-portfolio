export const DATA = {
  nav: [
    ["home", "Home"],
    ["highlights", "Highlights"],
    ["about", "About"],
    ["skills", "Skills"],
    ["experience", "Experience"],
    ["projects", "Projects"],
    ["education", "Education"],
    ["certifications", "Certifications"],
    ["contact", "Contact"]
  ],
  roles: ["Data Engineer", "AI Data Engineer", "Machine Learning Engineer", "Data Consultant", "Data Analyst"],
  tech: ["Python", "SQL", "Pandas", "Machine Learning", "Time Series", "Google Cloud", "Microsoft Fabric", "Agentic AI", "EDA", "Data Engineering"],
  highlights: [
    {icon:"building",title:"Industry Internships",body:"Hands-on experience at Frost & Sullivan, Infinite Computer Solutions, and Zoho — delivering real-world analytics and data solutions.",tag:"3 Companies",span:"span-5"},
    {icon:"agent",title:"Nebius Certified",body:"Agentic AI Builder — building autonomous AI agents, generative workflows, and RAG pipelines.",tag:"Agentic AI",span:"span-4"},
    {icon:"layers",title:"Microsoft Fabric",body:"Fabric Data Engineer Associate — end-to-end data engineering on Microsoft's unified analytics platform.",tag:"Certification",span:"span-3"},
    {icon:"cloud",title:"Google Cloud",body:"Associate Cloud Engineer — designing, deploying, and managing secure, scalable solutions on GCP.",tag:"Cloud",span:"span-3"},
    {icon:"rocket",title:"Deploytual",body:"Deploy intelligence. Any data. Anywhere. — AI-powered analytics platform with AutoML, NL querying & one-click reports.",tag:"Flagship Project",span:"span-5"},
    {icon:"chart",title:"WorkforceIQ",body:"End-to-end workforce analytics pipeline with attrition prediction, clustering & sentiment analysis on 50K+ records.",tag:"ML Pipeline",span:"span-4"}
  ],
  about: [
    "I'm <strong>Sangram Keshari Ghose</strong>, a Data Engineering &amp; Analytics professional who loves turning messy, large-scale datasets into reliable insights and production-ready systems.",
    "My journey has taken me through high-impact internships where I worked on industry datasets, built forecasting models, and collaborated with cross-functional teams to deliver consulting-grade deliverables.",
    "I specialize in <strong>Data Engineering &amp; Analytics</strong> — cleaning, modeling, forecasting, and communicating findings that actually move the needle.",
    "I enjoy working across industries that thrive on data-driven decisions, and I'm constantly exploring the intersection of traditional data engineering and modern AI systems."
  ],
  loved: ["Python", "SQL", "Pandas", "Time Series", "Machine Learning", "Google Cloud", "Microsoft Fabric", "Agentic AI"],
  skills: [
    {icon:"code",title:"Programming & Data",span:"span-4",items:[["Python",1],["SQL",1],["Pandas",1],["NumPy",0],["N1QL",0],["Node.js",0]]},
    {icon:"agent",title:"Machine Learning & AI",span:"span-8",items:[["Machine Learning",1],["Time Series (Prophet / SARIMAX)",1],["Scikit-learn",0],["Random Forest",0],["K-Means",0],["Agentic AI",1],["RAG",0],["VADER / NLP",0]]},
    {icon:"database",title:"Data Engineering",span:"span-7",items:[["ETL Pipelines",1],["Data Cleaning & EDA",1],["Data Modeling",0],["Microsoft Fabric",1],["Couchbase",0],["Data Profiling",0],["Schema Mapping",0]]},
    {icon:"cloud",title:"Cloud & DevOps",span:"span-5",items:[["Google Cloud (GCP)",1],["Docker",0],["Kubernetes",0],["Helm",0],["CI/CD",0],["FastAPI",0]]},
    {icon:"chart",title:"Visualization & BI",span:"span-5",items:[["Tableau",1],["Plotly",0],["Chart.js",0],["Power Automate",0],["Executive Reporting",0]]},
    {icon:"settings",title:"Practices & Tools",span:"span-7",items:[["Git & GitHub",0],["Agile / Scrum",0],["REST APIs",0],["JWT + OAuth",0],["WebSocket",0],["Model Evaluation (RMSE, MAE, MAPE)",0]]}
  ],
  exp: [
    {short:"FS",role:"Data & Analytics Intern",company:"Frost & Sullivan",duration:"Jun 2025 – Aug 2025",location:"Mumbai, Maharashtra, India",full:true,logo:"frost-logo.png",
      bullets:["Analyzed large-scale industry datasets using Python, Pandas, and SQL, supporting market intelligence, trend analysis, and demand forecasting across 2 industry sectors.","Assisted in developing SARIMAX and Prophet forecasting models while performing data cleaning, feature engineering, and exploratory data analysis (EDA) to improve the quality and reliability of forecasting datasets.","Evaluated forecasting models using RMSE, MAE, and MAPE, contributing to the validation of 10+ forecasting scenarios and preparing analytical outputs for internal research reports and consulting deliverables.","Collaborated with a 6-member analytics team to interpret market trends, prepare business reports, and translate analytical findings into data-driven insights that supported client presentations and strategic research projects."],
      stack:["Python","SQL","Machine Learning","Data Analysis","EDA","Time Series Forecasting"]},
    {short:"IC",role:"Software Engineer Intern",company:"Infinite Computer Solutions",duration:"Apr 2025 – Jun 2025",location:"Bengaluru, Karnataka, India",full:false,logo:"infinite-logo.png",
      bullets:["Developed analytics-focused microservices and automated KPI dashboards using Node.js, Couchbase (N1QL), and REST APIs, delivering real-time workforce analytics for 20+ stakeholders and reducing report turnaround time by 60%.","Engineered ETL-style data pipelines to extract, transform, and deliver analytics-ready datasets from Couchbase, automating recurring reporting workflows and eliminating approximately 4 hours of manual reporting effort per week.","Contributed to the migration of enterprise data from IBM DB2 (SQL) to Couchbase (NoSQL) using a Pub-Sub architecture, supporting scalable data processing, backend optimization, and real-time analytics.","Collaborated with cross-functional engineering teams in an Agile environment to build, test, and optimize backend services, improving application reliability, data quality, and performance for an enterprise analytics platform."],
      stack:["Node.js","Couchbase","N1QL","REST APIs","ETL Pipelines","Pub-Sub","Agile"]},
    {short:"ZO",role:"Summer Intern",company:"Zoho · DataPrep 2.0",duration:"Jun 2024 – Jul 2024",location:"Chennai, Tamil Nadu, India",full:false,logo:"zoho-logo.png",
      bullets:["Learned the fundamentals of Zoho DataPrep 2.0 and explored data preparation concepts, including data cleaning, transformation, and validation.","Gained hands-on experience with ETL workflows, data profiling, and schema mapping through guided tasks and product exploration.","Assisted in feature testing, dataset validation, and identifying data quality issues to support product development.","Worked with SQL and sample datasets to understand data preparation, transformation, and analytics workflows."],
      stack:["Zoho DataPrep","ETL","Data Profiling","SQL","Agile"]}
  ],
  proj: [
    {title:"Deploytual",tagline:"Deploy intelligence. Any data. Anywhere.",live:true,desc:"An AI-powered analytics platform that unifies data connectivity, natural language querying, automated machine learning, and one-click reporting into a single, deployable engine.",period:"Jun 2026 – Present",preview:"deploytual-preview.png",
      features:[["Natural Language Querying","Ask questions in plain English — AI converts them into SQL or Pandas automatically."],["AutoML Engine","Anomaly detection, time-series forecasting (Prophet), and clustering — zero ML expertise required."],["AI Data Cleaning Studio","Missing value alerts, outlier detection, and one-click fixes."],["Explainable AI + Storyteller","Every answer reveals the exact code. Built-in text-to-speech reads insights aloud."],["One-Click Executive Reports","Boardroom-ready PDFs with AI-written summaries, charts, and forecasts."],["End-to-End Pipeline Builder","Turn plain-English commands into fully automated ETL → ML → Report workflows."]],
      stack:["Python","FastAPI","Pandas","scikit-learn","Prophet","Docker","Kubernetes","Helm","CI/CD"],
      techStack:["Python","FastAPI","Pandas","scikit-learn","Prophet","Docker","Kubernetes","Helm","CI/CD"],
      actions:[["Live Demo","https://deploytual.netlify.app/",1],["GitHub","https://github.com/sangramghose/Deploytual",0],["API Docs","https://deploytual.onrender.com/docs",0]]},
    {title:"WorkforceIQ",tagline:"Workforce Analytics Platform",live:false,desc:"End-to-end analytics pipeline ingesting 50K+ employee records and 10K call transcripts with attrition prediction, clustering, and sentiment analysis.",period:"Jan 2026 – May 2026",preview:null,
      features:[["Attrition Prediction","Random Forest on 50K records achieving 85%+ accuracy."],["Employee Segmentation","K-Means clustering revealed 4 behavioral personas including a high-risk segment."],["Call Sentiment Analysis","VADER scoring of 10K transcripts with ~92% label agreement."],["Interactive Dashboards","Tableau + self-contained Plotly HTML dashboards."],["Automated Reporting","Power Automate cut manual HR reporting turnaround by 60%."],["Modular Pipeline","Every stage writes to disk — independent and re-runnable."]],
      stack:["Python","Pandas","Scikit-learn","NLTK","Tableau","Plotly","Power Automate"],
      techStack:["Python","Pandas","Scikit-learn","NLTK","Tableau","Plotly","Power Automate"],
      actions:[["View on GitHub","https://github.com/sangramghose/Workforce-and-Industry-Trend-Analyzer",1]]}
  ],
  cert: [
    {issuer:"Google Cloud",title:"Associate Cloud Engineer",desc:"Certified in deploying, managing, and monitoring cloud solutions on GCP.",meta:"Jul 2026 → Jul 2029",badge:"gcp-badge.png",skills:["GCP","GKE","IAM","Networking"],href:"https://www.credly.com/badges/00aa87ff-d48f-4b9c-9282-800a1d5a45ef/public_url",span:"span-5"},
    {issuer:"Nebius Academy",title:"Agentic AI Builder",desc:"Certified in building AI-powered applications, agentic workflows, and RAG pipelines.",meta:"Jul 2026",badge:"nebius-badge.png",skills:["AI Agents","Generative AI","RAG"],href:"https://www.credly.com/badges/5d0821dd-6916-48d6-b3a8-99170ca85762/public_url",span:"span-4"},
    {issuer:"Microsoft",title:"Fabric Data Engineer Associate",desc:"Certified in building and managing data analytics solutions and pipelines with Microsoft Fabric.",meta:"May 2026 → May 2027",badge:"fabric-badge.png",skills:["Fabric","Ingestion","Transformation"],href:"https://learn.microsoft.com/en-us/users/sangramkesharighose-1289/credentials/6b4e231e67ca56a",span:"span-3"},
    {issuer:"SAP",title:"SAP Business Data Cloud",desc:"Foundational expertise in analytics, data management, and enterprise data solutions.",meta:"Apr 2026 → Apr 2027",badge:"sap-badge.png",skills:["SAP BDC","Analytics"],href:"https://www.credly.com/badges/d1d7893b-7941-4cf2-8c4a-e60ce0ffb237/public_url",span:"span-4"},
    {issuer:"Oracle",title:"Analytics Cloud 2025 Professional",desc:"Expertise in data modeling, visualization, advanced analytics, and machine learning.",meta:"Oct 2025 → Oct 2027",badge:"oracle-badge.png",skills:["OAC","Modeling","ML"],href:"https://catalog-education.oracle.com/ords/certview/sharebadge?id=0BB79A43527A363EEFEE1781A86FB0ABE3578255543741933149A1E845EDE800",span:"span-4"},
    {issuer:"Altair (RapidMiner)",title:"Machine Learning Professional",desc:"Classification, regression, clustering, and feature importance.",meta:"Sep 2025",badge:"ml-badge.png",skills:["ML","Clustering"],href:"https://openbadgefactory.com/obv3/credentials/dc5642318198228c654ed0695527511075261bff",span:"span-4"},
    {issuer:"Altair (RapidMiner)",title:"Data Engineering Professional",desc:"Data access, transformations, multi-dataset workflows, and data processing.",meta:"Aug 2025",badge:"data-eng-badge.png",skills:["Data Access","Transformation"],href:"https://openbadgefactory.com/obv3/credentials/2ff63de886d187a4ff7a27ae751c75f6ab3656ff",span:"span-12"}
  ]
};

export const TESTIMONIALS = [
  {
    quote: "Sangram is a dedicated data professional with exceptional analytical skills. His contributions significantly improved our forecasting models.",
    name: "Jane Doe",
    role: "Senior Data Scientist"
  },
  {
    quote: "A fast learner and a great team player. Sangram consistently delivered high-quality work during his internship.",
    name: "John Smith",
    role: "Engineering Manager"
  },
  {
    quote: "His ability to turn complex data into actionable insights is impressive. Highly recommended for any data role.",
    name: "Alice Johnson",
    role: "Product Lead"
  }
];

export const ICONS = {
  building:'<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
  agent:'<path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>',
  layers:'<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  cloud:'<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
  chart:'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  home:'<path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  education:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  contact:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>'
};
