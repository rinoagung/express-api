const express = require("express");
const limiter = require('./middlewares/limiter');
const dataDiriRoutes = require('./routes/dataDiriRoutes');
const notesRoutes = require('./routes/notesRoutes');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/people", dataDiriRoutes);
app.use("/api/notes", notesRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di port:${port}`);
});
