import { Sequelize } from 'sequelize';
import ENV from '../../config.mjs';

const sequelize = new Sequelize(
    ENV.database.name,
    ENV.database.user,
    ENV.database.password,
    {
        host: ENV.database.host,
        dialect: ENV.database.dialect,
        port: ENV.database.dbPort,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connection established successfully.');
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
