import { AwardIntervals } from "../interfaces/movies/AwardIntervals";
import { ProducerInterval } from "../interfaces/movies/ProducerInterval";
import { Movie } from "../models/Movie";

export class AwardsIntervalService {
    static calculateIntervals(movies: Movie[]): AwardIntervals {
        const winnersMap: Map<string, number[]> = this.mapProducersToYears(movies);
        const intervalsMap: Map<string, ProducerInterval[]> = this.mapYearsToIntervals(winnersMap);

        const { minInterval, maxInterval } = this.findMinMaxIntervals(intervalsMap);

        return { 
            min: minInterval,
            max: maxInterval
        };
    }

    private static mapProducersToYears(movies: Movie[]): Map<string, number[]> {
        const winnersMap: Map<string, number[]> = new Map();

        for (const movie of movies) {
            const producers = this.extractProducers(movie.producers);
            for (const producer of producers) {
                if (!winnersMap.has(producer)) {
                    winnersMap.set(producer, []);
                }
                winnersMap.get(producer)?.push(movie.year);
            }
        }

        return winnersMap;
    }

    private static extractProducers(producerString: string): string[] {
        return producerString.split(/,| and /).map(s => s.trim());
    }

    private static mapYearsToIntervals(winnersMap: Map<string, number[]>): Map<string, ProducerInterval[]> {
        const intervalsMap: Map<string, ProducerInterval[]> = new Map();

        for (const [producer, years] of winnersMap.entries()) {
            const intervals: ProducerInterval[] = this.calculateProducerIntervals(producer, years);
            intervalsMap.set(producer, intervals);
        }

        return intervalsMap;
    }

    private static calculateProducerIntervals(producer: string, years: number[]): ProducerInterval[] {
        const intervals: ProducerInterval[] = [];

        for (let i = 0; i < years.length - 1; i++) {
            const interval = years[i + 1] - years[i];
            const intervalInfo: ProducerInterval = {
                producer: producer,
                interval: interval,
                previousWin: years[i],
                followingWin: years[i + 1],
            };
            intervals.push(intervalInfo);
        }

        return intervals;
    }

    private static findMinMaxIntervals(intervalsMap: Map<string, ProducerInterval[]>): { minInterval: ProducerInterval[], maxInterval: ProducerInterval[] } {
        let minInterval: ProducerInterval[] = [];
        let maxInterval: ProducerInterval[] = [];

        for (const intervals of intervalsMap.values()) {
            if (intervals.length > 0) {
                const sortedIntervals = intervals.sort((a, b) => a.interval - b.interval);
                const min = sortedIntervals[0];
                const max = sortedIntervals[sortedIntervals.length - 1];

                minInterval = this.updateMinInterval(min, minInterval, intervals);
                maxInterval = this.updateMaxInterval(max, maxInterval, intervals);
            }
        }

        return { minInterval, maxInterval };
    }

    private static updateMinInterval(min: ProducerInterval, currentMin: ProducerInterval[], intervals: ProducerInterval[]): ProducerInterval[] {
        const minProducers = intervals.filter(prod => prod.interval === min.interval);

        if (currentMin.length === 0 || min.interval < currentMin[0].interval) {
            return minProducers;
        } else if (min.interval === currentMin[0].interval) {
            return [...currentMin, ...minProducers];
        }

        return currentMin;
    }

    private static updateMaxInterval(max: ProducerInterval, currentMax: ProducerInterval[], intervals: ProducerInterval[]): ProducerInterval[] {
        const maxProducers = intervals.filter(prod => prod.interval === max.interval);

        if (currentMax.length === 0 || max.interval > currentMax[0].interval) {
            return maxProducers;
        } else if (max.interval === currentMax[0].interval) {
            return [...currentMax, ...maxProducers];
        }

        return currentMax;
    }
}