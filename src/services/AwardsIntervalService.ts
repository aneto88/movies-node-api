import { AwardIntervals } from "../interfaces/movies/AwardIntervals";
import { ProducerInterval } from "../interfaces/movies/ProducerInterval";
import { Movie } from "../models/Movie";

export function processProducerWins(producerWins: Map<string, number[]>): ProducerInterval[] {
    const processedProducers: ProducerInterval[] = [];

    producerWins.forEach((years, producer) => {
        // Ordenar os anos
        const sortedYears = years.sort((a, b) => a - b);
        
       // Calcular o ano mínimo e máximo
       const previousWin = sortedYears[0];
       const followingWin = sortedYears[sortedYears.length - 1];
       
       // Calcular o count (diferença entre o maior e menor ano)
       const interval = followingWin - previousWin;
       if(interval > 0) {
            processedProducers.push({
                producer,
                previousWin,
                followingWin,
                interval
            });
        }
    });

    return processedProducers;
}

export function generateMinMaxIntervals(processedProducers: ProducerInterval[]): AwardIntervals {
    // Se não houver produtores, retorna arrays vazios
    if (processedProducers.length === 0) {
        return { min: [], max: [] };
    }

    // Encontrar o menor e maior intervalo
    const minInterval = Math.min(...processedProducers.map(p => p.interval));
    const maxInterval = Math.max(...processedProducers.map(p => p.interval));

    // Filtrar produtores com o menor intervalo
    const minProducers: ProducerInterval[] = processedProducers
        .filter(p => p.interval === minInterval);

    // Filtrar produtores com o maior intervalo
    const maxProducers: ProducerInterval[] = processedProducers
        .filter(p => p.interval === maxInterval);

    return {
        min: minProducers,
        max: maxProducers
    };
}

export class AwardsIntervalService {
    static calculateIntervals(movies: Movie[]): AwardIntervals {
        const winningMovies = movies
            .filter(movie => movie.winner)
            .sort((a, b) => a.year - b.year);

        const producerWins = new Map<string, number[]>();

        winningMovies.forEach(movie => {
            const producers = movie.producers
                .split(/,|\band\b/)
                .map(p => p.trim());

            producers.forEach(producer => {
                if (!producerWins.has(producer)) {
                    producerWins.set(producer, []);
                }
                producerWins.get(producer)?.push(movie.year);
            });
        });

        const producerWinsIntervals = processProducerWins(producerWins);

        return generateMinMaxIntervals(producerWinsIntervals);
    }
}