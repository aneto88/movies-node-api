import { z } from 'zod';

export const MovieSchema = z.object({
    year: z.number(),
    title: z.string(),
    studios: z.string(),
    producers: z.string(),
    winner: z.boolean()
});

export type MovieType = z.infer<typeof MovieSchema>;