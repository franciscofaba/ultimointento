import jwt from 'jsonwebtoken';


const keys = "polloasado";

export function generateAccessTokien(user) {
    return jwt.sign(user, keys, {expiresIn: '180m'});
};

export function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'];
    if (!accessToken) return res.send('access denied');
    
    jwt.verify(accessToken, keys, (err, user) => {
        if (err) {
            return res.send('access denied');
        } else {
            req.user = user; // Adjunta el usuario verificado a la solicitud
            next();
        }
    });
};