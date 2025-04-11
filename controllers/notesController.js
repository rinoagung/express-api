const runQuery = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getAllNotes = async (req, res) => {
    try {
        const result = await runQuery('SELECT * FROM notes ORDER BY updated_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await runQuery('SELECT * FROM notes WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Judul dan isi catatan tidak boleh kosong'
            });
        }

        const image = req.file ? `${req.file.filename}` : null;

        const result = await runQuery(
            `INSERT INTO notes (title, content, image) VALUES ($1, $2, $3) RETURNING *`,
            [title, content, image]
        );

        res.status(201).json({ success: true, message: "Data berhasil ditambahkan", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Judul dan isi catatan tidak boleh kosong'
            });
        }
        let newImageName = null;

        const oldNote = await runQuery('SELECT * FROM notes WHERE id = $1', [id]);
        if (oldNote.rows.length === 0) return res.status(404).json({ message: 'Note not found' });

        // Jika ada file gambar baru dikirimkan
        if (req.file) {
            const filePath = path.join(__dirname, '..\\uploads\\notes', oldNote.rows[0].image);
            const oldImagePath = oldNote.rows[0].image ? filePath : null;

            // Hapus gambar lama (jika ada)
            if (oldImagePath && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Simpan path gambar baru
            newImageName = req.file.filename;
        }

        const result = await runQuery(
            `UPDATE notes SET title = $1, content = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
            [title || oldNote.rows[0].title, content || oldNote.rows[0].content, newImageName, id]
        );

        res.json({ success: true, message: "Data berhasil diupdate", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const select = await runQuery('SELECT * FROM notes WHERE id = $1', [id]);
        if (select.rows.length === 0) return res.status(404).json({ message: 'Note not found' });

        const note = select.rows[0];

        const result = await runQuery('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);

        // Hapus file gambar jika ada
        if (note.image) {
            const imagePath = path.join(__dirname, '..', 'uploads\\notes\\', path.basename(note.image));
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Gagal menghapus gambar:', err.message);
            });
        }

        res.json({ success: true, message: 'Data berhasil dihapus', deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getImage = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..\\uploads\\notes', req.params.filename);
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteImage = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..\\uploads\\notes', req.params.filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(404).json({ success: false, message: 'File tidak ditemukan atau gagal dihapus' });
            }
            res.json({ success: true, message: 'Gambar berhasil dihapus' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
