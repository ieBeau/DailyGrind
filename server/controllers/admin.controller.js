import { generateToken, verifyToken } from '../utils/jwt.js'
import { configServer } from '../config/config.js';

import AdminSchema from '../models/admin.model.js';

const COOKIE = 't';

export const createAccount = async (req, res) => {
    try {
        const { email, username, password } = req.body || {};
        if (!email || !username || !password) return res.status(400).json({ message: 'Email, username, and password required' });

        const admin = await AdminSchema.save(email, username, password);

        if (!admin.success) return res.status(401).json({ message: admin.message });

        const user = admin.user;

        res.status(200).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

        const admin = await AdminSchema.findByUsername(username);

        if (!admin) return res.status(401).json({ message: 'User not found' });
        if (!(await admin.authenticate(password))) return res.status(401).json({ message: 'Invalid credentials' });
        
        try { await admin.updateLastLogin(); } catch (e) { console.error('Failed to update last_login', e); }

        const token = generateToken(admin.ADMIN_ID);

        const cookieOptions = {
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour to match JWT expiration
            httpOnly: true,
            secure: configServer.env === 'production',
            sameSite: configServer.env === 'production' ? 'none' : 'lax',
        };

        res.cookie(COOKIE, token, cookieOptions);

        res.status(200).json({
            message: "Signed in successfully",
            token,
            admin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie(COOKIE);
        res.status(200).json({ message: 'Signed out' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const validate = async (req, res) => {
    try {
        const adminId = req.cookies && req.cookies[cookieName];
        if (!adminId) return res.status(401).json({ message: 'Not authenticated' });

        const admin = await AdminSchema.findById(adminId);
        if (!admin) return res.status(401).json({ message: 'Invalid session' });

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
