import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sushanti comprehensive database seed...');

  // Clean existing tables (in correct relational order)
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.review.deleteMany();
  await prisma.score.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.ticketTier.deleteMany();
  await prisma.eventRound.deleteMany();
  await prisma.teammatePost.deleteMany();
  await prisma.event.deleteMany();
  await prisma.hostMember.deleteMany();
  await prisma.hostProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users
  const userAlex = await prisma.user.create({
    data: {
      id: 'usr_alex',
      name: 'Alex Rivera',
      email: 'alex@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      headline: 'Full-Stack Developer & AI Systems Builder',
      bio: 'Final year CS undergrad building autonomous agents, Next.js apps, and distributed systems. 3x Hackathon winner.',
      college: 'Indian Institute of Technology (IIT) Delhi',
      skills: JSON.stringify(['TypeScript', 'Next.js', 'Python', 'PyTorch', 'PostgreSQL', 'TailwindCSS', 'Docker']),
      links: JSON.stringify({
        github: 'https://github.com/alexrivera-dev',
        linkedin: 'https://linkedin.com/in/alexrivera-dev',
        twitter: 'https://twitter.com/alex_builds',
        website: 'https://alexrivera.dev',
      }),
      role: 'CONSUMER',
      activeMode: 'CONSUMER',
    },
  });

  const userPriya = await prisma.user.create({
    data: {
      id: 'usr_priya',
      name: 'Priya Sharma',
      email: 'priya@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      headline: 'Tech Community Director & DevRel at TechNexus',
      bio: 'Organizing developer hackathons, community meetups, and open-source initiatives across India.',
      college: 'BITS Pilani',
      skills: JSON.stringify(['Community Building', 'DevRel', 'Event Management', 'Cloud Architecture']),
      links: JSON.stringify({
        twitter: 'https://twitter.com/priyasharma_dev',
        linkedin: 'https://linkedin.com/in/priyasharma-lead',
      }),
      role: 'HOST',
      activeMode: 'HOST',
    },
  });

  const userRohit = await prisma.user.create({
    data: {
      id: 'usr_rohit',
      name: 'Rohit Verma',
      email: 'rohit@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      headline: 'Product Designer & Frontend Craftsman',
      bio: 'Obsessed with fluid micro-interactions, typography, and Framer Motion. Looking for hackathon teams!',
      college: 'National Institute of Design (NID) / Delhi Tech University',
      skills: JSON.stringify(['Figma', 'UI/UX Design', 'React', 'TailwindCSS', 'Design Systems', '3D Blender']),
      links: JSON.stringify({
        github: 'https://github.com/rohitverma-ui',
        linkedin: 'https://linkedin.com/in/rohitverma-design',
      }),
      role: 'CONSUMER',
      activeMode: 'CONSUMER',
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      id: 'usr_admin',
      name: 'Sushanti Super Admin',
      email: 'admin@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      headline: 'Platform Operations & Integrity Lead',
      bio: 'Overseeing event compliance, host verifications, and trust & safety across Sushanti.',
      role: 'ADMIN',
      activeMode: 'CONSUMER',
    },
  });

  // 2. Create Host Organizations
  const hostTechNexus = await prisma.hostProfile.create({
    data: {
      id: 'host_technexus',
      userId: userPriya.id,
      organizationName: 'TechNexus Innovation Guild',
      slug: 'technexus',
      type: 'COMMUNITY',
      tagline: 'India’s premier developer community fostering AI, Web3, and Open Source talent',
      bio: 'TechNexus has organized over 40+ hackathons and conferences connecting 25,000+ engineers with high-growth startups and tech giants.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      website: 'https://technexus.community',
      isVerified: true,
      followersCount: 14200,
      socialLinks: JSON.stringify({
        twitter: 'https://twitter.com/technexus_dev',
        linkedin: 'https://linkedin.com/company/technexus-guild',
        discord: 'https://discord.gg/technexus',
      }),
    },
  });

  const hostIIMB = await prisma.hostProfile.create({
    data: {
      id: 'host_iimb',
      userId: userAdmin.id,
      organizationName: 'IIM Bangalore Consulting Club',
      slug: 'iimb-consulting',
      type: 'CLUB',
      tagline: 'Leading student-run strategy & business consulting cell in Asia',
      bio: 'Driving real-world problem solving through corporate challenges, case studies, and boardroom simulations.',
      logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      website: 'https://iimb.ac.in',
      isVerified: true,
      followersCount: 8900,
    },
  });

  // 3. Create Rich Events
  // Event 1: Nexus AI Hackathon 2026
  const eventNexus = await prisma.event.create({
    data: {
      id: 'evt_nexus_ai_2026',
      slug: 'nexus-ai-hackathon-2026',
      title: 'Nexus AI Hackathon 2026: The Agentic Frontier',
      tagline: '36 Hours to Build the Next Generation of Autonomous AI Systems & Multimodal Apps',
      description: `### Welcome to Nexus AI 2026 🚀

Step into the largest national AI hackathon where 1,000+ builders converge to solve real problems using Agentic Workflows, Multimodal Models, Edge AI, and Decentralized Intelligence.

#### 💡 Tracks
- **Track 1: Autonomous Agent Architectures** - Multi-agent systems, tool use, memory optimization, and reasoning loops.
- **Track 2: Healthcare & Life Sciences AI** - Diagnostic assistants, clinical trials synthesis, and assistive vision.
- **Track 3: Fintech & Fraud Prevention** - Real-time fraud detection, voice verification, and algorithmic risk hedges.
- **Track 4: Developer Supertools** - Automated testing, codebase refactoring agents, and continuous deployment bots.

#### 🏆 Judging Rubric
1. **Innovation & Originality (25%)**: How novel is the approach?
2. **Technical Depth & Execution (30%)**: Quality of code, architecture, and tool usage.
3. **UX & Product Polish (25%)**: Delightful user interface, responsive layout, and seamless error handling.
4. **Viability & Impact (20%)**: Does this solve a real market pain point?`,
      category: 'HACKATHON',
      mode: 'HYBRID',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      ]),
      logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80',
      location: 'Viman Nagar, Pune',
      venueAddress: 'Hyatt Regency Pune & Weikfield IT Info Park, Viman Nagar, Pune - 411014',
      mapLink: 'https://maps.google.com/?q=Hyatt+Regency+Pune+Weikfield+IT+Info+Park+Viman+Nagar+Pune+411014',
      speakers: JSON.stringify([
        {
          name: 'Dr. Pushmeet Kohli',
          role: 'VP of Research',
          company: 'Google DeepMind',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          bio: 'Pioneer in AI reliability, scientific machine learning, and reasoning agents.',
          twitter: 'https://twitter.com',
        },
        {
          name: 'Dr. Anand Deshpande',
          role: 'Founder & Chairman',
          company: 'Persistent Systems Pune',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          bio: 'Leading IT visionary and technology entrepreneur championing Pune startups.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Mira Murati',
          role: 'AI Systems Pioneer & Technologist',
          company: 'Former CTO OpenAI',
          photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
          bio: 'Architect of breakthrough conversational models and multimodal interfaces.',
          twitter: 'https://twitter.com',
        },
      ]),
      meetingUrl: 'https://meet.sushanti.dev/nexus-ai-2026',
      startDate: new Date(Date.now() + 10 * 86400000), // in 10 days
      endDate: new Date(Date.now() + 12 * 86400000),
      regStartDate: new Date(Date.now() - 5 * 86400000),
      regEndDate: new Date(Date.now() + 8 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: true,
      visibility: 'PUBLIC',
      minTeamSize: 1,
      maxTeamSize: 4,
      prizePool: '₹5,00,000',
      prizes: JSON.stringify([
        { title: 'Grand Champion (1st Place)', amount: '₹2,50,000', perks: 'Fast-track funding interview + $10,000 Cloud credits + Winner Trophy' },
        { title: 'Runner Up (2nd Place)', amount: '₹1,50,000', perks: '$5,000 Cloud credits + Tech Gear Bundle' },
        { title: 'Second Runner Up (3rd Place)', amount: '₹1,00,000', perks: '$2,500 Cloud credits + Official Merch Kit' },
        { title: 'Best Agentic Architecture Track', amount: '₹50,000', perks: 'Sponsored by Anthropic & OpenAI credits' },
      ]),
      sponsors: JSON.stringify([
        { name: 'Google Cloud', tier: 'Title Partner', logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80' },
        { name: 'NVIDIA AI', tier: 'Compute Partner', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80' },
        { name: 'GitHub', tier: 'Ecosystem Partner', logo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&auto=format&fit=crop&q=80' },
      ]),
      eligibilityCriteria: JSON.stringify([
        'Open to all students, developers, and tech professionals across the globe.',
        'Teams can consist of 1 to 4 members. Cross-college and cross-company teams are encouraged.',
        'All code must be authored during the 36-hour hackathon window.',
      ]),
      rules: `### Official Rules
- Projects must be committed to a public GitHub repository.
- Use of open-source frameworks and AI APIs is fully permitted with attribution.
- Plagiarism or pre-built code will result in immediate disqualification.`,
      faqs: JSON.stringify([
        { question: 'Is participation completely free?', answer: 'Yes! The Student and General Developer passes are 100% free with meals, swag, and cloud credits included for shortlisted finalists.' },
        { question: 'Can I participate virtually if I cannot travel to Bengaluru?', answer: 'Absolutely. Nexus AI is fully hybrid. Virtual teams have equal access to mentors, judging stages, and prize tracks.' },
        { question: 'I don’t have a team yet. Can I still register?', answer: 'Yes! Register individually and use Sushanti’s "Find Teammates" board to match with designers, developers, and domain experts.' },
      ]),
      customFields: JSON.stringify([
        { id: 'fld_track', label: 'Primary Track of Interest', type: 'select', required: true, options: ['Autonomous Agents', 'Healthcare AI', 'Fintech & Risk', 'Developer Supertools'] },
        { id: 'fld_github', label: 'GitHub Profile URL', type: 'text', required: true },
        { id: 'fld_discord', label: 'Discord Username for Mentor Channels', type: 'text', required: true },
        { id: 'fld_tshirt', label: 'T-Shirt Size (for Swag Pack)', type: 'select', required: false, options: ['S', 'M', 'L', 'XL', 'XXL'] },
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 12480,
    },
  });

  // Ticket tiers for Nexus AI
  const tierFreeNexus = await prisma.ticketTier.create({
    data: {
      eventId: eventNexus.id,
      name: 'Hacker Pass (Standard)',
      description: 'Full access to hackathon, workshops, mentorship sessions, and cloud credits.',
      price: 0,
      capacity: 800,
      available: 450,
      perks: JSON.stringify(['36-Hour Hackathon Access', 'Mentorship Booking', '$200 Cloud API Credits', 'Digital Verifiable Certificate']),
    },
  });

  const tierVIPNexus = await prisma.ticketTier.create({
    data: {
      eventId: eventNexus.id,
      name: 'VIP Builder & Swag Bundle',
      description: 'Guaranteed physical swag box delivered to doorstep + priority demo slot with VC jury.',
      price: 499,
      capacity: 150,
      available: 64,
      perks: JSON.stringify(['All Hacker Pass Perks', 'Limited Edition Hoodie & Swag Box', 'Priority 1v1 Jury Pitch', 'VIP Networking Dinner Access']),
    },
  });

  // Rounds for Nexus AI
  await prisma.eventRound.createMany({
    data: [
      {
        eventId: eventNexus.id,
        order: 1,
        title: 'Round 1: Idea Pitch & Architecture Blueprint',
        description: 'Submit your problem statement, target users, and proposed architectural diagram.',
        type: 'SUBMISSION',
        startDate: new Date(Date.now() + 10 * 86400000),
        endDate: new Date(Date.now() + 10.5 * 86400000),
        isElimination: false,
      },
      {
        eventId: eventNexus.id,
        order: 2,
        title: 'Round 2: Working MVP & Codebase Evaluation',
        description: 'Submit your GitHub repository, video walkthrough, and live deployment link.',
        type: 'SUBMISSION',
        startDate: new Date(Date.now() + 10.5 * 86400000),
        endDate: new Date(Date.now() + 11.5 * 86400000),
        isElimination: true,
      },
      {
        eventId: eventNexus.id,
        order: 3,
        title: 'Round 3: Grand Finale Demo Day',
        description: 'Top 10 shortlisted finalists pitch live to top tech venture capitalists and tech leads.',
        type: 'PRESENTATION',
        startDate: new Date(Date.now() + 11.5 * 86400000),
        endDate: new Date(Date.now() + 12 * 86400000),
        isElimination: false,
      },
    ],
  });

  // Event 2: National CodeSprint Championship
  const eventCodeSprint = await prisma.event.create({
    data: {
      id: 'evt_codesprint_2026',
      slug: 'national-codesprint-championship-2026',
      title: 'National CodeSprint Championship 2026',
      tagline: 'Speed, Logic & Algorithmic Supremacy: 5 Hard Problems, 120 Minutes',
      description: `Test your competitive coding abilities against India’s sharpest programmers in a fast-paced ICPC-style individual contest.

Problems span Dynamic Programming, Segment Trees, Graph Theory, and Combinatorics.`,
      category: 'CODING_CONTEST',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      location: 'Senapati Bapat Road, Pune',
      venueAddress: 'MCCIA Trade Tower Convention Center, Senapati Bapat Road, Pune - 411016',
      mapLink: 'https://maps.google.com/?q=MCCIA+Trade+Tower+Senapati+Bapat+Road+Pune+411016',
      speakers: JSON.stringify([
        {
          name: 'Gennady Korotkevich',
          role: '6x World ICPC Champion (Tourist)',
          company: 'Competitive Programming Legend',
          photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
          bio: 'Undefeated competitive programming champion offering problem breakdown masterclass.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Kunal Kushwaha',
          role: 'Founder & Open-Source Educator',
          company: 'WeMakeDevs',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
          bio: 'Empowering over 1M developers with open-source education, DSA, and DevOps mentorship.',
          twitter: 'https://twitter.com',
        },
      ]),
      startDate: new Date(Date.now() + 3 * 86400000),
      endDate: new Date(Date.now() + 3.1 * 86400000),
      regStartDate: new Date(Date.now() - 10 * 86400000),
      regEndDate: new Date(Date.now() + 2 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: true,
      visibility: 'PUBLIC',
      minTeamSize: 1,
      maxTeamSize: 1,
      prizePool: '₹2,00,000',
      prizes: JSON.stringify([
        { title: 'Gold Medalist (Rank 1)', amount: '₹1,00,000', perks: 'FAANG Interview Referral + Mechanical Keyboard' },
        { title: 'Silver Medalist (Rank 2)', amount: '₹60,000', perks: 'Tech Voucher + Pro Certificate' },
        { title: 'Bronze Medalist (Rank 3)', amount: '₹40,000', perks: 'Tech Voucher' },
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 7890,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventCodeSprint.id,
      name: 'Contestant Pass',
      price: 0,
      capacity: 2000,
      available: 1340,
    },
  });

  // Event 3: StratEdge Business Case Challenge
  const eventStratEdge = await prisma.event.create({
    data: {
      id: 'evt_stratedge_2026',
      slug: 'stratedge-national-business-case-2026',
      title: 'StratEdge 2026: National Business Case Challenge',
      tagline: 'Solve Disruptive GTM & M&A Scenarios for Rapidly Scaling Unicorns',
      description: `Organized by the IIM Bangalore Consulting Club, StratEdge invites undergraduate and MBA students to tackle an authentic growth strategy dilemma faced by an enterprise SaaS unicorn.`,
      category: 'CASE_STUDY',
      mode: 'HYBRID',
      bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      location: 'Kharadi, Pune',
      venueAddress: 'EON Free Zone IT Park Amphitheatre, Kharadi, Pune - 411014',
      mapLink: 'https://maps.google.com/?q=EON+Free+Zone+Kharadi+Pune+411014',
      speakers: JSON.stringify([
        {
          name: 'Kiran Mazumdar-Shaw',
          role: 'Executive Chairperson',
          company: 'Biocon India',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          bio: 'Pioneering biotechnology entrepreneur and global business icon on enterprise strategy.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Deepinder Goyal',
          role: 'Founder & CEO',
          company: 'Zomato & Blinkit',
          photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
          bio: 'Scale operator sharing first-principles lessons on unit economics and hyper-local supply chains.',
          twitter: 'https://twitter.com',
        },
      ]),
      startDate: new Date(Date.now() + 15 * 86400000),
      endDate: new Date(Date.now() + 18 * 86400000),
      regStartDate: new Date(Date.now() - 2 * 86400000),
      regEndDate: new Date(Date.now() + 12 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: false,
      minTeamSize: 2,
      maxTeamSize: 4,
      prizePool: '₹1,50,000',
      hostId: hostIIMB.id,
      viewsCount: 4320,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventStratEdge.id,
      name: 'Team Registration',
      price: 0,
      capacity: 300,
      available: 180,
    },
  });

  // Event 4: DesignCraft UI/UX Sprint
  const eventDesignCraft = await prisma.event.create({
    data: {
      id: 'evt_designcraft_2026',
      slug: 'designcraft-ui-ux-design-sprint-2026',
      title: 'DesignCraft: 48-Hour UI/UX Design Sprint',
      tagline: 'From Wireframe to Delightful Micro-Interactions: Design the Future of Fintech',
      description: `Reimagine the mobile banking experience for Gen Z and gig workers. Compete in prototype design, accessibility auditing, and design system creation.`,
      category: 'WORKSHOP',
      mode: 'ONLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      startDate: new Date(Date.now() + 7 * 86400000),
      endDate: new Date(Date.now() + 9 * 86400000),
      regStartDate: new Date(Date.now() - 3 * 86400000),
      regEndDate: new Date(Date.now() + 5 * 86400000),
      isPaid: true,
      isPublished: true,
      isFeatured: true,
      minTeamSize: 1,
      maxTeamSize: 2,
      prizePool: '₹1,20,000',
      hostId: hostTechNexus.id,
      viewsCount: 5610,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventDesignCraft.id,
      name: 'Early Bird Pass',
      price: 299,
      capacity: 200,
      available: 84,
      perks: JSON.stringify(['Figma Community Templates Kit', 'Live Critiques with Senior Product Designers', 'Portfolio Review']),
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventDesignCraft.id,
      name: 'Standard Pass',
      price: 499,
      capacity: 300,
      available: 210,
    },
  });

  // Event 5: Bengaluru React & Next.js Meetup
  const eventReactMeetup = await prisma.event.create({
    data: {
      id: 'evt_react_meetup_2026',
      slug: 'react-nextjs-bengaluru-dev-meetup',
      title: 'React & Next.js Bengaluru Dev Meetup #24',
      tagline: 'Deep Dive into React 19 Server Actions, Turbopack, and Edge Caching',
      description: `Join 150+ senior frontend engineers and full-stack architects for an evening of technical talks, live coding demos, and networking over pizza and coffee.`,
      category: 'MEETUP',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      location: 'Koramangala, Bengaluru',
      venueAddress: '91springboard, 7th Block, Koramangala, Bengaluru',
      mapLink: 'https://maps.google.com/?q=91springboard+Koramangala',
      startDate: new Date(Date.now() + 5 * 86400000),
      endDate: new Date(Date.now() + 5.2 * 86400000),
      regStartDate: new Date(Date.now() - 10 * 86400000),
      regEndDate: new Date(Date.now() + 4 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: false,
      minTeamSize: 1,
      maxTeamSize: 1,
      hostId: hostTechNexus.id,
      viewsCount: 3100,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventReactMeetup.id,
      name: 'Community RSVPs (Free)',
      price: 0,
      capacity: 150,
      available: 12,
    },
  });

  // Event 6: Vibrance 2026 Cultural & Tech Fest
  const eventVibrance = await prisma.event.create({
    data: {
      id: 'evt_vibrance_2026',
      slug: 'vibrance-2026-inter-college-fest',
      title: 'Vibrance 2026: National Inter-College Cultural & Tech Fest',
      tagline: '3 Days, 50+ Competitions, RoboWars, Battle of the Bands & Celebrity Concerts',
      description: `Experience the most electrifying college festival in South India. Over 15,000 students competing in technical paper presentations, competitive gaming, fashion shows, and musical face-offs.`,
      category: 'CULTURAL',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
      location: 'Lavale, Pune',
      venueAddress: 'Symbiosis International University Main Campus, Lavale, Pune - 412115',
      mapLink: 'https://maps.google.com/?q=Symbiosis+International+University+Lavale+Pune+412115',
      speakers: JSON.stringify([
        {
          name: 'Dr. Vidya Yeravdekar',
          role: 'Principal Director',
          company: 'Symbiosis International University Pune',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
          bio: 'Eminent educationist promoting interdisciplinary innovation, arts, and global youth leadership.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Ankur Warikoo',
          role: 'Keynote Speaker & Author',
          company: 'Nearbuy / Author of Do Epic Shit',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
          bio: 'Entrepreneur and mentor guiding students on career decisions, compounding, and startup life.',
          twitter: 'https://twitter.com',
        },
      ]),
      startDate: new Date(Date.now() + 25 * 86400000),
      endDate: new Date(Date.now() + 28 * 86400000),
      regStartDate: new Date(Date.now() - 5 * 86400000),
      regEndDate: new Date(Date.now() + 24 * 86400000),
      isPaid: true,
      isPublished: true,
      isFeatured: false,
      minTeamSize: 1,
      maxTeamSize: 10,
      prizePool: '₹7,50,000',
      hostId: hostTechNexus.id,
      viewsCount: 16500,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventVibrance.id,
      name: 'All-Fest Student Pass',
      price: 199,
      capacity: 3000,
      available: 2150,
      perks: JSON.stringify(['Access to all 3 days', 'Participation in any 3 events', 'Evening Concert entry']),
    },
  });

  // Event 7: CloudScale Global DevOps Conference
  const eventCloudScale = await prisma.event.create({
    data: {
      id: 'evt_cloudscale_2026',
      slug: 'cloudscale-devops-kubernetes-conference-2026',
      title: 'CloudScale Global: DevOps, Platform Eng & eBPF Summit',
      tagline: 'Architecting for Resilience, Zero-Trust Infrastructure, and Autonomous Cloud Ops',
      description: `Featuring keynote speakers from Google, AWS, Microsoft, and CNCF exploring the future of cloud computing, cost optimization with FinOps, and generative AI deployment infra.`,
      category: 'CONFERENCE',
      mode: 'HYBRID',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      location: 'Hyderabad & Virtual',
      startDate: new Date(Date.now() + 35 * 86400000),
      endDate: new Date(Date.now() + 37 * 86400000),
      regStartDate: new Date(Date.now() - 10 * 86400000),
      regEndDate: new Date(Date.now() + 30 * 86400000),
      isPaid: true,
      isPublished: true,
      isFeatured: true,
      minTeamSize: 1,
      maxTeamSize: 1,
      hostId: hostTechNexus.id,
      viewsCount: 9240,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventCloudScale.id,
      name: 'Virtual Delegate (Free)',
      price: 0,
      capacity: 5000,
      available: 4120,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventCloudScale.id,
      name: 'In-Person Delegate Pass',
      price: 1499,
      capacity: 400,
      available: 185,
      perks: JSON.stringify(['Keynote Hall VIP Seating', 'Executive Networking Luncheon', 'Conference Gift Bag']),
    },
  });

  // Event 8: Pune Literary Fest & Deccan Book Reading Circle (Pune Venue)
  const eventPuneLitFest = await prisma.event.create({
    data: {
      id: 'evt_pune_litfest_2026',
      slug: 'pune-literary-fest-deccan-book-reading-2026',
      title: 'Pune Literary Fest & Deccan Book Reading Circle 2026',
      tagline: 'An Intellectual Soirée of Contemporary Fiction, Marathi Sahitya, Poetry Open-Mic & Book Swaps',
      description: `### Welcome to Pune's Largest Literary & Book Lovers Gathering 📚

Set against the heritage backdrop of Fergusson College and the British Council Library on FC Road, this edition brings together bibliophiles, fiction authors, literary translators, and poetry performers for a 2-day intellectual festival.

#### 📖 Sessions & Highlights
- **Session 1: The Modern Indian Novel** - Masterclass with bestselling contemporary novelists on character arcs and world-building.
- **Session 2: Treasures of Marathi Sahitya** - Celebrating modern translations of classic Marathi drama, poetry, and social essays.
- **Session 3: Sunset Book Exchange & Salon** - Bring 2 books, leave with 2 new recommendations over artisanal Irani chai and bun maska.
- **Session 4: Youth Poetry & Spoken Word Slam** - Live open-mic stage for original multilingual verses.

#### 🎟️ Passes & Perks
- **Community Reader Pass (Free)**: Full access to all panel talks, author Q&A sessions, book signings, and open-mic amphitheatre.
- **VIP Book Club Member Pass (₹299)**: Includes priority front-row seating, signed hardcover anthology, exclusive author tea salon access, and collectible canvas tote bag.`,
      category: 'WORKSHOP',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&auto=format&fit=crop&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
      ]),
      location: 'FC Road, Pune',
      venueAddress: 'Fergusson College Main Amphitheatre & British Council Library, FC Road, Shivajinagar, Pune - 411004',
      mapLink: 'https://maps.google.com/?q=Fergusson+College+FC+Road+Shivajinagar+Pune+411004',
      speakers: JSON.stringify([
        {
          name: 'Arundhati Roy',
          role: 'Keynote Author & Booker Prize Winner',
          company: 'Penguin Random House',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          bio: 'Celebrated essayist, activist, and fiction writer exploring contemporary social narratives.',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
        {
          name: 'Dr. Bhalchandra Nemade',
          role: 'Jnanpith Awardee & Novelist',
          company: 'Sahitya Akademi Fellow',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          bio: 'Pioneering voice in modern Marathi literature and creator of nativist literary theory.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Jerry Pinto',
          role: 'Poet, Translator & Journalist',
          company: 'Speaking Tiger Books',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
          bio: 'Sahitya Akademi award winner known for evocative prose and translations of Marathi memoirs.',
          twitter: 'https://twitter.com',
        },
      ]),
      startDate: new Date(Date.now() + 8 * 86400000),
      endDate: new Date(Date.now() + 10 * 86400000),
      regStartDate: new Date(Date.now() - 5 * 86400000),
      regEndDate: new Date(Date.now() + 6 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: true,
      minTeamSize: 1,
      maxTeamSize: 1,
      prizePool: '₹50,000 in Book Grants',
      eligibilityCriteria: JSON.stringify([
        'Open to all literature enthusiasts, book club members, undergraduate and postgraduate students across Pune and Maharashtra.',
        'No prior publication required. Beginners and seasoned writers equally welcome.',
        'Spoken word slam requires original content (Hindi, Marathi, English, or Urdu).',
      ]),
      faqs: JSON.stringify([
        { question: 'Is the general book reading circle free?', answer: 'Yes, community access to all literary sessions and book exchanges is 100% free with RSVP.' },
        { question: 'Can I participate in the open-mic poetry slam?', answer: 'Yes! Register with the Free Reader Pass or Slam pass and sign up at the venue registration desk by 3:00 PM.' },
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 8420,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPuneLitFest.id,
      name: 'Free Community Reader Pass',
      price: 0,
      capacity: 600,
      available: 340,
      perks: JSON.stringify(['Access to all 4 panel discussions', 'Sunset Book Exchange entry', 'Digital Attendee Certificate']),
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPuneLitFest.id,
      name: 'VIP Book Club & Author Salon Pass',
      price: 299,
      capacity: 120,
      available: 48,
      perks: JSON.stringify(['Priority front-row seating', 'Signed festival anthology', 'Exclusive Author Tea & Networking Salon', 'Custom Bookish Tote Bag']),
    },
  });

  // Event 9: Sanskriti Pune Inter-Collegiate Cultural Mahotsav (Bal Gandharva Ranga Mandir, Pune)
  const eventPuneSanskriti = await prisma.event.create({
    data: {
      id: 'evt_pune_sanskriti_2026',
      slug: 'sanskriti-2026-pune-cultural-mahotsav',
      title: 'Sanskriti 2026: Pune Inter-Collegiate Cultural Mahotsav',
      tagline: '3 Days of Classical Sangeet, Natyasangeet, Street Play, Fusion Bands & Folk Dance',
      description: `### Pune's Most Prestigious College Cultural Festival 🎭

Hosted at the historic Bal Gandharva Ranga Mandir in Shivajinagar, Sanskriti 2026 brings together 60+ colleges competing in theater, classical dance, Hindustani vocal battles, rock fusion bands, and fashion presentations.

#### 🏆 Competition Tracks
- **Track 1: Swara-Sangam** - Hindustani Classical & Semi-Classical Solo and Duet Vocals.
- **Track 2: Rangmanch** - 45-minute One-Act Plays (Ekankika) in Marathi and Hindi.
- **Track 3: Battle of the College Bands** - Live acoustic & rock fusion showdown.
- **Track 4: Nrityanjali** - Traditional Lavani, Kathak, Bharatanatyam, and Contemporary Group Folk Dance.`,
      category: 'CULTURAL',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      ]),
      location: 'JM Road, Pune',
      venueAddress: 'Bal Gandharva Ranga Mandir, JM Road, Shivajinagar, Pune - 411005',
      mapLink: 'https://maps.google.com/?q=Bal+Gandharva+Ranga+Mandir+JM+Road+Shivajinagar+Pune+411005',
      speakers: JSON.stringify([
        {
          name: 'Subodh Bhave',
          role: 'Keynote Speaker & Director',
          company: 'Kanha Films & Natya Academy',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          bio: 'Iconic actor and director renowned for bringing historical Indian cultural luminaries to life.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Rahul Deshpande',
          role: 'National Award-winning Vocalist',
          company: 'Vasantrao Deshpande Sangeet Sabha',
          photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
          bio: 'Hindustani classical vocalist innovating at the intersection of classical ragas and world fusion.',
          twitter: 'https://twitter.com',
        },
        {
          name: 'Sonali Kulkarni',
          role: 'Performing Arts Judge & Guest of Honour',
          company: 'Indian Contemporary Theatre',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          bio: 'Versatile theater and cinema artist mentoring the next generation of college dramatists.',
          linkedin: 'https://linkedin.com',
        },
      ]),
      startDate: new Date(Date.now() + 14 * 86400000),
      endDate: new Date(Date.now() + 17 * 86400000),
      regStartDate: new Date(Date.now() - 8 * 86400000),
      regEndDate: new Date(Date.now() + 11 * 86400000),
      isPaid: true,
      isPublished: true,
      isFeatured: true,
      minTeamSize: 1,
      maxTeamSize: 12,
      prizePool: '₹3,50,000',
      eligibilityCriteria: JSON.stringify([
        'Open to bona fide college students from SPPU, COEP, MIT-WPU, Bharati Vidyapeeth, Symbiosis, and colleges across Maharashtra.',
        'Valid physical College Identity Card mandatory at check-in gate.',
        'Teams can represent their registered college cultural cell or participate as independent cross-college squads.',
      ]),
      prizes: JSON.stringify([
        { title: 'Best Overall College Trophy + Cash', amount: '₹1,50,000', perks: 'Rotating Sanskriti Rolling Shield + Individual Medals' },
        { title: 'Battle of the Bands Champion', amount: '₹1,00,000', perks: 'Studio Recording Session Deal + Audio Gear' },
        { title: 'One-Act Play (Ekankika) Winner', amount: '₹60,000', perks: 'State Theater Festival nomination' },
        { title: 'Classical Solo & Duet Winners', amount: '₹40,000', perks: 'Prestigious Natyasangeet citation' },
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 14200,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPuneSanskriti.id,
      name: 'Student Fest Delegate Pass',
      price: 199,
      capacity: 1200,
      available: 840,
      perks: JSON.stringify(['3-day auditorium entry', 'Participation in any 2 competitive events', 'Official Sanskriti Delegate Certificate']),
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPuneSanskriti.id,
      name: 'All-Fest VIP & Concert Access Pass',
      price: 449,
      capacity: 300,
      available: 110,
      perks: JSON.stringify(['All 3 days + Evening Celebrity Band Concert', 'Reserved Balcony VIP seating', 'Festival Merch & Swag Bag']),
    },
  });

  // Event 10: Pune Sunset Poetry & Spoken Word Slam (Koregaon Park, Pune)
  const eventPunePoetry = await prisma.event.create({
    data: {
      id: 'evt_pune_poetry_slam_2026',
      slug: 'pune-sunset-poetry-spoken-word-slam-2026',
      title: 'Pune Sunset Poetry & Spoken Word Slam: Koregaon Park',
      tagline: 'Intimate Garden Reading, Acoustic Melodies, and Spoken Word Battles at Dusk',
      description: `### An Evening of Verse, Coffee, and Soulful Rhymes ☕✨

Nestled inside the garden courtyard of The French Window Patisserie in Koregaon Park, join Pune's most vibrant community of poets, storytellers, and acoustic musicians for a candlelit evening slam.

#### 🎙️ Event Format
- **Round 1: Open Garden Mic (5:30 PM - 7:00 PM)**: 3-minute slots for 20 shortlisted poets.
- **Round 2: The Spoken Word Slam (7:30 PM - 9:00 PM)**: Head-to-head performance poetry evaluated on cadence, emotion, and metaphor.
- **Acoustic Interludes**: Indie acoustic guitar & flute accompaniments during breaks.`,
      category: 'MEETUP',
      mode: 'OFFLINE',
      bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      ]),
      location: 'Koregaon Park, Pune',
      venueAddress: 'The French Window Patisserie & Gardens, Lane 5, Koregaon Park, Pune - 411001',
      mapLink: 'https://maps.google.com/?q=The+French+Window+Patisserie+Lane+5+Koregaon+Park+Pune+411001',
      speakers: JSON.stringify([
        {
          name: 'Varun Grover',
          role: 'Headline Performer & Lyricist',
          company: 'All India Bakchod / Independent Artist',
          photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
          bio: 'National Award-winning lyricist, satirist, and screenwriter known for sharp, lyrical storytelling.',
          twitter: 'https://twitter.com',
        },
        {
          name: 'Priya Malik',
          role: 'Spoken Word Poet & Curator',
          company: 'Spill Poetry',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
          bio: 'Pioneering spoken word performer touching hearts across millions of listeners worldwide.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Yahya Bootwala',
          role: 'Poet & Storyteller',
          company: 'Tape A Tale Collective',
          photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
          bio: 'Viral spoken word artist famous for soulful introspective verse and youth poetry festivals.',
          linkedin: 'https://linkedin.com',
        },
      ]),
      startDate: new Date(Date.now() + 6 * 86400000),
      endDate: new Date(Date.now() + 6.3 * 86400000),
      regStartDate: new Date(Date.now() - 4 * 86400000),
      regEndDate: new Date(Date.now() + 4 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: false,
      minTeamSize: 1,
      maxTeamSize: 1,
      prizePool: '₹25,000 + Book Hampers',
      eligibilityCriteria: JSON.stringify([
        'Open to poets and spoken word artists of all ages.',
        'Original compositions only. English, Hindi, Marathi, and Urdu poems welcome.',
        'No hate speech or offensive slurs.',
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 6100,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPunePoetry.id,
      name: 'Audience RSVP (Free)',
      price: 0,
      capacity: 80,
      available: 15,
      perks: JSON.stringify(['General outdoor seating', 'Complimentary herbal tea', 'Audience voting card']),
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPunePoetry.id,
      name: 'Performer Slam Slot',
      price: 150,
      capacity: 25,
      available: 6,
      perks: JSON.stringify(['Guaranteed 4-minute stage performance', 'Audio recording of performance', 'French Window Beverage Voucher']),
    },
  });

  // Event 11: COEP Tech Pune National Robotics & Innovation Sprint (Shivajinagar, Pune)
  const eventPuneCOEP = await prisma.event.create({
    data: {
      id: 'evt_coep_robotics_2026',
      slug: 'coep-tech-pune-national-robotics-sprint-2026',
      title: 'COEP Tech Pune: National RoboWars & Autonomous Hardware Sprint 2026',
      tagline: '48 Hours of Combat Robotics, Drone Obstacle Courses, and Edge AI Hardware Prototyping',
      description: `### India’s Premier Engineering Hardware Challenge at COEP 🤖⚡

Hosted at the historic COEP Technological University campus on Wellesley Road in Shivajinagar, Pune, this national competition tests mechanical durability, autonomous navigation, and embedded edge compute.

#### ⚔️ Arenas & Challenges
- **15kg & 30kg Combat RoboWars**: Armor vs. spin weapons in our steel-caged arena.
- **Autonomous Drone Navigation**: Vision-based obstacle clearance without GPS.
- **Edge AI Robotics**: Jetson / Raspberry Pi powered autonomous delivery rovers.`,
      category: 'HACKATHON',
      mode: 'HYBRID',
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      ]),
      location: 'Shivajinagar, Pune',
      venueAddress: 'COEP Technological University Main Auditorium & Maker Labs, Wellesley Rd, Shivajinagar, Pune - 411005',
      mapLink: 'https://maps.google.com/?q=COEP+Technological+University+Wellesley+Rd+Shivajinagar+Pune+411005',
      speakers: JSON.stringify([
        {
          name: 'Dr. Vijay Bhatkar',
          role: 'Keynote & Chief Patron',
          company: 'Architect of PARAM Supercomputer / Multiversity',
          photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
          bio: 'Padma Bhushan awardee and national architect of Indian supercomputing and high-performance computing.',
          linkedin: 'https://linkedin.com',
        },
        {
          name: 'Dr. Radhika Madgavkar',
          role: 'Head of Robotics & Autonomous Systems',
          company: 'Tata Technologies Pune',
          photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in robotic perception, motion planning algorithms, and industrial hardware autonomy.',
          linkedin: 'https://linkedin.com',
        },
      ]),
      startDate: new Date(Date.now() + 20 * 86400000),
      endDate: new Date(Date.now() + 22 * 86400000),
      regStartDate: new Date(Date.now() - 5 * 86400000),
      regEndDate: new Date(Date.now() + 16 * 86400000),
      isPaid: false,
      isPublished: true,
      isFeatured: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      prizePool: '₹4,00,000',
      eligibilityCriteria: JSON.stringify([
        'Open to all undergraduate & diploma engineering students across India.',
        'Teams must consist of 2 to 4 members. Inter-college teams allowed.',
        'Robots must comply with standard safety, pneumatic, and weight regulations.',
      ]),
      prizes: JSON.stringify([
        { title: 'RoboWars National Champion', amount: '₹2,00,000', perks: 'COEP Innovation Trophy + Component Sponsorship' },
        { title: 'Autonomous Drone Track Winner', amount: '₹1,20,000', perks: 'Defense Startup PPI Interviews' },
        { title: 'Edge AI Rover Excellence', amount: '₹80,000', perks: 'NVIDIA Jetson Development Kit' },
      ]),
      hostId: hostTechNexus.id,
      viewsCount: 15300,
    },
  });

  await prisma.ticketTier.create({
    data: {
      eventId: eventPuneCOEP.id,
      name: 'Competitor Team Pass (Free)',
      price: 0,
      capacity: 250,
      available: 130,
      perks: JSON.stringify(['Full Maker Lab arena access', 'Hardware safety inspection certification', 'Meals & accommodation support for outstation teams']),
    },
  });

  // Coupons
  await prisma.coupon.create({
    data: {
      eventId: eventNexus.id,
      code: 'EARLYBIRD50',
      discountPercent: 50,
      maxUses: 100,
      usedCount: 14,
    },
  });

  await prisma.coupon.create({
    data: {
      eventId: eventDesignCraft.id,
      code: 'STUDENT100',
      discountFlat: 100,
      maxUses: 50,
      usedCount: 9,
    },
  });

  // 4. Sample Team & Registration for Alex in Nexus AI
  const sampleTeam = await prisma.team.create({
    data: {
      id: 'team_nexus_alpha',
      eventId: eventNexus.id,
      name: 'NeuralCraft Syndicate',
      joinCode: 'TEAM-AI99',
      leaderId: userAlex.id,
      status: 'FORMING',
    },
  });

  await prisma.teamMember.createMany({
    data: [
      {
        teamId: sampleTeam.id,
        userId: userAlex.id,
        role: 'LEADER',
      },
      {
        teamId: sampleTeam.id,
        userId: userRohit.id,
        role: 'MEMBER',
      },
    ],
  });

  const regAlex = await prisma.registration.create({
    data: {
      id: 'reg_alex_nexus',
      ticketNumber: 'TKT-829104',
      eventId: eventNexus.id,
      userId: userAlex.id,
      ticketTierId: tierFreeNexus.id,
      teamId: sampleTeam.id,
      status: 'CONFIRMED',
      paymentStatus: 'FREE',
      amountPaid: 0,
      customResponses: JSON.stringify({
        fld_track: 'Autonomous Agents',
        fld_github: 'https://github.com/alexrivera-dev/agent-orchestrator',
        fld_discord: 'alexrivera#4829',
        fld_tshirt: 'L',
      }),
      qrCodeData: 'SUSHANTI:TKT-829104:EVT_NEXUS:USR_ALEX',
      isCheckedIn: false,
    },
  });

  // 5. Sample Submission & Scores
  const sampleSubmission = await prisma.submission.create({
    data: {
      id: 'sub_agentflow_ai',
      eventId: eventNexus.id,
      teamId: sampleTeam.id,
      userId: userAlex.id,
      title: 'AgentFlow: Multi-Agent Distributed Reasoning Mesh',
      tagline: 'Self-healing, multi-modal LLM agents with deterministic memory indexing',
      description: 'AgentFlow coordinates autonomous specialist agents (Searcher, Coder, Critic) with verified tool execution and latency-optimized caching.',
      repoUrl: 'https://github.com/alexrivera-dev/agentflow-core',
      demoUrl: 'https://agentflow.dev',
      track: 'Autonomous Agents',
      status: 'SHORTLISTED',
    },
  });

  await prisma.score.create({
    data: {
      submissionId: sampleSubmission.id,
      judgeId: userPriya.id,
      innovation: 9.5,
      execution: 9.0,
      design: 8.5,
      presentation: 9.0,
      totalScore: 36.0,
      feedback: 'Outstanding technical depth, exceptional architecture modularity, and smooth CLI demo. Highly competitive for 1st place!',
    },
  });

  // 6. Sample Verifiable Certificate for Alex from a past event
  await prisma.certificate.create({
    data: {
      id: 'cert_alex_hack2025',
      verificationId: 'SUSH-2025-V792B',
      eventId: eventCodeSprint.id,
      userId: userAlex.id,
      recipientName: 'Alex Rivera',
      eventTitle: 'National CodeSprint Championship',
      type: 'WINNER_1',
      rank: 'Rank 1 - National Champion',
      issuedAt: new Date(Date.now() - 60 * 86400000),
    },
  });

  // 7. Sample Reviews
  await prisma.review.create({
    data: {
      eventId: eventNexus.id,
      userId: userRohit.id,
      rating: 5,
      comment: 'The track topics and mentor lineup this year are top-tier! Best organized developer hackathon in India.',
    },
  });

  // 8. Sample Teammate Post
  await prisma.teammatePost.create({
    data: {
      eventId: eventNexus.id,
      userId: userAlex.id,
      rolesLookingFor: 'UI/UX Designer, ML/Data Engineer',
      message: 'Hey folks! We are building an agentic reasoning workbench. Looking for a designer with strong Figma/Framer skills to join our squad!',
      status: 'OPEN',
    },
  });

  // 9. Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: userAlex.id,
        title: 'Registration Confirmed! 🎟️',
        message: 'You are confirmed for Nexus AI Hackathon 2026. View your ticket and join code.',
        type: 'SUCCESS',
        link: '/my-events',
      },
      {
        userId: userAlex.id,
        title: 'Teammate Joined Your Squad 🤝',
        message: 'Rohit Verma joined your team NeuralCraft Syndicate.',
        type: 'INFO',
        link: '/teams',
      },
      {
        userId: userPriya.id,
        title: 'New High-Score Submission 🚀',
        message: 'AgentFlow submitted by NeuralCraft Syndicate has been evaluated.',
        type: 'INFO',
        link: '/host/events/evt_nexus_ai_2026/competition',
      },
    ],
  });

  console.log('✅ Sushanti database seeded successfully with 7 events, users, teams, submissions, and certificates!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
