import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_TOKEN = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || process.env.REVALIDATE_TOKEN || 'dev-token-change-in-prod';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paths, secret, tag } = body;

        // Vérification sécurité
        if (secret !== REVALIDATE_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const revalidated: string[] = [];

        // Revalidation par chemins
        if (paths && Array.isArray(paths)) {
            for (const path of paths) {
                revalidatePath(path);
                revalidated.push(path);
                console.log('[Revalidate] Path:', path);
            }
        }

        // Revalidation par tag (optionnel)
        if (tag) {
            revalidateTag(tag);
            revalidated.push(`tag:${tag}`);
        }

        return NextResponse.json({
            revalidated,
            now: Date.now(),
            message: 'Cache revalidated successfully'
        });

    } catch (error: any) {
        console.error('[Revalidate] Error:', error);
        return NextResponse.json(
            { error: 'Revalidation failed', message: error.message },
            { status: 500 }
        );
    }
}
