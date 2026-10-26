import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const mode = searchParams.get('mode');
    const fee = searchParams.get('fee'); // 'free' | 'paid'
    const sort = searchParams.get('sort') || 'popular'; // 'popular' | 'date' | 'closing'

    const whereClause: any = {
      isPublished: true,
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { tagline: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
      ];
    }

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (mode && mode !== 'ALL') {
      whereClause.mode = mode;
    }

    if (fee === 'free') {
      whereClause.isPaid = false;
    } else if (fee === 'paid') {
      whereClause.isPaid = true;
    }

    let orderBy: any = { viewsCount: 'desc' };
    if (sort === 'date') {
      orderBy = { startDate: 'asc' };
    } else if (sort === 'closing') {
      orderBy = { regEndDate: 'asc' };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        host: {
          select: {
            organizationName: true,
            slug: true,
            logo: true,
            isVerified: true,
          },
        },
        ticketTiers: {
          select: {
            price: true,
            name: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ events });
  } catch (err: any) {
    console.error('Error fetching events:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      tagline,
      description,
      category,
      mode,
      bannerUrl,
      location,
      venueAddress,
      startDate,
      endDate,
      regStartDate,
      regEndDate,
      isPaid,
      minTeamSize,
      maxTeamSize,
      prizePool,
      prizes,
      sponsors,
      eligibilityCriteria,
      rules,
      faqs,
      customFields,
      ticketTiers,
      rounds,
      hostId,
    } = body;

    if (!title || !category || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    // Resolve or fallback hostId
    let resolvedHostId = hostId;
    if (!resolvedHostId) {
      const defaultHost = await prisma.hostProfile.findFirst();
      resolvedHostId = defaultHost ? defaultHost.id : 'host_technexus';
    }

    const newEvent = await prisma.event.create({
      data: {
        slug,
        title,
        tagline: tagline || title,
        description: description || 'Exciting event hosted on Sushanti.',
        category,
        mode: mode || 'ONLINE',
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        location: location || null,
        venueAddress: venueAddress || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        regStartDate: regStartDate ? new Date(regStartDate) : new Date(),
        regEndDate: regEndDate ? new Date(regEndDate) : new Date(startDate),
        isPaid: Boolean(isPaid),
        isPublished: true,
        minTeamSize: Number(minTeamSize) || 1,
        maxTeamSize: Number(maxTeamSize) || 1,
        prizePool: prizePool || null,
        prizes: prizes ? JSON.stringify(prizes) : null,
        sponsors: sponsors ? JSON.stringify(sponsors) : null,
        eligibilityCriteria: eligibilityCriteria ? JSON.stringify(eligibilityCriteria) : null,
        rules: rules || null,
        faqs: faqs ? JSON.stringify(faqs) : null,
        customFields: customFields ? JSON.stringify(customFields) : null,
        hostId: resolvedHostId,
      },
    });

    // Create ticket tiers if provided
    if (ticketTiers && Array.isArray(ticketTiers) && ticketTiers.length > 0) {
      for (const tier of ticketTiers) {
        await prisma.ticketTier.create({
          data: {
            eventId: newEvent.id,
            name: tier.name || 'Standard Pass',
            price: Number(tier.price) || 0,
            capacity: Number(tier.capacity) || 500,
            available: Number(tier.capacity) || 500,
            perks: tier.perks ? JSON.stringify(tier.perks) : null,
          },
        });
      }
    } else {
      // Create a default tier
      await prisma.ticketTier.create({
        data: {
          eventId: newEvent.id,
          name: isPaid ? 'General Admission' : 'Free Pass',
          price: isPaid ? 499 : 0,
          capacity: 500,
          available: 500,
        },
      });
    }

    // Create competition rounds if provided
    if (rounds && Array.isArray(rounds) && rounds.length > 0) {
      for (let i = 0; i < rounds.length; i++) {
        const round = rounds[i];
        await prisma.eventRound.create({
          data: {
            eventId: newEvent.id,
            order: i + 1,
            title: round.title || `Round ${i + 1}`,
            description: round.description || '',
            type: round.type || 'SUBMISSION',
            startDate: round.startDate ? new Date(round.startDate) : new Date(startDate),
            endDate: round.endDate ? new Date(round.endDate) : new Date(endDate),
            isElimination: Boolean(round.isElimination),
          },
        });
      }
    }

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating event:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
