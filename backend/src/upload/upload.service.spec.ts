import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

// Mock du module fs
jest.mock('fs');

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);

    // Reset des mocks
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadActivityImage', () => {
    it('devrait uploader une image valide', async () => {
      const mockFile = {
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
        buffer: Buffer.from('fake image data'),
      } as Express.Multer.File;

      const result = await service.uploadActivityImage(mockFile);

      expect(result).toBeDefined();
      expect(result.url).toMatch(/^\/activities-images\/test-image-\d+\.jpg$/);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('devrait accepter les images PNG', async () => {
      const mockFile = {
        originalname: 'test.png',
        mimetype: 'image/png',
        size: 1024 * 500,
        buffer: Buffer.from('fake image'),
      } as Express.Multer.File;

      const result = await service.uploadActivityImage(mockFile);

      expect(result.url).toMatch(/\.png$/);
    });

    it('devrait accepter les images WebP', async () => {
      const mockFile = {
        originalname: 'test.webp',
        mimetype: 'image/webp',
        size: 1024 * 500,
        buffer: Buffer.from('fake image'),
      } as Express.Multer.File;

      const result = await service.uploadActivityImage(mockFile);

      expect(result.url).toMatch(/\.webp$/);
    });

    it('devrait lancer BadRequestException si aucun fichier', async () => {
      await expect(service.uploadActivityImage(null as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadActivityImage(null as any)).rejects.toThrow(
        'Aucun fichier fourni',
      );
    });

    it('devrait lancer BadRequestException pour type de fichier invalide', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake'),
      } as Express.Multer.File;

      await expect(service.uploadActivityImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadActivityImage(mockFile)).rejects.toThrow(
        'Type de fichier non autorisé',
      );
    });

    it('devrait lancer BadRequestException pour fichier trop volumineux', async () => {
      const mockFile = {
        originalname: 'huge-image.jpg',
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB (limite: 5MB)
        buffer: Buffer.from('fake'),
      } as Express.Multer.File;

      await expect(service.uploadActivityImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadActivityImage(mockFile)).rejects.toThrow(
        "L'image ne doit pas dépasser 5MB",
      );
    });

    it('devrait normaliser le nom de fichier', async () => {
      const mockFile = {
        originalname: 'Test Image With Spaces & Special-Chars!.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake'),
      } as Express.Multer.File;

      const result = await service.uploadActivityImage(mockFile);

      // Le nom devrait être normalisé : minuscules, tirets, pas de caractères spéciaux
      expect(result.url).toMatch(
        /^\/activities-images\/test-image-with-spaces-special-chars-\d+\.jpg$/,
      );
    });

    it('devrait créer le dossier si inexistant', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Recréer le service pour déclencher le constructor
      const _service2 = new UploadService();

      expect(fs.mkdirSync).toHaveBeenCalledWith('./public/activities-images', {
        recursive: true,
      });
    });
  });
});
