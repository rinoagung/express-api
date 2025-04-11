const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const multer = require('multer');

// multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/notes/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG and PNG allowed'), false);
        }
        cb(null, true);
    }
});

// Routes
router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.post('/', upload.single('image'), notesController.createNote);
router.put('/:id', upload.single('image'), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.get('/uploads/:filename', notesController.getImage);
router.delete('/delete/:filename', notesController.deleteImage);

module.exports = router;
