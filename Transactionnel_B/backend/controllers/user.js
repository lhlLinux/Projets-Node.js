
const BCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // importe le modèle mongoose 'User qu'on a créé

exports.signup = (req, res, next) => {
	BCrypt.hash(req.body.password, 10)
    .then( hash => {
		const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé!' })) // création de l'utilisateur
        .catch(error => res.status(400).json({ error })); // le cas échéant
    })
    .catch(error => res.status(500).json({ error })); // toute autre défaillance
};

exports.login = (req, res, next) => {
   User.findOne({ email: req.body.email })
       .then( user => {
           if (!user) {
               return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           BCrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(
						{ userID: user._id },
						'RANDOM_TOKEN',
						{ expiresIn: '24h' }
                       )
                   });
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};