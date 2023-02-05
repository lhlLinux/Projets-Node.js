/*
À l'exception de quelques modifications mineures, le code de ce fichier provient entièrement
du cours openclassrooms, intitulé: "Passez au Full Stack avec Node.js, Express et MongoDB"
Lien: https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb
*/

const express  = require('express');
const mongoose = require('mongoose');
const Thing    = require('./models/thing');
const dotenv   = require('dotenv').config();

const username = process.env.MONGODB_USERNAME; // Voir note plus bas
const password = process.env.MONGODB_PASSWORD;
// Note: si la variable de l'usager est simplement USERNAME, cela entre en conflit avec
// la variable du système du même nom.

const app = express();

app.use(express.json());

mongoose.connect(
`mongodb+srv://${username}:${password}@cluster0.jt1d1.mongodb.net/project0?retryWrites=true&w=majority`,
	{
    useNewUrlParser: true,
    useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB de Linus réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Pour l'ajout d'un produit à l'inventaire
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body // automatically expands contents of body 
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error })); // 'shorthand' de {"error" : error}
});

// pour la consultation d'un produit
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

// pour la mise à jour d'un produit
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

// pour la suppression d'un produit
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// pour voir l'inventaire
app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;