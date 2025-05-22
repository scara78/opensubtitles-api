const express = require('express');
const cors = require('cors');
const openSubService = require('./services/opensubtitles');

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(cors());

app.get('/api/suggest', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query param' });

  try {
    const suggestions = await openSubService.getSuggestions(query);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.get('/api/subtitles', async (req, res) => {
  const { imdbid } = req.query;
  if (!imdbid) return res.status(400).json({ error: 'Missing imdbid param' });

  try {
    const results = await openSubService.getSubtitlesByImdb(imdbid);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subtitles' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
