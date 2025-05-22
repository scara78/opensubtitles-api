router.get('/api/subtitle/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subtitle = await getSubtitleDetails(id);
    res.json(subtitle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subtitle details.' });
  }
});
