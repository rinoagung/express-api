const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const multer = require('multer');

// multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.post('/', upload.single('image'), notesController.createNote);
router.put('/:id', upload.single('image'), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
