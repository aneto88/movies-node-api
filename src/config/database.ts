import { DataSource } from "typeorm";
import { Movie } from "../models/Movie";
import path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.resolve(__dirname, "..", "..", "database.sqlite"),
    synchronize: true,
    logging: false,
    entities: [Movie],
    subscribers: [],
    migrations: [],
});

// Função para inicializar a conexão com o banco
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
};