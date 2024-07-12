
import {pool} from '../db.js'
import bcrypt from 'bcrypt';

import { generateAccessTokien } from './settings/keys.js';


export const getLogin = async (req,res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM login')
        res.json(rows)

    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }
    
}

export const getLoginByEmail = async (req,res) => {
    try{
        console.log([req.params.email])
        const [rows] = await pool.query('SELECT * FROM login WHERE email = ?', [req.params.email])
        if (rows.length <= 0 ) return res.status(404).json({
            message:'no se encontro envio'
        })
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }   
}


export const postLoginByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received login request:', { email, password });
        
        const [rows] = await pool.query('SELECT * FROM login WHERE email = ?', [email]);
        console.log('Database query result:', rows);
        
        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        
        const user = rows[0];
        console.log('User found:', user);
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isPasswordMatch);
        
        if (isPasswordMatch) {
            const userPayload = { id: user.idUser_fk, email: user.email };
            const token = generateAccessTokien(userPayload);
            console.log('Generated token:', token);
            
            res.cookie('userId', user.idUser_fk);
            res.cookie('accessToken', token); // Corrected syntax
            
            return res.json({ user, token });
        } if (rows[0].password === password) {
            const userPayload = { id: user.idUser_fk, email: user.email };
            const token = generateAccessTokien(userPayload);
            console.log('Generated token:', token);
            
            res.cookie('userId', user.idUser_fk, { httpOnly: true, sameSite: 'Lax' });
            res.cookie('accessToken', token, { httpOnly: true, sameSite: 'Lax' });
            return res.json({ user, token });
        } else {
            if (user.password === password) {
                const userPayload = { id: user.idUser_fk, email: user.email };
                const token = generateAccessTokien(userPayload);
                console.log('Generated token:', token);
                
                res.cookie('userId', user.idUser_fk);
                res.cookie('accessToken', token); // Corrected syntax
                
                return res.json({ user, token });
            }
            else{
                res.status(401).json({
                    message: 'Contraseña incorrecta'
                });
            }
        }
    } catch (error) {
        console.error('Error in login process:', error);
        return res.status(500).json({
            message: 'ERROR: algo salió mal',
            error: error.message
        });
    }
};