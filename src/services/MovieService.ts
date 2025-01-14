import { MovieRepository } from '../repositories/MovieRepository';
import { MovieType } from '../schemas/movie.schema';
import { Movie } from '../models/Movie';

export class MovieService {
    private repository: MovieRepository;

    constructor() {
        this.repository = new MovieRepository();
    }

    async create(data: MovieType): Promise<Movie> {
        return await this.repository.create(data);
    }
    
    async saveMany(data: MovieType[]): Promise<MovieType[]> {
        return await this.repository.saveMany(data);
    }

    async findAll(): Promise<Movie[]> {
        return await this.repository.findAll();
    }

    async findById(id: number): Promise<Movie | null> {
        return await this.repository.findById(id);
    }

    async update(id: number, data: Partial<MovieType>): Promise<Movie | null> {
        return await this.repository.update(id, data);
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.repository.deleteById(id);
    }

    async deleteAll(): Promise<void> {
        await this.repository.deleteAll();
    }


}