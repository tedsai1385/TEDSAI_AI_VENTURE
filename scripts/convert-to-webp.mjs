import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIRS = [
    path.join(__dirname, '../assets/images'),
    path.join(__dirname, '../public/images')
];

const QUALITY = 80;

async function convertDir(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`⚠️  Dossier introuvable: ${dir}`);
        return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await convertDir(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
            const output = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

            if (fs.existsSync(output)) {
                // console.log(`⏭️  Déjà converti: ${entry.name}`);
                continue;
            }

            console.log(`🔄 Conversion: ${entry.name}`);
            try {
                await sharp(fullPath)
                    .webp({ quality: QUALITY })
                    .toFile(output);
                // console.log(`✅ ${entry.name} -> WebP`);
            } catch (err) {
                console.error(`❌ Erreur sur ${entry.name}:`, err.message);
            }
        }
    }
}

async function main() {
    console.log("🖼️  Conversion batch vers WebP avec Sharp...");
    for (const dir of SOURCE_DIRS) {
        await convertDir(dir);
    }
    console.log("✅ Terminé !");
}

main();
