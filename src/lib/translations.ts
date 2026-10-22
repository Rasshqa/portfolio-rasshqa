export type Language = 'en' | 'id';

export interface Translations {
  nav: {
    home: string;
    about: string;
    works: string;
    achievements: string;
    contact: string;
    talk: string;
    themeTitle: string;
    langTitle: string;
    avatarToast: string;
  };
  intro: {
    hey: string;
    welcome: string;
  };
  hero: {
    greeting: string;
    roleTag: string;
    bio: string;
    viewWork: string;
    techStacks: string;
    stickers: {
      fullstackLine1: string;
      fullstackLine2: string;
      goodDesign: string[];
      designCodeShip: string[];
      creativityTech: {
        line1: string;
        line2: string;
      };
      createTogether: string[];
      buildCoolThings: string[];
    };
  };
  about: {
    tag: string;
    slideHeaders: {
      profile: string;
      story: string;
      tech: string;
    };
    slideTabs: {
      profile: string;
      story: string;
      tech: string;
    };
    profile: {
      fullName: string;
      primaryRole: string;
      focusAreas: string;
      location: string;
      yearsExp: string;
      projectsDone: string;
      satisfaction: string;
      connectTitle: string;
      directActionTitle: string;
      discussProject: string;
      chatWhatsApp: string;
    };
    story: {
      badge: string;
      lead: string;
      paragraphs: string[];
      pillarsTitle: string;
      pillars: {
        title: string;
        desc: string;
      }[];
    };
    tech: {
      badge: string;
      lead: string;
      frontend: string;
      backend: string;
      devops: string;
    };
  };
  works: {
    tag: string;
    title: string;
    lead: string;
    pageIndicator: (page: number, total: number) => string;
    viewLive: string;
    sourceCode: string;
    architectureTag: string;
    prev: string;
    next: string;
  };
  achievements: {
    tag: string;
    title: string;
    categories: {
      prestasi: string;
      sertifikat: string;
      artikel: string;
    };
    categoryHeaders: {
      prestasi: string;
      sertifikat: string;
      artikel: string;
    };
    prev: string;
    next: string;
  };
  contact: {
    tag: string;
    title: string;
    lead: string;
    emailLabel: string;
    whatsappLabel: string;
    locationLabel: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      successTitle: string;
      successDesc: string;
    };
  };
  footer: {
    canvasHint: string;
    replayIntro: string;
  };
  whatsapp: {
    headerStatus: string;
    bubbleTitle: string;
    bubbleDesc: string;
    topicLabel: string;
    topics: { id: string; label: string; text: string }[];
    customPlaceholder: string;
    sendButton: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      works: 'WORKS',
      achievements: 'ACHIEVEMENTS',
      contact: 'CONTACT',
      talk: "LET'S TALK",
      themeTitle: 'Toggle Theme (Circular Spread from Top Right)',
      langTitle: 'Switch Language (EN / ID)',
      avatarToast: 'Have a productive day! 🚀'
    },
    intro: {
      hey: 'Hey there',
      welcome: "Welcome to Rashqa's World"
    },
    hero: {
      greeting: "Hey, I'm",
      roleTag: '⚡ FULL STACK DEVELOPER',
      bio: 'I turn ideas into clean, robust & modern web experiences. Specializing in high-performance backends with Golang & Laravel, coupled with fluid Next.js & Vue frontends.',
      viewWork: 'VIEW MY WORK',
      techStacks: 'TECH STACKS',
      stickers: {
        fullstackLine1: 'FULL STACK',
        fullstackLine2: 'DEVELOPER',
        goodDesign: ['Good', 'Design', 'Better', 'Experience'],
        designCodeShip: ['Design.', 'Code.', 'Ship'],
        creativityTech: {
          line1: 'creativity',
          line2: 'technology'
        },
        createTogether: ["Let's", 'Create', 'Together'],
        buildCoolThings: ['BUILD', 'COOL', 'THINGS']
      }
    },
    about: {
      tag: '* ABOUT RASHQA',
      slideHeaders: {
        profile: '01. PROFILE OVERVIEW',
        story: '02. MY STORY & PHILOSOPHY',
        tech: '03. TECH STACK & EXPERTISE'
      },
      slideTabs: {
        profile: '1. Profile',
        story: '2. Story',
        tech: '3. Stacks'
      },
      profile: {
        fullName: 'FULL NAME',
        primaryRole: 'PRIMARY ROLE',
        focusAreas: 'SPECIALTIES & PASSION',
        location: 'BASE LOCATION',
        yearsExp: 'Years Exp',
        projectsDone: 'Projects Built',
        satisfaction: 'Code Quality',
        connectTitle: 'CONNECT ACROSS THE WEB',
        directActionTitle: 'DIRECT INITIATIVE',
        discussProject: 'Discuss a Project',
        chatWhatsApp: 'Chat via WhatsApp'
      },
      story: {
        badge: 'ENGINEERING ROOTS & VISION',
        lead: "Hi! I'm Rashqa Andrean Fitrah Sulaeman. I combine rock-solid backend architecture with tactile, expressive neo-brutalist web interfaces.",
        paragraphs: [
          'My programming path began with deep curiosity about how large-scale modern systems work from database layer to browser paint. Designing relational schemas in PostgreSQL is just as thrilling as perfecting micro-interactions in the frontend.',
          'I routinely build high-throughput APIs in Golang and Laravel, coupled with snappy, responsive client experiences powered by Next.js, React, and Vue.js.',
          'My driving philosophy centers on Clean Code, resilient system maintainability, and memorable, joyful user experiences.'
        ],
        pillarsTitle: 'THREE ARCHITECTURAL PILLARS',
        pillars: [
          {
            title: 'Robust Backend & APIs',
            desc: 'Golang (Fiber/Gin), Laravel, Python, REST & GraphQL, Microservices, Redis Caching.'
          },
          {
            title: 'Reactive Modern Frontend',
            desc: 'Next.js 16, Vue.js 3, TypeScript, Tailwind CSS v4, Dynamic State & Fluid Motion.'
          },
          {
            title: 'Cloud & Data Engineering',
            desc: 'Neon Serverless Postgres, MySQL, Docker Containerization, CI/CD, System Optimization.'
          }
        ]
      },
      tech: {
        badge: 'PRODUCTION-GRADE CAPABILITIES',
        lead: 'Curated tooling and runtime ecosystems I deploy to ship fast, reliable, resilient digital products.',
        frontend: 'Frontend Engineering',
        backend: 'Backend & Distributed Systems',
        devops: 'Databases & Infrastructure'
      }
    },
    works: {
      tag: '* SELECTED REPERTOIRE',
      title: 'FEATURED PROJECTS',
      lead: 'A showcase of full-stack applications, distributed microservices, and interactive web tools.',
      pageIndicator: (page, total) => `Slide ${page + 1} of ${total}`,
      viewLive: 'Live Demo',
      sourceCode: 'Source Code',
      architectureTag: 'Architecture',
      prev: 'Prev',
      next: 'Next'
    },
    achievements: {
      tag: '* MILESTONES & CREDENTIALS',
      title: 'ACHIEVEMENTS & CERTIFICATES',
      categories: {
        prestasi: 'Awards',
        sertifikat: 'Certificates',
        artikel: 'Articles'
      },
      categoryHeaders: {
        prestasi: 'Competitions & Hackathons Won',
        sertifikat: 'Verified Industry Licenses & Certs',
        artikel: 'Published Tech Insights & Articles'
      },
      prev: 'Previous',
      next: 'Next'
    },
    contact: {
      tag: '* INITIATE TRANSMISSION',
      title: "LET'S BUILD SOMETHING EXTRAORDINARY",
      lead: 'Whether you need a high-performance backend, an expressive web app, or an end-to-end full stack developer, I am ready to collaborate.',
      emailLabel: 'Direct Email',
      whatsappLabel: 'WhatsApp Line',
      locationLabel: 'Base Location',
      form: {
        title: 'Transmit an Instant Message',
        name: 'Your Name',
        namePlaceholder: 'e.g. John Doe',
        email: 'Your Email',
        emailPlaceholder: 'e.g. john@example.com',
        message: 'Project Scope or Note',
        messagePlaceholder: 'Tell me about what you would like to build...',
        send: 'TRANSMIT MESSAGE',
        sending: 'SENDING...',
        successTitle: 'Message Dispatched Successfully!',
        successDesc: 'Thank you for reaching out. I will get back to you shortly!'
      }
    },
    footer: {
      canvasHint: 'Interactive Canvas • Hold Left Click for Invert Lens • Click stickers to inspect',
      replayIntro: 'Replay Intro'
    },
    whatsapp: {
      headerStatus: 'Online • Fast responder',
      bubbleTitle: "Let's Connect Directly!",
      bubbleDesc: 'Have an urgent project, freelance offer, or tech inquiry? Pick a topic or type your note:',
      topicLabel: 'Choose Discussion Topic:',
      topics: [
        {
          id: 'Web Project',
          label: 'Web Project',
          text: "Hi Rashqa, I'm interested in discussing a full stack web/app project."
        },
        {
          id: 'Freelance',
          label: 'Freelance & Contract',
          text: 'Hi Rashqa, I would like to inquire about your freelance / contract availability.'
        },
        {
          id: 'Consultation',
          label: 'Tech Consultation',
          text: 'Hi Rashqa, I would like to consult on Next.js & backend architecture.'
        }
      ],
      customPlaceholder: 'Type your message...',
      sendButton: 'OPEN WHATSAPP'
    }
  },
  id: {
    nav: {
      home: 'BERANDA',
      about: 'TENTANG',
      works: 'KARYA',
      achievements: 'PENCAPAIAN',
      contact: 'KONTAK',
      talk: 'HUBUNGI SAYA',
      themeTitle: 'Ganti Tema (Spread Melingkar dari Kanan Atas)',
      langTitle: 'Ganti Bahasa (EN / ID)',
      avatarToast: 'Semoga harimu menyenangkan & produktif! 🚀'
    },
    intro: {
      hey: 'Halo di sana',
      welcome: 'Selamat Datang di Dunia Rashqa'
    },
    hero: {
      greeting: 'Halo, Saya',
      roleTag: '⚡ FULL STACK DEVELOPER',
      bio: 'Saya mengubah ide menjadi pengalaman web modern, tangguh, dan bersih. Berspesialisasi dalam backend performa tinggi dengan Golang & Laravel, dipadukan antarmuka Next.js & Vue yang luwes.',
      viewWork: 'LIHAT KARYA SAYA',
      techStacks: 'TEKNOLOGI SAYA',
      stickers: {
        fullstackLine1: 'FULL STACK',
        fullstackLine2: 'DEVELOPER',
        goodDesign: ['Desain', 'Apik', 'Pengalaman', 'Hebat'],
        designCodeShip: ['Desain.', 'Kode.', 'Rilis'],
        creativityTech: {
          line1: 'kreativitas',
          line2: 'teknologi'
        },
        createTogether: ['Mari', 'Berkarya', 'Bersama'],
        buildCoolThings: ['BANGUN', 'HAL', 'KEREN']
      }
    },
    about: {
      tag: '* TENTANG RASHQA',
      slideHeaders: {
        profile: '01. IKHTISAR PROFIL',
        story: '02. CERITA & FILOSOFI',
        tech: '03. KEAHLIAN & TEKNOLOGI'
      },
      slideTabs: {
        profile: '1. Profil',
        story: '2. Cerita',
        tech: '3. Stacks'
      },
      profile: {
        fullName: 'NAMA LENGKAP',
        primaryRole: 'PERAN UTAMA',
        focusAreas: 'FOKUS & SPESIALISASI',
        location: 'LOKASI DOMISILI',
        yearsExp: 'Tahun Pengalaman',
        projectsDone: 'Proyek Selesai',
        satisfaction: 'Standar Kualitas',
        connectTitle: 'JARINGAN & MEDIA SOSIAL',
        directActionTitle: 'INISIASI LANGSUNG',
        discussProject: 'Diskusi Proyek',
        chatWhatsApp: 'Chat via WhatsApp'
      },
      story: {
        badge: 'ARUS TEKNOLOGI & VISI',
        lead: 'Hai! Saya Rashqa Andrean Fitrah Sulaeman. Saya memadukan arsitektur backend yang kokoh dengan antarmuka web neo-brutalis yang ekspresif dan taktil.',
        paragraphs: [
          'Perjalanan saya di dunia pemrograman didorong oleh rasa ingin tahu mendalam bagaimana sistem modern bekerja dari hulu ke hilir. Dari mendesain skema relasional di PostgreSQL hingga meracik micro-interactions di frontend.',
          'Saya terbiasa membangun API berkinerja tinggi menggunakan Golang dan Laravel, serta menghadirkan antarmuka reaktif tanpa kompromi menggunakan Next.js, React, dan Vue.js.',
          'Prinsip utama saya adalah Clean Code, arsitektur yang mudah dirawat (maintainable), dan pengalaman pengguna (UX) yang berkesan serta menyenangkan.'
        ],
        pillarsTitle: 'TIGA PILAR ARSITEKTUR',
        pillars: [
          {
            title: 'Backend & API Tangguh',
            desc: 'Golang (Fiber/Gin), Laravel, Python, REST & GraphQL, Microservices, Caching Redis.'
          },
          {
            title: 'Frontend Modern Reaktif',
            desc: 'Next.js 16, Vue.js 3, TypeScript, Tailwind CSS v4, Dynamic State & Fluid Motion.'
          },
          {
            title: 'Cloud & Rekayasa Data',
            desc: 'Neon Serverless Postgres, MySQL, Docker Containerization, CI/CD, System Optimization.'
          }
        ]
      },
      tech: {
        badge: 'STANDAR KEAHLIAN PRODUKSI',
        lead: 'Ekosistem teknologi terkurasi yang saya gunakan untuk merilis produk digital yang cepat, stabil, dan berskala tinggi.',
        frontend: 'Rekayasa Frontend',
        backend: 'Backend & Sistem Terdistribusi',
        devops: 'Basis Data & Infrastruktur'
      }
    },
    works: {
      tag: '* KARYA TERPILIH',
      title: 'PROYEK UNGGULAN',
      lead: 'Menampilkan portofolio rekayasa full stack, arsitektur sistem backend, dan aplikasi web interaktif.',
      pageIndicator: (page, total) => `Slide ${page + 1} dari ${total}`,
      viewLive: 'Lihat Demo',
      sourceCode: 'Kode Sumber',
      architectureTag: 'Arsitektur',
      prev: 'Sebelumnya',
      next: 'Selanjutnya'
    },
    achievements: {
      tag: '* PENCAPAIAN & KREDENSIAL',
      title: 'PRESTASI & SERTIFIKAT',
      categories: {
        prestasi: 'Prestasi',
        sertifikat: 'Sertifikat',
        artikel: 'Artikel'
      },
      categoryHeaders: {
        prestasi: 'Penghargaan Kompetisi & Hackathon',
        sertifikat: 'Lisensi & Sertifikasi Industri Terverifikasi',
        artikel: 'Publikasi Tulisan & Analisis Teknologi'
      },
      prev: 'Sebelumnya',
      next: 'Selanjutnya'
    },
    contact: {
      tag: '* MULAI HUBUNGI',
      title: 'MARI BANGUN SESUATU YANG LUAR BIASA',
      lead: 'Apakah kamu memerlukan backend performa tinggi, aplikasi web ekspresif, atau pengembang full stack dari hulu ke hilir, saya siap berkolaborasi.',
      emailLabel: 'Email Langsung',
      whatsappLabel: 'Nomor WhatsApp',
      locationLabel: 'Domisili',
      form: {
        title: 'Kirimkan Pesan Instan',
        name: 'Nama Lengkap',
        namePlaceholder: 'contoh: Budi Santoso',
        email: 'Alamat Email',
        emailPlaceholder: 'contoh: budi@gmail.com',
        message: 'Rencana / Detail Proyek',
        messagePlaceholder: 'Ceritakan apa yang ingin kamu buat bersama saya...',
        send: 'KIRIMKAN PESAN',
        sending: 'MENGIRIM...',
        successTitle: 'Pesan Berhasil Terkirim!',
        successDesc: 'Terima kasih telah menghubungi saya. Saya akan segera membalas!'
      }
    },
    footer: {
      canvasHint: 'Kanvas Interaktif • Tahan Klik Kiri untuk Invert Lens • Klik stiker untuk inspeksi',
      replayIntro: 'Putar Ulang Intro'
    },
    whatsapp: {
      headerStatus: 'Online • Biasanya balas cepat',
      bubbleTitle: 'Mari Terhubung Langsung!',
      bubbleDesc: 'Ada ide proyek, penawaran kerja sama, atau ingin berdiskusi teknologi? Pilih topik cepat atau ketik pesanmu:',
      topicLabel: 'Pilih Topik Diskusi:',
      topics: [
        {
          id: 'Proyek Web',
          label: 'Proyek Web',
          text: 'Halo Rashqa, saya tertarik untuk diskusi proyek web / aplikasi full stack.'
        },
        {
          id: 'Freelance',
          label: 'Freelance & Kontrak',
          text: 'Halo Rashqa, mau tanya ketersediaan untuk kolaborasi freelance / pekerjaan.'
        },
        {
          id: 'Konsultasi',
          label: 'Konsultasi Teknologi',
          text: 'Halo Rashqa, mau konsultasi seputar arsitektur tech stack Next.js & backend.'
        }
      ],
      customPlaceholder: 'Ketik pesan custom kamu...',
      sendButton: 'BUKA WHATSAPP'
    }
  }
};
