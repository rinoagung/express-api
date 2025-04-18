const runQuery = require('../config/db');

exports.createData = async (req, res) => {
    const { name, age, job_title, company } = req.body;
    if (!name || !age || !job_title || !company) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        const query = "INSERT INTO data_diri (name, age, job_title, company) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [name, age, job_title, company];
        const result = await runQuery(query, values);
        res.status(201).send({ success: true, message: "Data berhasil ditambahkan", data: result.rows[0] });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send({ error: "Failed to create data" });
    }
};

exports.getAllData = async (req, res) => {
    try {
        const result = await runQuery("SELECT * FROM data_diri");
        res.status(200).send({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ error: "Failed to fetch data" });
    }
};

exports.getDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await runQuery("SELECT name, age, job_title, company FROM data_diri WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send({ error: "Data tidak ditemukan" });
        res.status(200).send({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error fetching data by ID:", error);
        res.status(500).send({ error: "Failed to fetch data" });
    }
};

exports.updateData = async (req, res) => {
    const { id } = req.params;
    const { name, age, job_title, company } = req.body;
    if (!name || !age || !job_title || !company) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        const query = "UPDATE data_diri SET name = $1, age = $2, job_title = $3, company = $4 WHERE id = $5 RETURNING *";
        const values = [name, age, job_title, company, id];
        const result = await runQuery(query, values);
        if (result.rows.length === 0) return res.status(404).send({ error: "Data tidak ditemukan" });
        res.status(200).send({ success: true, message: "Data berhasil diupdate", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send({ error: "Failed to update data" });
    }
};

exports.deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await runQuery("DELETE FROM data_diri WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).send({ error: "Data tidak ditemukan" });
        res.status(200).send({ success: true, message: "Data berhasil dihapus", deleted: result.rows[0] });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).send({ error: "Failed to delete data" });
    }
};
