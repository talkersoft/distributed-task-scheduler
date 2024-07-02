// Copyright Talkersoft LLC
// /backend/task-scheduler-api/src/index.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import router from "./routes";
import { setupSwagger } from "./swagger";
import { AppDataSource } from 'task-entities';
import dotenv from 'dotenv';

dotenv.config();

const getCurrentTimestamp = () => new Date().toISOString();

console.log(`Starting server at ${getCurrentTimestamp()}`);

const app = express();
const PORT = process.env.PORT || 5001;
const CORS_URLS = process.env.CORS_URLS ? process.env.CORS_URLS.split(',') : ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (CORS_URLS.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

setupSwagger(app);

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

async function initializeApp(retries = 0) {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger UI available at ${process.env.BASE_URL}/api-docs`);
        });
    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.log(`Error initializing app, retrying in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeApp(retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Failed to initialize app after maximum retries:', error);
        }
    }
}

initializeApp();
