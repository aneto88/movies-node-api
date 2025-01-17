import request from 'supertest'
import app from '../../src/app'
import { initializeDatabase } from '../../src/config/database';
import { initializeDataFromCsv } from '../../src/config/initializeData';
import { ProducerInterval } from '../../src/interfaces/movies/ProducerInterval';

describe('GET /api/movies/awards-interval', () => {
    beforeAll(async () => {
        await initializeDatabase();
    });

    beforeEach(async () => {
        await initializeDataFromCsv();
    });

    it('should return a producers awards intervals structure', async () => {
        const response = await request(app).get('/api/movies/awards-interval')

        expect(response.status).toBe(200)
        
    })

    it('should return specific structure with awards intervals', async () => {
        const response = await request(app).get('/api/movies/awards-interval');
        const minIntervalProducers = response.body.min;
        const maxIntervalProducers = response.body.max;

        const expectedResult = {
            min: [
              {
                producer: 'Joel Silver',
                interval: 1,
                previousWin: 1990,
                followingWin: 1991,
              },
            ],
            max: [
              {
                producer: 'Matthew Vaughn',
                interval: 13,
                previousWin: 2002,
                followingWin: 2015,
              },
            ],
        };

        const expectedProducerInterval: Partial<ProducerInterval> = {
            producer: expect.any(String),
            interval: expect.any(Number),
            previousWin: expect.any(Number),
            followingWin: expect.any(Number),
        };

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('min')
        expect(response.body).toHaveProperty('max')
        expect(minIntervalProducers.length).toBeGreaterThan(0)
        expect(maxIntervalProducers.length).toBeGreaterThan(0)
        expect(minIntervalProducers[0]).toEqual(expect.objectContaining(expectedProducerInterval))
        expect(maxIntervalProducers[0]).toEqual(expect.objectContaining(expectedProducerInterval))
        expect(response.body).toEqual(expectedResult)
      });
});