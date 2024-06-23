import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Scheduler API',
            version: '1.0.0',
            description: 'API documentation for the Task Scheduler application',
        },
        servers: [
            {
                url: baseUrl,
                description: 'Local server'
            }
        ]
    },
    apis: ['./src/routes.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
