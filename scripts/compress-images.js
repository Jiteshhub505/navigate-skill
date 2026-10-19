const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// All PNGs with alpha transparency — convert to WebP to preserve transparency + compress
const alphaImages = [
    { input: 'public/assets/yogahero.png',   output: 'public/assets/yogahero.webp',   maxWidth: 1200 },
    { input: 'public/assets/yogacard.png',   output: 'public/assets/yogacard.webp',   maxWidth: 800  },
    { input: 'public/assets/dance.png',      output: 'public/assets/dance.webp',      maxWidth: 1200 },
    { input: 'public/assets/learning.png',   output: 'public/assets/learning.webp',   maxWidth: 1200 },
    { input: 'public/assets/yoga-course.png',  output: 'public/assets/yoga-course.webp',  maxWidth: 900 },
    { input: 'public/assets/yoga-course1.png', output: 'public/assets/yoga-course1.webp', maxWidth: 900 },
    { input: 'public/assets/yoga-course2.png', output: 'public/assets/yoga-course2.webp', maxWidth: 900 },
    { input: 'public/assets/yoga-course3.png', output: 'public/assets/yoga-course3.webp', maxWidth: 900 },
    { input: 'public/assets/dance_teaching.png', output: 'public/assets/dance_teaching.webp', maxWidth: 1000 },
    { input: 'public/assets/teaching_illustration.png', output: 'public/assets/teaching_illustration.webp', maxWidth: 1000 },
    { input: 'public/assets/community.png',  output: 'public/assets/community.webp',  maxWidth: 800  },
    { input: 'public/assets/yoga-course3.png', output: 'public/assets/yoga-course3.webp', maxWidth: 900 },
    { input: 'public/logo.png',              output: 'public/logo.webp',              maxWidth: 400  },
    { input: 'public/logo-icon.png',         output: 'public/logo-icon.webp',         maxWidth: 200  },
];

async function convertToWebP(target) {
    const inputPath = path.join(rootDir, target.input);
    const outputPath = path.join(rootDir, target.output);

    if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping (not found): ${target.input}`);
        return;
    }

    const statBefore = fs.statSync(inputPath);
    const sizeBefore = (statBefore.size / 1024).toFixed(1);

    try {
        await sharp(inputPath)
            .resize({ width: target.maxWidth, withoutEnlargement: true })
            .webp({ quality: 85, lossless: false, alphaQuality: 90 })
            .toFile(outputPath);

        const statAfter = fs.statSync(outputPath);
        const sizeAfter = (statAfter.size / 1024).toFixed(1);
        const savings = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1);

        const hasAlpha = target.input.endsWith('.png') ? '(transparency preserved ✨)' : '';
        console.log(`✅ ${target.input} → ${path.basename(target.output)}`);
        console.log(`   ${sizeBefore}KB → ${sizeAfter}KB (saved ${savings}%) ${hasAlpha}`);
    } catch (err) {
        console.error(`❌ Error: ${target.input}:`, err.message);
    }
}

async function main() {
    console.log('🌐 Converting PNGs to WebP (with transparency)...\n');
    for (const target of alphaImages) {
        await convertToWebP(target);
    }
    console.log('\n✨ Done! All transparency images converted to WebP.');
}

main();
