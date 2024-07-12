import { pool } from '../db.js';
import { generateAccessTokien } from './settings/keys.js';

export const postDashboardByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received login request:', { email, password });
        
        const [rows] = await pool.query('SELECT * FROM login WHERE email = ?', [email]);
        console.log('Database query result:', rows);
        
        if (rows.length <= 0) {
            return res.redirect('http://localhost:4200?error=Usuario incorrecto');
        }
        
        const user = rows[0];
        console.log('User found:', user);
        
        if (user.password === password && user.email === 'admin@example.com') {
            const userPayload = { id: user.idUser_fk, email: user.email };
            const token = generateAccessTokien(userPayload);
            console.log('Generated token:', token);
            
            res.cookie('userId', user.idUser_fk);
            res.cookie('accessToken', token);
            
            return res.redirect('http://localhost:4200/dashboard');
        } else {
            return res.redirect('http://localhost:4200?error=Usuario incorrecto');
        }
    } catch (error) {
        console.error('Error in login process:', error);
        return res.status(500).json({
            message: 'ERROR: algo salió mal',
            error: error.message
        });
    }
};
