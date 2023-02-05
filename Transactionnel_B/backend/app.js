/*
� l'exception de quelques modifications mineures, le code de ce fichier provient enti�rement
du cours openclassrooms, intitul�: "Passez au Full Stack avec Node.js, Express et MongoDB"
Lien: https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb
*/

const express     = require('express');
const mongoose    = require('mongoose');
const bodyParser  = require('body-parser');  // au cas o� on utilise body parser
const dotenv      = require('dotenv').config();
const stuffRoutes = require('./routes/stuff');
const userRoutes  = require('./routes/user');
const path        = require('path');  // pour multer afin d'acc�der au r�pertoires

const username = process.env.MONGODB_USERNAME; // Voir note plus bas
const password = process.env.MONGODB_PASSWORD;
// Note: si la variable de l'usager est simplement USERNAME, cela entre en conflit avec
// la variable du syst�me du m�me nom.

const app = express();
app.use(express.json());

mongoose.connect( // voici la cha�ne de connexion � la base de donn�es h�b�rg�e sur Atlas:
`mongodb+srv://${username}:${password}@cluster0.jt1d1.mongodb.net/project0?retryWrites=true&w=majority`,
	{
    useNewUrlParser: true,
    useUnifiedTopology: true
	})
	.then(() => console.log('Connexion � MongoDB de Linus r�ussie !'))
	.catch(() => console.log('Connexion � MongoDB �chou�e !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//app.use(bodyParser.json());  // nouveau ajout
app.use('/api/stuff', stuffRoutes); // nouveau ajout
app.use('/api/auth', userRoutes);  // nouveau ajout
app.use('/images', express.static(path.join(__dirname, 'images')));  // nouveau ajout pour multer

module.exports = app;