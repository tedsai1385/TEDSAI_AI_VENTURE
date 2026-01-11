import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Processing with Sharp (WebP conversion + Resizing)
        const processedBuffer = await sharp(buffer)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // In a real scenario, you would upload this to Firebase Storage or Cloud Storage here.
        // For this boilerplate/Phase 3 certification, we return the size reduction info.

        return NextResponse.json({
            success: true,
            originalSize: buffer.length,
            processedSize: processedBuffer.length,
            format: 'webp',
            message: 'Image traitée avec succès (Simulation de stockage réussie)'
        });
    } catch (error) {
        console.error('Image processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
