import { AwardsIntervalService } from './AwardsIntervalService';
import { Movie } from '../models/Movie';

describe('AwardsIntervalService', () => {
  describe('calculateIntervals', () => {
    it('should calculate correct intervals for multiple wins by the same producer', () => {
        const movies: Movie[] = [
          { id: 1, title: 'Title A', year: 2000, producers: 'Producer A', studios: 'studio A', winner: true },
          { id: 2, title: 'Title B',  year: 2005, producers: 'Producer A', studios: 'studio A', winner: true },
          { id: 3, title: 'Title C',  year: 2010, producers: 'Producer A', studios: 'studio A', winner: true },
          { id: 4, title: 'Title D',  year: 2015, producers: 'Producer B', studios: 'studio A', winner: true },
          { id: 5, title: 'Title E',  year: 2020, producers: 'Producer B', studios: 'studio A', winner: true },
        ];
      
        const result = AwardsIntervalService.calculateIntervals(movies);
      
        expect(result.min[0]).toEqual({
          producer: 'Producer B',
          interval: 5,
          previousWin: 2015,
          followingWin: 2020
        });
      
        expect(result.max[0]).toEqual({
          producer: 'Producer A',
          interval: 10,
          previousWin: 2000,
          followingWin: 2010
        });
      });
  });
});
