import { NextRequest, NextResponse } from 'next/server';

// Note: In production, you would use @sendgrid/mail
// For now, we simulate the logic as part of Phase 3 certification.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { to, subject, type, data } = body;

        if (!to || !subject) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log(`[Email Service] To: ${to}, Subject: ${subject}, Type: ${type}`);
        console.log(`[Email Service] Data:`, data);

        // Simulation d'envoi via SendGrid
        // await sgMail.send({ to, from: 'noreply@tedsai.cm', subject, html: '...' });

        return NextResponse.json({
            success: true,
            message: `Notification ${type} envoyée à ${to}`
        });
    } catch (error) {
        console.error('Email service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
