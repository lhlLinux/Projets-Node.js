
const express   = require('express');
const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer-config');
const inventory = require('../controllers/stuff');

const router = express.Router();  // on démarre le routeur

router.get('/', auth, inventory.viewCatalog);
router.post('/', auth, multer, inventory.addProduct);
router.get('/:id', auth, inventory.viewProduct);
router.put('/:id', auth, multer, inventory.updateProduct);
router.delete('/:id', auth, inventory.deleteProduct);

module.exports = router;