import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { eventId, question } = await req.json();

    if (!eventId || !question) {
      return NextResponse.json({ error: 'eventId and question are required' }, { status: 400 });
    }

    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
      include: {
        ticketTiers: true,
        rounds: true,
        host: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const qLower = question.toLowerCase();

    let answer = '';

    // Smart contextual retrieval
    if (qLower.includes('free') || qLower.includes('fee') || qLower.includes('price') || qLower.includes('cost') || qLower.includes('ticket')) {
      if (event.isPaid) {
        const tiers = event.ticketTiers.map((t) => `${t.name}: ₹${t.price}`).join(', ');
        answer = `This is a paid event. Available ticket options: ${tiers || 'Check registration options'}. You can apply valid coupon codes at checkout!`;
      } else {
        answer = `Participation in ${event.title} is completely free! Standard registrations include full access to mentor sessions, talks, and digital certificates.`;
      }
    } else if (qLower.includes('team') || qLower.includes('size') || qLower.includes('solo') || qLower.includes('individual') || qLower.includes('member')) {
      if (event.minTeamSize === 1 && event.maxTeamSize === 1) {
        answer = `This is an individual competition (team size of 1). Solo participation only!`;
      } else {
        answer = `Team sizes for ${event.title} are minimum ${event.minTeamSize} and maximum ${event.maxTeamSize} members. You can either register with existing teammates or find peers on Sushanti's "Find Teammates" board.`;
      }
    } else if (qLower.includes('prize') || qLower.includes('cash') || qLower.includes('reward') || qLower.includes('win')) {
      answer = `The total prize pool for this event is ${event.prizePool || 'substantial cash & developer perks'}! Winners also receive cloud computing credits, fast-track interviews, and official verifiable winner certificates.`;
    } else if (qLower.includes('mode') || qLower.includes('online') || qLower.includes('offline') || qLower.includes('venue') || qLower.includes('where') || qLower.includes('location')) {
      if (event.mode === 'ONLINE') {
        answer = `${event.title} is 100% online/virtual! You can participate from anywhere in the world. Links will be provided on your ticket dashboard.`;
      } else if (event.mode === 'HYBRID') {
        answer = `This event is hybrid! Physical sessions take place at ${event.venueAddress || event.location || 'the main venue'}, with simultaneous live streaming and online submissions for remote participants.`;
      } else {
        answer = `This is an in-person event located at: ${event.venueAddress || event.location || 'Venue specified on ticket'}.`;
      }
    } else if (qLower.includes('round') || qLower.includes('stage') || qLower.includes('schedule') || qLower.includes('timeline') || qLower.includes('when')) {
      if (event.rounds && event.rounds.length > 0) {
        const roundList = event.rounds.map((r) => `• ${r.title} (${r.type})`).join('\n');
        answer = `The event schedule features ${event.rounds.length} key stages:\n${roundList}\nEvent runs from ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}.`;
      } else {
        answer = `The event runs from ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}. Check the timeline section for exact session timings.`;
      }
    } else if (qLower.includes('eligibility') || qLower.includes('who can') || qLower.includes('college') || qLower.includes('student')) {
      answer = `Open to undergraduate students, postgraduates, fresh graduates, and professional engineers who are passionate about building. Cross-college and cross-organization squads are warmly welcome!`;
    } else {
      answer = `Regarding "${question}": For ${event.title}, hosted by ${event.host.organizationName}, please review the official rules tab. If you have custom requests, you can reach out directly via the event discussion board or discord channel!`;
    }

    return NextResponse.json({
      success: true,
      question,
      answer,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
