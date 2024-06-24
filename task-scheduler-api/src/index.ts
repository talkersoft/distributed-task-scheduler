import "reflect-metadata";
import express from "express";
import router from "./routes";
import { setupSwagger } from "./swagger";

const getCurrentTimestamp = () => new Date().toISOString();

console.log(`Starting server at ${getCurrentTimestamp()}`);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);

setupSwagger(app);

const RETRY_INTERVAL = 2000;
const MAX_RETRIES = 10;

async function initializeApp(retries = 0) {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger UI available at ${process.env.BASE_URL}/api-docs`);
        });
    } catch (error) {
        if (retries < MAX_RETRIES) {
            console.log(`Error connecting to the database, retrying in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => initializeApp(retries + 1), RETRY_INTERVAL);
        } else {
            console.error('Failed to connect to the database after maximum retries:', error);
        }
    }
}

initializeApp();
