import { AppDataSource } from 'task-entities';
import { setupRabbitMQ } from './rabbitmq';
import { distributeTasks, DistributorConfig } from './distributor';

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

const defaultConfig: DistributorConfig = {
  throttleInterval: parseInt(process.env.THROTTLE_INTERVAL || '500', 10),
};

async function initializeDistributor(config: DistributorConfig, retries = 0) {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    await setupRabbitMQ();
    setInterval(() => distributeTasks(config), config.throttleInterval);
  } catch (err) {
    if (retries < MAX_RETRIES) {
      setTimeout(() => initializeDistributor(config, retries + 1), RETRY_INTERVAL);
    } else {
      console.error('Error during Data Source initialization after maximum retries:', err);
    }
  }
}

export { initializeDistributor, defaultConfig };
