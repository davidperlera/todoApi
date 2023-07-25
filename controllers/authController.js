const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    try{

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if(!user) {
            return res.status(400).json({ message: 'user not found' });
        }

        const validatePassword = bcrypt.compareSync(password, user.password);

        if(!validatePassword){
            return res.status(401),json({ message: 'User or paswword incorrect'});
        }

        const token = jwt.sign({ userID: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30d'});

        return res.status(200).json({ message: 'Login success', token, username });

    } catch(error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en la autenticación', error });
    }
};

const register = async (req, res) => {
    try{
        const { username, password, email} = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
        return res.status(400).json({ error: 'Nombre de usuario o correo electrónico ya está en uso' });
        }

        const newUser = await User.create({ username, password, email });

        return res.status(201).json({ message: 'Registro exitoso' });
        } catch(error){
            console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error en el registro. Por favor, intenta de nuevo más tarde.' });
        }
};

module.exports = {
    login,
    register,
}