export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  mode: string;
  bannerUrl: string;
  gallery?: string;
  location?: string | null;
  venueAddress?: string | null;
  mapLink?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  regEndDate: string | Date;
  isPaid: boolean;
  prizePool?: string | null;
  minTeamSize?: number;
  maxTeamSize?: number;
  host?: {
    organizationName: string;
    isVerified: boolean;
    logo?: string | null;
  };
  ticketTiers?: Array<{
    price: number;
    name: string;
  }>;
}

export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: 'evt_pune_litfest_2026',
    slug: 'pune-literary-fest-deccan-book-reading-2026',
    title: 'Pune Literary Fest & Deccan Book Reading Circle 2026',
    tagline: 'An Intellectual Soirée of Contemporary Fiction, Marathi Sahitya, Poetry Open-Mic & Book Swaps',
    description: `### Welcome to Pune's Largest Literary & Book Lovers Gathering 📚\n\nSet against the heritage backdrop of Fergusson College and the British Council Library on FC Road, this edition brings together bibliophiles, fiction authors, literary translators, and poetry performers for a 2-day intellectual festival.\n\n#### 📖 Sessions & Highlights\n- Session 1: The Modern Indian Novel\n- Session 2: Treasures of Marathi Sahitya\n- Session 3: Sunset Book Exchange & Salon\n- Session 4: Youth Poetry & Spoken Word Slam`,
    category: 'WORKSHOP',
    mode: 'OFFLINE',
    bannerUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&auto=format&fit=crop&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80',
    ]),
    location: 'FC Road, Pune',
    venueAddress: 'Fergusson College Main Amphitheatre & British Council Library, FC Road, Shivajinagar, Pune - 411004',
    mapLink: 'https://maps.google.com/?q=Fergusson+College+Pune',
    startDate: new Date(Date.now() + 8 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    isPaid: false,
    prizePool: '₹50,000 in Grants',
    minTeamSize: 1,
    maxTeamSize: 1,
    host: {
      organizationName: 'Pune Literary Guild & TechNexus',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    ticketTiers: [{ price: 0, name: 'Free Community Pass' }, { price: 299, name: 'VIP Book Club Pass' }],
  },
  {
    id: 'evt_pune_sanskriti_2026',
    slug: 'sanskriti-2026-pune-cultural-mahotsav',
    title: 'Sanskriti 2026: Pune Inter-Collegiate Cultural Mahotsav',
    tagline: '3 Days of Classical Sangeet, Natyasangeet, Street Play, Fusion Bands & Folk Dance',
    description: `### Pune's Most Prestigious College Cultural Festival 🎭\n\nHosted at the historic Bal Gandharva Ranga Mandir in Shivajinagar, Sanskriti 2026 brings together 60+ colleges competing in theater, classical dance, Hindustani vocal battles, rock fusion bands, and fashion presentations.`,
    category: 'CULTURAL',
    mode: 'OFFLINE',
    bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    ]),
    location: 'JM Road, Pune',
    venueAddress: 'Bal Gandharva Ranga Mandir, JM Road, Shivajinagar, Pune - 411005',
    mapLink: 'https://maps.google.com/?q=Bal+Gandharva+Ranga+Mandir+Pune',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 17 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 11 * 86400000).toISOString(),
    isPaid: true,
    prizePool: '₹3,50,000',
    minTeamSize: 1,
    maxTeamSize: 12,
    host: {
      organizationName: 'Pune Cultural Forum',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    ticketTiers: [{ price: 199, name: 'Student Delegate Pass' }, { price: 449, name: 'VIP Concert Access Pass' }],
  },
  {
    id: 'evt_pune_poetry_slam_2026',
    slug: 'pune-sunset-poetry-spoken-word-slam-2026',
    title: 'Pune Sunset Poetry & Spoken Word Slam: Koregaon Park',
    tagline: 'Intimate Garden Reading, Acoustic Melodies, and Spoken Word Battles at Dusk',
    description: `### An Evening of Verse, Coffee, and Soulful Rhymes ☕✨\n\nNestled inside the garden courtyard of The French Window Patisserie in Koregaon Park, join Pune's most vibrant community of poets, storytellers, and acoustic musicians for a candlelit evening slam.`,
    category: 'MEETUP',
    mode: 'OFFLINE',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    ]),
    location: 'Koregaon Park, Pune',
    venueAddress: 'The French Window Patisserie & Gardens, Lane 5, Koregaon Park, Pune - 411001',
    mapLink: 'https://maps.google.com/?q=The+French+Window+Koregaon+Park+Pune',
    startDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 6.3 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    isPaid: false,
    prizePool: '₹20,000 + Memento',
    minTeamSize: 1,
    maxTeamSize: 1,
    host: {
      organizationName: 'Poetry Circle Pune',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    ticketTiers: [{ price: 0, name: 'Open Mic Performer Pass' }, { price: 149, name: 'Attendee & Beverage Pass' }],
  },
  {
    id: 'evt_pune_coep_robowars_2026',
    slug: 'coep-tech-pune-national-robowars-2026',
    title: 'COEP Tech Pune: National RoboWars & Autonomous Hardware Sprint 2026',
    tagline: 'High-Torque Combat Arenas, Line Followers, Drone Obstacle Racing, and Edge IoT Sprints',
    description: `### Maharashtra's Most Intense Robotics Battleground 🤖⚡\n\nOrganized at the prestigious COEP Technological University Main Ground in Shivajinagar, RoboWars 2026 brings together 80+ engineering institutions.`,
    category: 'CODING_CONTEST',
    mode: 'OFFLINE',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    ]),
    location: 'COEP, Shivajinagar, Pune',
    venueAddress: 'COEP Technological University, Wellesley Road, Shivajinagar, Pune - 411005',
    mapLink: 'https://maps.google.com/?q=COEP+Technological+University+Pune',
    startDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 16 * 86400000).toISOString(),
    isPaid: true,
    prizePool: '₹2,50,000',
    minTeamSize: 2,
    maxTeamSize: 5,
    host: {
      organizationName: 'COEP Robot Study Circle',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    },
    ticketTiers: [{ price: 499, name: 'RoboWars Team Pass' }, { price: 99, name: 'Spectator Arena Pass' }],
  },
  {
    id: 'evt_nexus_ai_2026',
    slug: 'nexus-ai-hackathon-2026',
    title: 'Nexus AI Hackathon 2026: The Agentic Frontier',
    tagline: '36 Hours to Build the Next Generation of Autonomous AI Systems & Multimodal Apps',
    description: `Step into the largest national AI hackathon where 1,000+ builders converge to solve real problems using Agentic Workflows, Multimodal Models, Edge AI, and Decentralized Intelligence.`,
    category: 'HACKATHON',
    mode: 'HYBRID',
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Hybrid',
    startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isPaid: false,
    prizePool: '₹5,00,000',
    minTeamSize: 1,
    maxTeamSize: 4,
    host: {
      organizationName: 'TechNexus Global',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    },
    ticketTiers: [{ price: 0, name: 'Hacker Pass (Free)' }, { price: 499, name: 'VIP Builder Bundle' }],
  },
  {
    id: 'evt_codesprint_2026',
    slug: 'national-codesprint-championship-2026',
    title: 'National CodeSprint Championship 2026',
    tagline: 'Speed, Logic & Algorithmic Supremacy: 5 Hard Problems, 120 Minutes',
    description: `Test your competitive coding abilities against India’s sharpest programmers in a fast-paced ICPC-style individual contest.`,
    category: 'CODING_CONTEST',
    mode: 'ONLINE',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 3.1 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    isPaid: false,
    prizePool: '₹2,00,000',
    minTeamSize: 1,
    maxTeamSize: 1,
    host: {
      organizationName: 'TechNexus Global',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    },
    ticketTiers: [{ price: 0, name: 'Contestant Pass' }],
  },
  {
    id: 'evt_stratedge_2026',
    slug: 'stratedge-national-business-case-2026',
    title: 'StratEdge 2026: National Business Case Challenge',
    tagline: 'Solve Disruptive GTM & M&A Scenarios for Rapidly Scaling Unicorns',
    description: `Organized by the IIM Bangalore Consulting Club, StratEdge invites undergraduate and MBA students to tackle an authentic growth strategy dilemma faced by an enterprise SaaS unicorn.`,
    category: 'CASE_STUDY',
    mode: 'HYBRID',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Online',
    startDate: new Date(Date.now() + 18 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    regEndDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    isPaid: true,
    prizePool: '₹3,00,000',
    minTeamSize: 2,
    maxTeamSize: 4,
    host: {
      organizationName: 'IIMB Strategy Network',
      isVerified: true,
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100',
    },
    ticketTiers: [{ price: 299, name: 'Team Case Pass' }],
  },
];
