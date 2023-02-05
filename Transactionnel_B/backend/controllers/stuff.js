const Thing = require('../models/thing');
const fs = require('fs');

exports.addProduct = (req, res, next) => {
	
	const thingObject = JSON.parse(req.body.thing);
	delete thingObject._id;
	delete thingObject._userId;
	
	// Le probl�me est ici: req.auth.userId est non d�fini
	console.log("req.auth.userId", req.auth.userId);
	
	const thing = new Thing({
	   ...thingObject,
	   userId: req.auth.userId,
	   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	
	thing.save()
	.then(() => { res.status(201).json({ message: 'Objet enregistr�!'}) })
	.catch(error => { res.status(400).json( { error }) })
}

/*
exports.addProduct = (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({ ...req.body });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistr� !'}))
    .catch(error => res.status(400).json({ error })); // 'shorthand' de {"error" : error}
}
*/

exports.viewProduct = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}

exports.updateProduct = (req, res, next) => {
	const thingObject = req.file ? { // si la requ�te comporte un fichier
	   ...JSON.parse(req.body.thing),
	   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body }; // si la requ�te ne comporte pas de fichier

	delete thingObject._userId;
	Thing.findOne({_id: req.params.id})
       .then((thing) => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Produit modifi�!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => { res.status(400).json({ error }); });
}

/*
exports.updateProduct = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifi� !'}))
    .catch(error => res.status(400).json({ error }));
}
*/

exports.deleteProduct = (req, res, next) => {
   Thing.findOne({ _id: req.params.id})
       .then(thing => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = thing.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Thing.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprim� !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

/*
exports.deleteProduct = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprim� !'}))
    .catch(error => res.status(400).json({ error }));
}
*/

exports.viewCatalog = (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}