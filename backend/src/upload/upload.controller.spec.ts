import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    uploadActivityImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('devrait uploader un fichier avec succès', async () => {
      const mockFile = {
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024 * 1024,
        buffer: Buffer.from('fake image data'),
      } as Express.Multer.File;

      const mockResponse = { url: '/activities-images/test-image-123456.jpg' };

      mockUploadService.uploadActivityImage.mockResolvedValue(mockResponse);

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual(mockResponse);
      expect(service.uploadActivityImage).toHaveBeenCalledWith(mockFile);
    });

    it('devrait gérer un fichier PNG', async () => {
      const mockFile = {
        originalname: 'image.png',
        mimetype: 'image/png',
        size: 500 * 1024,
        buffer: Buffer.from('fake png'),
      } as Express.Multer.File;

      const mockResponse = { url: '/activities-images/image-123456.png' };

      mockUploadService.uploadActivityImage.mockResolvedValue(mockResponse);

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual(mockResponse);
      expect(service.uploadActivityImage).toHaveBeenCalledWith(mockFile);
    });

    it('devrait gérer un fichier WebP', async () => {
      const mockFile = {
        originalname: 'photo.webp',
        mimetype: 'image/webp',
        size: 300 * 1024,
        buffer: Buffer.from('fake webp'),
      } as Express.Multer.File;

      const mockResponse = { url: '/activities-images/photo-123456.webp' };

      mockUploadService.uploadActivityImage.mockResolvedValue(mockResponse);

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual(mockResponse);
    });
  });
});
