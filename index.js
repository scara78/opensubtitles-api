const express = require('express');
const cors = require('cors');
const subtitlesRouter = require('./routes/subtitles');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', subtitlesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});
