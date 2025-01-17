import { AwardIntervals } from "../interfaces/movies/AwardIntervals";
import { ProducerInterval } from "../interfaces/movies/ProducerInterval";
import { Movie } from "../models/Movie";

export class AwardsIntervalService {
    static calculateIntervals(movies: Movie[]): AwardIntervals {
        const winnersMap: Map<string, number[]> = new Map()
        const intervalsMap: Map<string, ProducerInterval[]> = new Map()

        for (const movie of movies) {
            const producers = movie.producers
                .split(/,| and /)
                .map((s) => s.trim())
            for (const producer of producers) {
                if (!winnersMap.has(producer)) {
                    winnersMap.set(producer, [])
                }
                winnersMap.get(producer)?.push(movie.year)
            }
        }

        for (const [producer, years] of winnersMap.entries()) {
            const intervals: ProducerInterval[] = []

            for (let i = 0; i < years.length - 1; i++) {
                const interval = years[i + 1] - years[i]
                const intervalInfo: ProducerInterval = {
                    producer: producer,
                    interval: interval,
                    previousWin: years[i],
                    followingWin: years[i + 1],
                }
                intervals.push(intervalInfo)
            }

            intervalsMap.set(producer, intervals)
        }

        // Find the producers with the smallest and largest range
        let minInterval: ProducerInterval[] = []
        let maxInterval: ProducerInterval[] = []

        for (const intervals of intervalsMap.values()) {
            if (intervals.length > 0) {
            const sortedIntervals = intervals.sort(
                (a, b) => a.interval - b.interval,
            )
            const min = sortedIntervals[0]
            const max = sortedIntervals[sortedIntervals.length - 1]

            const minProducers = intervals.filter(
                (prod) => prod.interval === min.interval,
            )
            const maxProducers = intervals.filter(
                (prod) => prod.interval === max.interval,
            )

            if (
                minInterval.length === 0 ||
                min.interval < minInterval[0].interval
            ) {
                minInterval = minProducers
            } else if (min.interval === minInterval[0].interval) {
                minInterval.push(...minProducers)
            }

            if (
                maxInterval.length === 0 ||
                max.interval > maxInterval[0].interval
            ) {
                maxInterval = maxProducers
            } else if (max.interval === maxInterval[0].interval) {
                maxInterval.push(...maxProducers)
            }
            }
        }

        return { 
            min: minInterval,
            max: maxInterval
        }
    }

}