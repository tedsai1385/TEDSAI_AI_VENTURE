import { NextRequest, NextResponse } from 'next/server';
import { indexSiteContent } from '@/services/chatbot/site-indexer';

/**
 * API Route to trigger site content indexation
 * POST /api/chatbot/index-site
 * Admin only (in production, add authentication check)
 */
export async function POST(request: NextRequest) {
    try {
        console.log('📡 Indexation request received');

        // In production, add authentication check here
        // const { user } = await verifyAuth(request);
        // if (!user || user.role !== 'admin') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // Trigger indexation
        const result = await indexSiteContent();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Successfully indexed ${result.indexed} pages`,
                indexed: result.indexed,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Indexation completed with errors',
                indexed: result.indexed,
                errors: result.errors,
            }, { status: 207 }); // 207 Multi-Status
        }
    } catch (error) {
        console.error('Indexation API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to index site content',
            },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint to check indexation status
 */
export async function GET() {
    return NextResponse.json({
        message: 'Site indexation endpoint',
        usage: 'Send POST request to trigger indexation',
    });
}
