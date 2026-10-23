export interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  metrics: string;
  accent: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
  category: 'PRESTASI' | 'SERTIFIKAT' | 'ARTIKEL';
  description: string;
  badge: string;
  accent: string;
  imageUrl?: string;
}

export interface PortfolioData {
  profile: {
    fullName: string;
    nickName: string;
    role: string;
    subRole: string;
    headline: string;
    bio: string;
    location: string;
    email: string;
    whatsapp: string;
    github: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
    photoUrl?: string;
    stats: {
      experience: string;
      projects: string;
      satisfaction: string;
    };
  };
  aboutStory: {
    heading: string;
    lead: string;
    paragraphs: string[];
    pillars: { title: string; desc: string; bg: string }[];
  };
  techStacks: {
    category: string;
    color: string;
    skills: { name: string; level: string; icon: string }[];
  }[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
}

export const initialPortfolioData: PortfolioData = {
  profile: {
    fullName: "Rashqa Andrean Fitrah Sulaeman",
    nickName: "RASHQA",
    role: "FULL STACK DEVELOPER",
    subRole: "Software Engineer • System Architect • Creative Technologist",
    headline: "Hey, I'm",
    bio: "I turn ideas into clean, robust & modern web experiences. Specializing in high-performance backends with Golang & Laravel, coupled with fluid Next.js & Vue frontends.",
    location: "Indonesia",
    email: "rashqaandrean@gmail.com",
    whatsapp: "6285723894370",
    github: "https://github.com/rasshqa",
    linkedin: "https://id.linkedin.com/in/rashqa-andrean-fitrah-sulaeman-58041b366",
    instagram: "https://instagram.com/rasshqa.tsx",
    tiktok: "https://tiktok.com/@rasshqa",
    photoUrl: "/rashqa.png",
    stats: {
      experience: "4+ Years",
      projects: "20+ Built",
      satisfaction: "100% Quality"
    }
  },
  aboutStory: {
    heading: "FULL STACK DEVELOPER & SOFTWARE ENGINEER",
    lead: "Hi! I'm Rashqa Andrean Fitrah Sulaeman. I blend rock-solid backend architectures with expressive, tactile, neo-brutalist web interfaces.",
    paragraphs: [
      "Perjalanan saya di dunia pemrograman didorong oleh rasa ingin tahu mendalam bagaimana sistem modern bekerja dari hulu ke hilir. Dari mendesain skema relasional di PostgreSQL hingga meracik micro-interactions di frontend.",
      "Saya terbiasa membangun API berkinerja tinggi menggunakan Golang dan Laravel, serta menghadirkan antarmuka reaktif tanpa kompromi menggunakan Next.js, React, dan Vue.js.",
      "Prinsip utama saya adalah Clean Code, arsitektur yang mudah dirawat (maintainable), dan pengalaman pengguna (UX) yang berkesan serta menyenangkan."
    ],
    pillars: [
      {
        title: "Robust Backend & APIs",
        desc: "Golang (Fiber/Gin), Laravel, Python, REST & GraphQL, Microservices, Caching Redis.",
        bg: "bg-[#bae6fd]"
      },
      {
        title: "Reactive Modern Frontend",
        desc: "Next.js 16, Vue.js 3, TypeScript, Tailwind CSS v4, Dynamic State & Fluid Motion.",
        bg: "bg-[#a7f3d0]"
      },
      {
        title: "Cloud & Data Engineering",
        desc: "Neon Serverless Postgres, MySQL, Docker Containerization, CI/CD, System Optimization.",
        bg: "bg-[#fbcfe8]"
      }
    ]
  },
  techStacks: [
    {
      category: "Frontend Stack",
      color: "#38bdf8",
      skills: [
        { name: "Next.js (App Router)", level: "Advanced", icon: "▲" },
        { name: "Vue.js / Nuxt", level: "Advanced", icon: "V" },
        { name: "React 19", level: "Advanced", icon: "RE" },
        { name: "TypeScript", level: "Proficient", icon: "TS" },
        { name: "Tailwind CSS v4", level: "Expert", icon: "TW" }
      ]
    },
    {
      category: "Backend Stack",
      color: "#34d399",
      skills: [
        { name: "Golang (Fiber / Gin)", level: "Advanced", icon: "GO" },
        { name: "Laravel (PHP)", level: "Advanced", icon: "LV" },
        { name: "Python (FastAPI)", level: "Proficient", icon: "PY" },
        { name: "Node.js / Express", level: "Proficient", icon: "JS" },
        { name: "RESTful & Webhooks", level: "Expert", icon: "API" }
      ]
    },
    {
      category: "Databases & DevOps",
      color: "#f472b6",
      skills: [
        { name: "Neon (Serverless Postgres)", level: "Advanced", icon: "PG" },
        { name: "MySQL / MariaDB", level: "Advanced", icon: "SQL" },
        { name: "Redis Caching", level: "Proficient", icon: "RD" },
        { name: "Docker & Compose", level: "Proficient", icon: "DK" },
        { name: "Git & CI/CD Pipelines", level: "Advanced", icon: "GIT" }
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "TastyFood Culinary Platform",
      tag: "NEXT.JS • LARAVEL • MYSQL",
      desc: "Platform pemesanan kuliner end-to-end dengan pemantauan pesanan real-time, invoice instan, dan integrasi payment gateway otomatis.",
      metrics: "10K+ Monthly Req • Sub-second Response",
      accent: "#38bdf8",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/TastyFood",
      githubUrl: "https://github.com/rasshqa/TastyFood"
    },
    {
      id: "proj-2",
      title: "Ticketiki Event Booking Engine",
      tag: "GOLANG • NEXT.JS • NEON",
      desc: "Sistem reservasi tiket acara berkecepatan tinggi dengan concurrent locking seats, QR scanner gate, dan reporting analytics.",
      metrics: "Sub-40ms P99 • High Concurrency",
      accent: "#fde047",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/Ticketiki",
      githubUrl: "https://github.com/rasshqa/Ticketiki"
    },
    {
      id: "proj-3",
      title: "Plasma Audio Visualizer",
      tag: "WEB AUDIO API • VUE.JS • THREE.JS",
      desc: "Visualisator audio interaktif berbasis browser dengan rendering partikel 3D, FFT frequency analysis, dan respon latensi rendah.",
      metrics: "60 FPS Render • Web Audio Hardware Sync",
      accent: "#a7f3d0",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/plasma-audio-visualizer",
      githubUrl: "https://github.com/rasshqa/plasma-audio-visualizer"
    },
    {
      id: "proj-4",
      title: "Waifu AI Interactive Companion",
      tag: "PYTHON • FASTAPI • REACT",
      desc: "Agen kecerdasan buatan percakapan kontekstual dengan speech synthesis, vector memory retrieval, dan streaming completions.",
      metrics: "Streaming Tokens • Long-term Vector Memory",
      accent: "#f472b6",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/waifu-ai",
      githubUrl: "https://github.com/rasshqa/waifu-ai"
    },
    {
      id: "proj-5",
      title: "OpenDots Design System",
      tag: "TYPESCRIPT • TAILWIND • STORYBOOK",
      desc: "Koleksi komponen UI neo-brutalisme modular yang dapat disesuaikan untuk prototyping cepat dengan aksesibilitas tinggi.",
      metrics: "Zero CSS Runtime • 100% Type-safe",
      accent: "#fb923c",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/OpenDots",
      githubUrl: "https://github.com/rasshqa/OpenDots"
    },
    {
      id: "proj-6",
      title: "LDKS Registration Portal",
      tag: "LARAVEL • INERTIA • VUE.JS",
      desc: "Portal seleksi dan pendaftaran kepemimpinan siswa dengan alur verifikasi berkas multi-tahap dan dashboard scoring juri.",
      metrics: "500+ Pendaftar • Automated Verification",
      accent: "#c084fc",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/ldks-registration",
      githubUrl: "https://github.com/rasshqa/ldks-registration"
    },
    {
      id: "proj-7",
      title: "FreeLLM Reverse Proxy Gateway",
      tag: "GOLANG • REDIS • DOCKER",
      desc: "Reverse proxy load-balancer untuk aneka AI models dengan failover otomatis, rate limiter token, dan caching respons.",
      metrics: "Zero Memory Overhead • In-memory Cache",
      accent: "#4ade80",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/freellmapi",
      githubUrl: "https://github.com/rasshqa/freellmapi"
    },
    {
      id: "proj-8",
      title: "Portfolio Rasshqa (Neo-Brutalist)",
      tag: "NEXT.JS 16 • NEON • TAILWIND V4",
      desc: "Portfolio interaktif dengan dynamic inspectable box, invert lens hold, slide system, dan integrasi database serverless Neon.",
      metrics: "Next.js 16 App Router • React 19",
      accent: "#60a5fa",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
      liveUrl: "https://github.com/rasshqa/portfolio-rasshqa",
      githubUrl: "https://github.com/rasshqa/portfolio-rasshqa"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      year: "2025",
      title: "Juara 1 Web Application Development",
      issuer: "National Technology Expo",
      category: "PRESTASI",
      description: "Merancang dan membangun arsitektur aplikasi web full stack berkinerja tinggi dalam kompetisi hackathon nasional.",
      badge: "CHAMPION",
      accent: "#fde047",
      imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "ach-2",
      year: "2025",
      title: "Professional Full Stack Web Certification",
      issuer: "Global Software Engineering Institute",
      category: "SERTIFIKAT",
      description: "Sertifikasi keahlian arsitektur web modern, Next.js, API security, dan deployment arsitektur cloud skalabel.",
      badge: "CERTIFIED",
      accent: "#38bdf8",
      imageUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "ach-3",
      year: "2024",
      title: "Golang Backend & High Concurrency Specialist",
      issuer: "Cloud & Systems Certification",
      category: "SERTIFIKAT",
      description: "Verifikasi kompetensi pemrograman Go, goroutines concurrency, microservices, dan relational database tuning.",
      badge: "ADVANCED",
      accent: "#a7f3d0",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "ach-4",
      year: "2024",
      title: "Top Open Source Project Contributor",
      issuer: "Developer Ecosystem Bandung",
      category: "PRESTASI",
      description: "Apresiasi atas kontribusi pembuatan modul dan library open source yang digunakan oleh komunitas pengembang lokal.",
      badge: "AWARDS",
      accent: "#f472b6",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "ach-5",
      year: "2026",
      title: "Membangun Arsitektur Microservices dengan Golang & Next.js",
      issuer: "Technical Publication",
      category: "ARTIKEL",
      description: "Panduan mendalam mengenai komunikasi gRPC/REST antara backend Go yang cepat dengan Next.js App Router.",
      badge: "PUBLISHED",
      accent: "#c084fc",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "ach-6",
      year: "2026",
      title: "Optimasi Query Database PostgreSQL pada Serverless Neon",
      issuer: "Technical Publication",
      category: "ARTIKEL",
      description: "Eksplorasi strategi branching, connection pooling, dan cold-start optimization pada arsitektur Lakebase Postgres.",
      badge: "PUBLISHED",
      accent: "#fb923c",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80"
    }
  ]
};
