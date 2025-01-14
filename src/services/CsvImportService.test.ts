import { CsvImportService } from './CsvImportService';

describe('CsvImportService', () => {
  describe('parseCsv', () => {
    it('should parse a valid CSV string with multiple rows correctly', async () => {
        const csvContent = `year;title;studios;producers;winner
      1980;Movie A;Studio X;Producer 1;yes
      1981;Movie B;Studio Y;Producer 2;no
      1982;Movie C;Studio Z;Producer 3;yes`;
      
        const result = await CsvImportService.parseCsv(csvContent);
      
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
          year: 1980,
          title: 'Movie A',
          studios: 'Studio X',
          producers: 'Producer 1',
          winner: true
        });
        expect(result[1]).toEqual({
          year: 1981,
          title: 'Movie B',
          studios: 'Studio Y',
          producers: 'Producer 2',
          winner: false
        });
        expect(result[2]).toEqual({
          year: 1982,
          title: 'Movie C',
          studios: 'Studio Z',
          producers: 'Producer 3',
          winner: true
        });
      });
  });
});
