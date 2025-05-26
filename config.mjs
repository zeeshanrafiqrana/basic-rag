import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const env = process.env;

const ENV = {
    port: env.PORT || 5000,
    database: {
        host: env.HOST,
        name: env.DATABASE,
        dbPort: env.DB_PORT,
        user: env.DB_USER,
        password: env.PASSWORD,
        dialect: env.DIALECT
    },
    jwt_secret: env.JWT_SECRET
};

export default ENV;