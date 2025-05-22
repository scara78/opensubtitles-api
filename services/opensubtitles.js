const getSubtitlesByImdb = async (imdbid) => {
  const searchUrl = `https://www.opensubtitles.org/en/search/sublanguageid-spn,spl/imdbid-${imdbid}`;
  const { data: html } = await axios.get(searchUrl);
  const $ = cheerio.load(html);

  const results = [];

  $('table#search_results tr').each((i, row) => {
    const subtitleLink = $(row).find('a.bnone[href*="/en/subtitles/"]');
    const downloadLink = $(row).find('a[href*="/en/download/file/"]');
    const languageCell = $(row).find('td.language');
    const commentCell = $(row).find('td[colspan="2"] i'); // a veces está ahí el release o filename

    if (!subtitleLink.length) return;

    const href = subtitleLink.attr('href');
    const subtitleId = href.split('/')[3];
    const subtitleUrl = `https://www.opensubtitles.org${href}`;

    const downloadHref = downloadLink.attr('href');
    const downloadUrl = downloadHref ? `https://dl.opensubtitles.org${downloadHref}` : null;

    const language = languageCell.text().trim() || null;

    // Extract release or filename
    let filename = null;
    let release = null;
    if (commentCell.length) {
      const text = commentCell.text().trim();
      if (text) {
        filename = text;
        // Try to guess release type (basic heuristic)
        const lowered = text.toLowerCase();
        if (lowered.includes('webrip')) release = 'WEBRip';
        else if (lowered.includes('bluray')) release = 'BluRay';
        else if (lowered.includes('hdrip')) release = 'HDRip';
        else if (lowered.includes('dvdrip')) release = 'DVDRip';
      }
    }

    results.push({
      subtitleId,
      subtitleUrl,
      downloadUrl,
      language,
      ...(filename && { filename }),
      ...(release && { release })
    });
  });

  return results;
};
