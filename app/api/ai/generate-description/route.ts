import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { title, category, targetAudience, highlights } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // AI Generation template engine
    const formattedCategory = (category || 'HACKATHON').toLowerCase();
    const audience = targetAudience || 'students, developers, and industry creators';
    const points = highlights || 'cutting-edge technology, prizes, and peer networking';

    const generatedDescription = `### 🌟 Welcome to ${title}

Get ready for an extraordinary experience designed for ${audience}. Whether you're aiming to validate a bold new idea, collaborate with visionary peers, or compete for industry prestige, this event is your platform to shine.

#### 🎯 Key Themes & Focus Areas
- **Architectural Innovation**: Craft modular, scalable, and resilient systems.
- **Real-World Impact**: Address pressing industry and societal pain points.
- **UX & Polish**: Deliver intuitive, accessible, and delightful experiences.

#### 💡 What Makes This Stand Out
- **Hands-on Mentorship**: Direct guidance from senior engineers and domain leaders.
- **High-Stakes Judging**: Objective scoring rubrics emphasizing depth, speed, and design.
- **Ecosystem Network**: Connect directly with angel investors, hiring managers, and sponsors.

#### 📋 Guidelines & Expectations
1. Originality and fresh thinking are paramount.
2. Cross-disciplinary collaboration is strongly encouraged.
3. Complete submissions before the stated deadline to qualify for judging.

*Join hundreds of ambitious builders shaping tomorrow. Register today!*`;

    const sampleRounds = [
      {
        title: 'Round 1: Concept & Architecture Blueprint',
        description: 'Submit your problem statement, solution overview, and system architecture schematic.',
        type: 'SUBMISSION',
      },
      {
        title: 'Round 2: Functional Prototype & Video Demo',
        description: 'Submit your GitHub code repository, deployment URL, and a 3-minute video walkthrough.',
        type: 'SUBMISSION',
      },
      {
        title: 'Round 3: Grand Finale & Live Jury Pitch',
        description: 'Shortlisted finalists present live in front of the grand jury and VC panel.',
        type: 'PRESENTATION',
      },
    ];

    return NextResponse.json({
      success: true,
      description: generatedDescription,
      suggestedRounds: sampleRounds,
      tagline: `Unleash your creativity at ${title}: Where builders turn ideas into impact.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
