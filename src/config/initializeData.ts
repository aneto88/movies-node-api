import { readFileSync } from 'fs';
import path from 'path';
import { CsvImportService } from '../services/CsvImportService';
import { MovieService } from '../services/MovieService';

export async function initializeDataFromCsv() {
    try {
        const csvPath = path.resolve(__dirname, '..', '..', 'docs', 'movies.csv');
        const csvContent = readFileSync(csvPath, 'utf-8');
        
        const movieService = new MovieService();

        // Limpa o banco antes de importar
        await movieService.deleteAll();

        // Importa os dados do CSV
        const movies = await CsvImportService.parseCsv(csvContent);
        await movieService.saveMany(movies);
    } catch (error) {
        console.error('Error importing initial data:', error);
        throw error;
    }
}
