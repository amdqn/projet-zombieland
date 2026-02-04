#!/usr/bin/env node
/**
 * Script d'optimisation des images pour Lighthouse
 * Convertit les images PNG/JPG en WebP avec compression
 */

import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dossiers à traiter (frontend ET backend)
const TARGETS = [
  {
    name: 'Frontend',
    path: join(__dirname, '..', 'public'),
    dirs: ['activities-images', 'attractions-images', 'restaurants-images', 'homepage-images', 'map-images']
  },
  {
    name: 'Backend',
    path: join(__dirname, '..', '..', 'backend', 'public'),
    dirs: ['activities-images', 'attractions-images', 'restaurants-images', 'homepage-images']
  }
];

const QUALITY = 80; // Qualité WebP (0-100)
const DELETE_ORIGINALS = true; // Supprimer les fichiers originaux après conversion

async function getFileSizeKB(filePath) {
  const stats = await stat(filePath);
  return (stats.size / 1024).toFixed(1);
}

async function convertToWebP(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const originalSize = await getFileSizeKB(inputPath);

  try {
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const newSize = await getFileSizeKB(outputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)}`);
    console.log(`  ${originalSize} KB → ${newSize} KB (${savings}% saved)`);

    if (DELETE_ORIGINALS) {
      await unlink(inputPath);
    }

    return { original: parseFloat(originalSize), converted: parseFloat(newSize) };
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(dirPath) {
  let totalOriginal = 0;
  let totalConverted = 0;
  let count = 0;

  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        const result = await convertToWebP(filePath);
        if (result) {
          totalOriginal += result.original;
          totalConverted += result.converted;
          count++;
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${dirPath}:`, error.message);
  }

  return { totalOriginal, totalConverted, count };
}

async function main() {
  console.log('🖼️  Optimisation des images pour Lighthouse\n');
  console.log(`Qualité WebP: ${QUALITY}%`);
  console.log(`Suppression des originaux: ${DELETE_ORIGINALS ? 'Oui' : 'Non'}\n`);

  let grandTotalOriginal = 0;
  let grandTotalConverted = 0;
  let grandTotalCount = 0;

  for (const target of TARGETS) {
    console.log('\n' + '═'.repeat(50));
    console.log(`🗂️  ${target.name.toUpperCase()}`);
    console.log('═'.repeat(50));

    for (const dir of target.dirs) {
      const dirPath = join(target.path, dir);
      console.log(`\n📁 ${dir}`);
      console.log('─'.repeat(50));

      const { totalOriginal, totalConverted, count } = await processDirectory(dirPath);

      grandTotalOriginal += totalOriginal;
      grandTotalConverted += totalConverted;
      grandTotalCount += count;

      if (count > 0) {
        console.log(`\n  Sous-total: ${(totalOriginal / 1024).toFixed(2)} MB → ${(totalConverted / 1024).toFixed(2)} MB`);
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📊 RÉSUMÉ FINAL');
  console.log('═'.repeat(50));
  console.log(`Images converties: ${grandTotalCount}`);
  console.log(`Taille originale: ${(grandTotalOriginal / 1024).toFixed(2)} MB`);
  console.log(`Taille finale: ${(grandTotalConverted / 1024).toFixed(2)} MB`);
  const savings = grandTotalOriginal > 0 ? ((grandTotalOriginal - grandTotalConverted) / grandTotalOriginal * 100).toFixed(1) : 0;
  console.log(`Économie totale: ${((grandTotalOriginal - grandTotalConverted) / 1024).toFixed(2)} MB (${savings}%)`);
}

main().catch(console.error);
