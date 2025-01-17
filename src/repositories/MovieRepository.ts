import { AppDataSource } from '../config/database';
import { Movie } from '../models/Movie';
import { MovieType } from '../schemas/movie.schema';

export class MovieRepository {
    private repository = AppDataSource.getRepository(Movie);

    async create(data: MovieType): Promise<Movie> {
        const movie = this.repository.create(data);
        return await this.repository.save(movie);
    }


    async saveMany(data: MovieType[]): Promise<Movie[]> {
        const movies = this.repository.create(data);
        return await this.repository.save(movies);
    }

    async findAll(): Promise<Movie[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<Movie | null> {
        return await this.repository.findOneBy({ id });
    }

    async update(id: number, data: Partial<MovieType>): Promise<Movie | null> {
        const movie = await this.findById(id);
        if (!movie) return null;

        Object.assign(movie, data);
        return await this.repository.save(movie);
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    async deleteAll(): Promise<void> {
        await this.repository.clear();
    }

    async getProducersWinners(): Promise<Movie[]> {
        return await this.repository.find({
            where: {
                winner: true
            },
            order: {
                year: "ASC"
            }
        });
    }

}