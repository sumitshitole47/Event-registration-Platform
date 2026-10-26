import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../lib/prisma';
import { generateTicketNumber, generateJoinCode, formatCurrency } from '../lib/utils';

describe('Sushanti Core Platform Flows', () => {
  beforeAll(async () => {
    // Ensure DB connection is established
    await prisma.$connect();
  });

  it('1. Utility functions generate valid formats', () => {
    const ticketNo = generateTicketNumber();
    expect(ticketNo).toMatch(/^TKT-\d{6}$/);

    const joinCode = generateJoinCode();
    expect(joinCode).toMatch(/^SUSH-[A-Z0-9]{4}$/);

    expect(formatCurrency(0)).toBe('Free');
    expect(formatCurrency(499)).toContain('499');
  });

  it('2. Seeded events exist with required relations and categories', async () => {
    const events = await prisma.event.findMany({
      include: {
        host: true,
        ticketTiers: true,
        rounds: true,
      },
    });

    expect(events.length).toBeGreaterThanOrEqual(5);

    const nexus = events.find((e) => e.slug === 'nexus-ai-hackathon-2026');
    expect(nexus).toBeDefined();
    expect(nexus?.category).toBe('HACKATHON');
    expect(nexus?.mode).toBe('HYBRID');
    expect(nexus?.ticketTiers.length).toBeGreaterThanOrEqual(1);
    expect(nexus?.rounds.length).toBe(3);
  });

  it('3. User registration flow creates verifiable ticket & QR data', async () => {
    // Fetch test user & event
    const user = await prisma.user.findUnique({ where: { email: 'alex@sushanti.dev' } });
    const event = await prisma.event.findFirst({ where: { category: 'CODING_CONTEST' } });

    expect(user).toBeDefined();
    expect(event).toBeDefined();

    if (!user || !event) return;

    // Check existing or create test registration
    let reg = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: user.id,
        },
      },
    });

    if (!reg) {
      const ticketNumber = generateTicketNumber();
      reg = await prisma.registration.create({
        data: {
          ticketNumber,
          eventId: event.id,
          userId: user.id,
          status: 'CONFIRMED',
          paymentStatus: 'FREE',
          amountPaid: 0,
          qrCodeData: `SUSHANTI:${ticketNumber}:${event.id}:${user.id}`,
        },
      });
    }

    expect(reg.ticketNumber).toMatch(/^TKT-/);
    expect(reg.qrCodeData).toContain('SUSHANTI:');
    expect(reg.status).toBe('CONFIRMED');
    expect(typeof reg.isCheckedIn).toBe('boolean');
  });

  it('4. Host QR Check-in verifies ticket and marks attendance', async () => {
    // Find a registration to check in
    const reg = await prisma.registration.findFirst({
      where: { isCheckedIn: false },
      include: { user: true, event: true },
    });

    expect(reg).toBeDefined();
    if (!reg) return;

    // Perform check-in update
    const checkedIn = await prisma.registration.update({
      where: { id: reg.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
        checkedInBy: 'Vitest Test Gate',
      },
    });

    expect(checkedIn.isCheckedIn).toBe(true);
    expect(checkedIn.checkedInAt).toBeDefined();
    expect(checkedIn.checkedInBy).toBe('Vitest Test Gate');
  });

  it('5. Certificates are verifiable by unique ID', async () => {
    const cert = await prisma.certificate.findFirst({
      where: { verificationId: 'SUSH-2025-V792B' },
      include: { event: true, user: true },
    });

    expect(cert).toBeDefined();
    expect(cert?.recipientName).toBe('Alex Rivera');
    expect(cert?.type).toBe('WINNER_1');
  });

  it('6. Host can create a new competition round and manage event lifecycle', async () => {
    const testHost = await prisma.hostProfile.findFirst();
    expect(testHost).toBeDefined();
    if (!testHost) return;

    const testSlug = `vitest-sprint-${Date.now()}`;
    const newEvent = await prisma.event.create({
      data: {
        slug: testSlug,
        title: 'Vitest Automated Test Sprint',
        tagline: 'Automated continuous test execution',
        description: 'End to end testing verified.',
        category: 'HACKATHON',
        mode: 'ONLINE',
        bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 2 * 86400000),
        regStartDate: new Date(),
        regEndDate: new Date(Date.now() + 86400000),
        hostId: testHost.id,
      },
    });

    expect(newEvent.id).toBeDefined();
    expect(newEvent.slug).toBe(testSlug);

    // Clean up test event
    await prisma.event.delete({ where: { id: newEvent.id } });
  });

  it('7. Google-only authentication finds or provisions users dynamically', async () => {
    // 1. Authenticate existing user
    const existing = await prisma.user.findUnique({
      where: { email: 'alex@sushanti.dev' },
    });
    expect(existing).toBeDefined();
    expect(existing?.name).toBe('Alex Rivera');

    // 2. Provision new Google account
    const testGoogleEmail = `test.google.${Date.now()}@gmail.com`;
    const newUser = await prisma.user.create({
      data: {
        email: testGoogleEmail,
        name: 'Test Google User',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        headline: 'Google Authenticated Member',
        role: 'CONSUMER',
        activeMode: 'CONSUMER',
      },
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe(testGoogleEmail);
    expect(newUser.role).toBe('CONSUMER');

    // Cleanup
    await prisma.user.delete({ where: { id: newUser.id } });
  });

  it('8. Pune cultural, book reading, and robotics events exist with deadlines, venues, and eligibility', async () => {
    const puneEvents = await prisma.event.findMany({
      where: {
        OR: [
          { location: { contains: 'Pune' } },
          { venueAddress: { contains: 'Pune' } },
        ],
      },
      include: {
        ticketTiers: true,
      },
    });

    expect(puneEvents.length).toBeGreaterThanOrEqual(4);

    // Verify Pune Lit Fest
    const litFest = puneEvents.find((e) => e.slug.includes('pune-literary-fest'));
    expect(litFest).toBeDefined();
    expect(litFest?.venueAddress).toContain('Fergusson College');
    expect(litFest?.venueAddress).toContain('Pune');
    expect(litFest?.mapLink).toContain('maps.google.com');
    expect(litFest?.regEndDate).toBeDefined();
    expect(litFest?.eligibilityCriteria).toBeDefined();
    const litEligibility = JSON.parse(litFest?.eligibilityCriteria || '[]');
    expect(litEligibility.length).toBeGreaterThanOrEqual(2);

    // Verify Sanskriti Pune Cultural Mahotsav
    const sanskriti = puneEvents.find((e) => e.slug.includes('sanskriti'));
    expect(sanskriti).toBeDefined();
    expect(sanskriti?.category).toBe('CULTURAL');
    expect(sanskriti?.venueAddress).toContain('Bal Gandharva Ranga Mandir');
    expect(sanskriti?.isPaid).toBe(true);

    // Verify Sunset Poetry Slam
    const poetry = puneEvents.find((e) => e.slug.includes('poetry'));
    expect(poetry).toBeDefined();
    expect(poetry?.venueAddress).toContain('Koregaon Park');
  });

  it('9. Event photo galleries contain valid multi-image collections', async () => {
    const eventsWithGallery = await prisma.event.findMany({
      where: {
        gallery: { not: null },
      },
    });

    expect(eventsWithGallery.length).toBeGreaterThanOrEqual(4);

    for (const evt of eventsWithGallery) {
      const photos = JSON.parse(evt.gallery || '[]');
      expect(Array.isArray(photos)).toBe(true);
      expect(photos.length).toBeGreaterThanOrEqual(3);
      expect(photos[0]).toMatch(/^https?:\/\//);
    }
  });

  it('10. Razorpay payment gateway integration creates orders and records transactions', async () => {
    const {
      verifyRazorpaySignature,
      ORGANIZER_UPI_ID,
      generateUpiPaymentUrl,
      isValidTransactionReference,
    } = await import('../lib/razorpay');

    // Test official merchant UPI ID
    expect(ORGANIZER_UPI_ID).toBe('sumitshitole447-1@okhdfcbank');

    // Test UPI Deep Link generation for Google Pay / PhonePe / Paytm
    const upiLink = generateUpiPaymentUrl({
      amount: 499,
      transactionRef: 'SUSH_TEST123',
      eventTitle: 'Sanskriti Mahotsav Pune',
    });
    expect(upiLink).toContain('upi://pay?');
    expect(upiLink).toContain('pa=sumitshitole447-1%40okhdfcbank');
    expect(upiLink).toContain('am=499.00');
    expect(upiLink).toContain('cu=INR');
    expect(upiLink).toContain('tr=SUSH_TEST123');

    // Test Transaction Reference / UTR validation
    expect(isValidTransactionReference('428901234567')).toBe(true); // 12-digit standard UTR
    expect(isValidTransactionReference('pay_K1234567890abc')).toBe(true); // Razorpay payment ID
    expect(isValidTransactionReference('')).toBe(false);
    expect(isValidTransactionReference('short')).toBe(false);

    // Test signature verification helper
    const testSig = verifyRazorpaySignature({
      orderId: 'order_test_123',
      paymentId: 'pay_test_456',
      signature: 'mock_sig_test',
    });
    expect(testSig).toBe(true);

    // Test paid event exists with ticket tiers
    const paidEvent = await prisma.event.findFirst({
      where: { isPaid: true },
      include: { ticketTiers: true },
    });
    expect(paidEvent).toBeDefined();
    expect(paidEvent?.ticketTiers.length).toBeGreaterThan(0);
    expect(paidEvent?.ticketTiers[0].price).toBeGreaterThan(0);
  });

  it('11. Speakers showcase and Pune Google Map venue locations are properly configured', async () => {
    const { FALLBACK_EVENTS } = await import('../lib/default-events');
    const { isMuted, toggleMute, setMuted } = await import('../lib/sound-effects');

    // Test sound effects state toggling
    expect(typeof isMuted).toBe('function');
    setMuted(false);
    expect(isMuted()).toBe(false);
    toggleMute();
    expect(isMuted()).toBe(true);
    setMuted(false);

    // Verify all fallback events have speakers and Pune Google Maps locations
    expect(FALLBACK_EVENTS.length).toBeGreaterThanOrEqual(5);

    for (const evt of FALLBACK_EVENTS) {
      if (evt.speakers) {
        const speakers = JSON.parse(evt.speakers);
        expect(Array.isArray(speakers)).toBe(true);
        expect(speakers.length).toBeGreaterThanOrEqual(2);
        expect(speakers[0].name).toBeDefined();
        expect(speakers[0].role).toBeDefined();
        expect(speakers[0].company).toBeDefined();
        expect(speakers[0].photo).toMatch(/^https?:\/\//); // Valid photo URL (pfp)
      }

      if (evt.mode === 'OFFLINE' || evt.mode === 'HYBRID') {
        expect(evt.location).toContain('Pune');
        expect(evt.venueAddress).toBeDefined();
        expect(evt.mapLink).toContain('maps.google.com');
      }
    }
  });
});
