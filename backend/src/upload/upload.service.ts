import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = './public/activities-images';

  constructor() {
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadActivityImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Validation du type de fichier
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Utilisez JPG, PNG ou WebP');
    }

    // Validation de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('L\'image ne doit pas dépasser 5MB');
    }

    // Génération du nom de fichier avec timestamp
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const basename = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
      .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin

    const filename = `${basename}-${timestamp}${extension}`;
    const filepath = path.join(this.uploadPath, filename);

    // Sauvegarde du fichier
    fs.writeFileSync(filepath, file.buffer);

    // Retourner l'URL relative
    return {
      url: `/activities-images/${filename}`,
    };
  }
}
