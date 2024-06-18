import { AppDataSource } from 'task-scheduler-entities';

async function checkScalingNeeded() {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
        await queryRunner.connect();

        // Get the number of instances from the configuration table
        const configResult = await queryRunner.query(`SELECT value FROM configuration WHERE key = 'number_of_instances'`);
        const numberOfInstances = configResult.length > 0 ? parseInt(configResult[0].value, 10) : 1;

        const query = `
            WITH required_executions AS (
                SELECT 
                    task_type,
                    task_count,
                    avg_elapsed_time,
                    (task_count * avg_elapsed_time) AS total_required_time
                FROM 
                    tasks_to_execute
            ),
            scaling_check AS (
                SELECT 
                    task_type,
                    task_count,
                    avg_elapsed_time,
                    total_required_time,
                    CASE 
                        WHEN total_required_time > ((3600000 / ${numberOfInstances}) - (task_count * 10000)) THEN 'Scale Required'
                        ELSE 'No Scale Required'
                    END AS scaling_needed
                FROM 
                    required_executions
            )
            SELECT 
                *
            FROM 
                scaling_check;
        `;
        
        const result = await queryRunner.query(query);
        result.forEach((row: { scaling_needed: string; task_type: any; }) => {
            if (row.scaling_needed === 'Scale Required') {
                console.warn(`Scaling required for task type: ${row.task_type}`);
            } else {
                console.log(`No scaling required for task type: ${row.task_type}`);
            }
        });
    } catch (err) {
        console.error('Error in checkScalingNeeded:', err);
    } finally {
        await queryRunner.release();
    }
}

export { checkScalingNeeded };
