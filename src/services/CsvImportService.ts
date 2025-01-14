import { Readable } from 'stream';
import { MovieType } from '../schemas/movie.schema';
import parse from 'csv-parse';

export class CsvImportService {
    static async parseCsv(csvContent: string): Promise<MovieType[]> {
        return new Promise((resolve, reject) => {
            const results: MovieType[] = [];
            const parser = parse({
                delimiter: ';',
                columns: true,
                skip_empty_lines: true
            });

            const stream = Readable.from(csvContent);
            stream
                .pipe(parser)
                .on('data', (data: any) => {
                    results.push({
                        year: parseInt(data.year),
                        title: data.title,
                        studios: data.studios,
                        producers: data.producers,
                        winner: data.winner.toLowerCase() === 'yes'
                    });
                })
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }
}