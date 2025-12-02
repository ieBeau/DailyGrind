import jwt from 'jsonwebtoken';

import { configServer } from '../config/config.js'

const generateToken = (id) => {
    return jwt.sign({ _id: id }, configServer.jwtSecret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, configServer.jwtSecret);
    } catch (err) {
        return null;
    }
};

export { generateToken, verifyToken };