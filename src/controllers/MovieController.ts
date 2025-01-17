import { Request, Response } from 'express';
import { MovieService } from '../services/MovieService';
import { MovieSchema } from '../schemas/movie.schema';
import { CsvImportService } from '../services/CsvImportService';
import { AwardsIntervalService } from '../services/AwardsIntervalService';
import multer from 'multer';

export const upload = multer();

export class MovieController {
    private service: MovieService;

    constructor() {
        this.service = new MovieService();
    }

    /**
     * @swagger
     * /api/movies:
     *   post:
     *     summary: Cria um novo filme
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               year:
     *                 type: integer
     *                 example: 2023
     *               title:
     *                 type: string
     *                 example: "O Senhor dos Anéis"
     *               studios:
     *                 type: string
     *                 example: "New Line Cinema"
     *               producers:
     *                 type: string
     *                 example: "Peter Jackson, Fran Walsh"
     *               winner:
     *                 type: boolean
     *                 example: true
     *     responses:
     *       201:
     *         description: Filme criado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    async create(req: Request, res: Response) {
        try {
            const validatedData = MovieSchema.parse(req.body);
            const movie = await this.service.create(validatedData);
            return res.status(201).json(movie);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid data' });
        }
    }

    /**
     * @swagger
     * /api/movies:
     *   get:
     *     summary: Retorna todos os filmes
     *     responses:
     *       200:
     *         description: Lista de filmes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   year:
     *                     type: integer
     *                   title:
     *                     type: string
     *                   studios:
     *                     type: string
     *                   producers:
     *                     type: string
     *                   winner:
     *                     type: boolean
     *       500:
     *         description: Falha ao buscar filmes
     */
    async findAll(req: Request, res: Response) {
        try {
            const movies = await this.service.findAll();
            return res.json(movies);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }

    /**
     * @swagger
     * /api/movies/{id}:
     *   get:
     *     summary: Retorna um filme pelo ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do filme
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Filme encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 year:
     *                   type: integer
     *                 title:
     *                   type: string
     *                 studios:
     *                   type: string
     *                 producers:
     *                   type: string
     *                 winner:
     *                   type: boolean
     *       404:
     *         description: Filme não encontrado
     *       500:
     *         description: Falha ao buscar filme
     */
    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const movie = await this.service.findById(id);
            
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            
            return res.json(movie);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch movie' });
        }
    }

    /**
     * @swagger
     * /api/movies/{id}:
     *   put:
     *     summary: Atualiza um filme pelo ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do filme
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               year:
     *                 type: integer
     *                 example: 2023
     *               title:
     *                 type: string
     *                 example: "O Senhor dos Anéis"
     *               studios:
     *                 type: string
     *                 example: "New Line Cinema"
     *               producers:
     *                 type: string
     *                 example: "Peter Jackson, Fran Walsh"
     *               winner:
     *                 type: boolean
     *                 example: true
     *     responses:
     *       200:
     *         description: Filme atualizado com sucesso
     *       404:
     *         description: Filme não encontrado
     *       400:
     *         description: Dados inválidos
     */
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const validatedData = MovieSchema.partial().parse(req.body);
            
            const movie = await this.service.update(id, validatedData);
            
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            
            return res.json(movie);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid data' });
        }
    }

    /**
     * @swagger
     * /api/movies/{id}:
     *   delete:
     *     summary: Deleta um filme pelo ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do filme
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Filme deletado com sucesso
     *       404:
     *         description: Filme não encontrado
     *       500:
     *         description: Falha ao deletar filme
     */
    async deleteById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const success = await this.service.deleteById(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete movie' });
        }
    }

    /**
     * @swagger
     * /api/movies:
     *   delete:
     *     summary: Deleta todos os filmes
     *     responses:
     *       204:
     *         description: Todos os filmes deletados com sucesso
     *       500:
     *         description: Falha ao deletar filmes
     */
    async deleteAll(req: Request, res: Response) {
        try {
            await this.service.deleteAll();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete movies' });
        }
    }

    /**
     * @swagger
     * /api/movies/import:
     *   post:
     *     summary: Importa filmes a partir de um arquivo CSV
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: CSV importado com sucesso
     *       400:
     *         description: Falha ao importar CSV ou nenhum arquivo fornecido
     */
    async importCsv(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file provided' });
            }

            const csvContent = req.file.buffer.toString('utf-8');
            const movies = await CsvImportService.parseCsv(csvContent);
            
            await this.service.saveMany(movies);
            
            return res.status(201).json({ message: 'CSV imported successfully' });
        } catch (error) {
            return res.status(400).json({ error: 'Failed to import CSV' });
        }
    }

    /**
     * @swagger
     * /api/movies/awards-interval:
     *   get:
     *     summary: Calcula intervalos de prêmios dos produtores
     *     responses:
     *       200:
     *         description: Intervalos de prêmios calculados com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               additionalProperties:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     producer:
     *                       type: string
     *                     intervals:
     *                       type: integer
     *                       items:
     *                         type: object
     *                         properties:
     *                           startYear:
     *                             type: integer
     *                           endYear:
     *                             type: integer
     *             examples:
     *               application/json:
     *                 value: {
     *                   "min": [
     *                     {
     *                       "producer": "Test X",
     *                       "previousWin": 1990,
     *                       "followingWin": 1991,
     *                       "interval": 1
     *                     }
     *                   ],
     *                   "max": [
     *                     {
     *                       "producer": "Test Y",
     *                       "previousWin": 200,
     *                       "followingWin": 2015,
     *                       "interval": 15
     *                     }
     *                   ]
     *                 }
     *       500:
     *         description: Falha ao calcular intervalos
     */
    async getProducerIntervals(req: Request, res: Response) {
        try {
            const movies = await this.service.getProducersWinners();
            const intervals = AwardsIntervalService.calculateIntervals(movies);
            return res.json(intervals);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to calculate intervals' });
        }
    }
}