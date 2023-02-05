const multer = require('multer');

// indique le type de fichier image car on n'a pas accès à son extention
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // objet représentant la procédure de stockage
	destination: (req, file, callback) => { callback(null, 'images'); },
	filename: (req, file, callback) => { // le nom que portera le fichier une fois savegardé
		const name = file.originalname.split(' ').join('_'); // on remplace les espaces par des _
		const extension = MIME_TYPES[file.mimetype];  // on 'index' le dictionnaire avec le mimetype
		callback(null, name + Date.now() + '.' + extension); // on compose le nom final du fichier
	}
});

module.exports = multer({storage: storage}).single('image');