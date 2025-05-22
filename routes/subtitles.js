const express = require('express');
const router = express.Router();
const { searchSubtitles, getSubtitleDetails } = require('../services/opensubtitles');

router.get('/subtitles/:imdbid', async (req, res) => {
  const { imdbid } = req.params;
  try {
    const results = await searchSubtitles(imdbid);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar subtítulos' });
  }
});

router.get('/subtitle/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getSubtitleDetails(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener subtítulo' });
  }
});

module.exports = router;
