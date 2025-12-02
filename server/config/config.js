import 'dotenv/config';

const configServer = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'no_secret'
}

const configDB = {
    user: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    connectString: process.env.DB_CONNECTION_STRING || 'localhost/XE'
}

export { configServer, configDB }