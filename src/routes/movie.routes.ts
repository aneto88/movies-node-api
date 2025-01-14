import { Router } from 'express';
import { MovieController, upload } from '../controllers/MovieController';

const router = Router();
const movieController = new MovieController();

router.get('/awards-interval', (req, res) => movieController.getProducerIntervals(req, res));

router.post('/import', upload.single('file'), (req, res) => movieController.importCsv(req, res));

router.post('/', (req, res) => movieController.create(req, res));
router.get('/', (req, res) => movieController.findAll(req, res));

router.get('/:id', (req, res) => movieController.findById(req, res));
router.delete('/:id', (req, res) => movieController.deleteById(req, res));
router.delete('/', (req, res) => movieController.deleteAll(req, res));

export default router;