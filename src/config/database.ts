import { DataSource } from "typeorm";
import { Movie } from "../models/Movie";
import path from "path";
import { initializeDataFromCsv } from "./initializeData";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ":memory",
    synchronize: true,
    logging: false,
    entities: [Movie],
    subscribers: [],
    migrations: [],
});

// Função para inicializar a conexão com o banco
export async function initializeDatabase(): Promise<void>{
    try {
        await AppDataSource.initialize();
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
};