const runQuery = require('../config/db');

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
        const image = req.file ? `/uploads/${req.file.filename}` : null;

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

        const oldNote = await runQuery('SELECT * FROM notes WHERE id = $1', [id]);
        if (oldNote.rows.length === 0) return res.status(404).json({ message: 'Note not found' });

        const image = req.file ? `/uploads/${req.file.filename}` : oldNote.rows[0].image;

        const result = await runQuery(
            `UPDATE notes SET title = $1, content = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
            [title || oldNote.rows[0].title, content || oldNote.rows[0].content, image, id]
        );

        res.json({ success: true, message: "Data berhasil diupdate", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await runQuery('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });

        res.json({ success: true, message: "Data berhasil dihapus", deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
