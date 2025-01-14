import { Request, Response } from 'express';
import { MovieController } from './MovieController';
import { MovieSchema } from '../schemas/movie.schema';
import { AwardsIntervalService } from '../services/AwardsIntervalService';
import { CsvImportService } from '../services/CsvImportService';
import { Readable } from 'stream';

describe('MovieController', () => {
  let movieController: MovieController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    movieController = new MovieController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('should create a movie and return 201 status when valid data is provided', async () => {
    const mockValidatedData = { title: 'Test Movie', year: 2023, studios: 'A', producers: 'Test Producer', winner: false };
    const mockCreatedMovie = { id: 1, ...mockValidatedData };

    jest.spyOn(MovieSchema, 'parse').mockReturnValue(mockValidatedData);
    jest.spyOn(movieController['service'], 'create').mockResolvedValue(mockCreatedMovie);

    mockRequest.body = mockValidatedData;

    await movieController.create(mockRequest as Request, mockResponse as Response);

    expect(MovieSchema.parse).toHaveBeenCalledWith(mockValidatedData);
    expect(movieController['service'].create).toHaveBeenCalledWith(mockValidatedData);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedMovie);
    });

    it('should return 400 status with "Invalid data" error when invalid data is provided', async () => {
    const mockInvalidData = { title: 'Invalid Movie' }; // Missing required fields

    jest.spyOn(MovieSchema, 'parse').mockImplementation(() => {
        throw new Error('Validation error');
    });

    mockRequest.body = mockInvalidData;

    await movieController.create(mockRequest as Request, mockResponse as Response);

    expect(MovieSchema.parse).toHaveBeenCalledWith(mockInvalidData);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });

    it('should handle missing required fields in the request body', async () => {
    const mockInvalidData = { title: 'Test Movie' }; // Missing required fields

    jest.spyOn(MovieSchema, 'parse').mockImplementation(() => {
        throw new Error('Validation error');
    });

    mockRequest.body = mockInvalidData;

    await movieController.create(mockRequest as Request, mockResponse as Response);

    expect(MovieSchema.parse).toHaveBeenCalledWith(mockInvalidData);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });
  });

  describe('Find all', () => {
    it('should return an array of movies when findAll is called successfully', async () => {
        const mockMovies = [
          { id: 1, title: 'Movie 1', year: 2021, studios: 'Studio A', producers: 'Producer X', winner: true },
          { id: 2, title: 'Movie 2', year: 2022, studios: 'Studio B', producers: 'Producer Y', winner: false },
        ];

        jest.spyOn(movieController['service'], 'findAll').mockResolvedValue(mockMovies);

        await movieController.findAll(mockRequest as Request, mockResponse as Response);

        expect(movieController['service'].findAll).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
      });

      it('should return a 500 status with an error message when the service throws an error', async () => {
        const mockError = new Error('Database error');
        jest.spyOn(movieController['service'], 'findAll').mockRejectedValue(mockError);

        await movieController.findAll(mockRequest as Request, mockResponse as Response);

        expect(movieController['service'].findAll).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch movies' });
      });
  });

  describe('Movies Awards Interval', () => {
    it('should return producer intervals when movies are successfully fetched', async () => {
        const mockMovies = [
          { id: 1, title: 'Movie 1', year: 2000, producers: 'Producer A', studios: 'Studio X', winner: true },
          { id: 2, title: 'Movie 2', year: 2010, producers: 'Producer A', studios: 'Studio X',  winner: true },
          { id: 3, title: 'Movie 3', year: 2005, producers: 'Producer B', studios: 'Studio X', winner: true },
          { id: 4, title: 'Movie 4', year: 2006, producers: 'Producer B', studios: 'Studio X', winner: true }
        ];

        const mockIntervals = {
          min: [{ producer: 'Producer B', interval: 1, previousWin: 2005, followingWin: 2006 }],
          max: [{ producer: 'Producer A', interval: 10, previousWin: 2000, followingWin: 2010 }]
        };

        jest.spyOn(movieController['service'], 'findAll').mockResolvedValue(mockMovies);
        jest.spyOn(AwardsIntervalService, 'calculateIntervals').mockReturnValue(mockIntervals);

        await movieController.getProducerIntervals(mockRequest as Request, mockResponse as Response);

        expect(movieController['service'].findAll).toHaveBeenCalled();
        expect(AwardsIntervalService.calculateIntervals).toHaveBeenCalledWith(mockMovies);
        expect(mockResponse.json).toHaveBeenCalledWith(mockIntervals);
      });

      it('should handle empty movie list and return appropriate intervals', async () => {
        const mockEmptyMovies: any[] = [];
        const mockEmptyIntervals = { min: [], max: [] };

        jest.spyOn(movieController['service'], 'findAll').mockResolvedValue(mockEmptyMovies);
        jest.spyOn(AwardsIntervalService, 'calculateIntervals').mockReturnValue(mockEmptyIntervals);

        await movieController.getProducerIntervals(mockRequest as Request, mockResponse as Response);

        expect(movieController['service'].findAll).toHaveBeenCalled();
        expect(AwardsIntervalService.calculateIntervals).toHaveBeenCalledWith(mockEmptyMovies);
        expect(mockResponse.json).toHaveBeenCalledWith(mockEmptyIntervals);
      });
  });
  describe('Import', () => {
    it('should return 400 status when no file is provided in the request', async () => {
        mockRequest.file = undefined;

        await movieController.importCsv(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No file provided' });
      });

      it('should handle and parse CSV content correctly when a valid file is provided', async () => {
        const mockCsvContent = 'year;title;studios;producers;winner\n2022;Test Movie;Test Studio;Test Producer;yes';
        const mockParsedMovies = [{ year: 2022, title: 'Test Movie', studios: 'Test Studio', producers: 'Test Producer', winner: true }];

        mockRequest.file = {
            buffer: Buffer.from(mockCsvContent, 'utf-8'),
            fieldname: 'file',        // nome do campo do formulário
            originalname: 'test.csv', // nome original do arquivo
            encoding: '7bit',         // encoding do arquivo
            mimetype: 'text/csv',     // tipo MIME do arquivo
            size: Buffer.from(mockCsvContent, 'utf-8').length, // tamanho em bytes
            destination: '',          // destino do arquivo (usado pelo multer)
            filename: 'test.csv',     // nome do arquivo no sistema
            path: '',                  // caminho do arquivo (usado pelo multer)
            stream: Readable.from(Buffer.from(mockCsvContent, 'utf-8'))
    
        };              

        jest.spyOn(CsvImportService, 'parseCsv').mockResolvedValue(mockParsedMovies);
        jest.spyOn(movieController['service'], 'saveMany').mockResolvedValue([]);

        await movieController.importCsv(mockRequest as Request, mockResponse as Response);

        expect(CsvImportService.parseCsv).toHaveBeenCalledWith(mockCsvContent);
        expect(movieController['service'].saveMany).toHaveBeenCalledWith(mockParsedMovies);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'CSV imported successfully' });
        expect(CsvImportService.parseCsv).toHaveBeenCalledWith(mockCsvContent);
        expect(CsvImportService.parseCsv).toHaveBeenCalledWith(mockCsvContent);
        expect(movieController['service'].saveMany).toHaveBeenCalledWith(mockParsedMovies);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'CSV imported successfully' });
      });
  });
});
