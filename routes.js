const express = require('express');
const router = express.Router();
const {
  searchSubtitles,
  getSubtitleDetails,
  getDownloadLink
} = require('./opensubtitles');

// Buscar subtítulos por IMDb ID
router.get('/api/search/:imdbid', async (req, res) => {
  try {
    const data = await searchSubtitles(req.params.imdbid);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subtitles.' });
  }
});

// Obtener info de un subtitleId
router.get('/api/subtitle/:subtitleId', (req, res) => {
  const data = getSubtitleDetails(req.params.subtitleId);
  res.json(data);
});

// Link directo al archivo .srt
router.get('/api/file/:fileId', (req, res) => {
  const url = getDownloadLink(req.params.fileId);
  res.redirect(url);
});

module.exports = router;
