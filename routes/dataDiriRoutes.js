const express = require('express');
const router = express.Router();
const controller = require('../controllers/dataDiriController');

router.post('/', controller.createData);
router.get('/', controller.getAllData);
router.get('/:id', controller.getDataById);
router.put('/:id', controller.updateData);
router.delete('/:id', controller.deleteData);

module.exports = router;
