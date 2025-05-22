const getSubtitleDetails = async (subtitleId) => {
  const url = `https://www.opensubtitles.org/en/subtitles/${subtitleId}`;
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const languageLink = $('a[title*="All subtitles for this movie in this language"]').first();
  const language = languageLink.attr('title')?.match(/- (.*?) \(/)?.[1] || null;

  const filename = $('#commenttext_' + subtitleId).text().trim() || null;

  let release = null;
  if (filename) {
    const lowered = filename.toLowerCase();
    if (lowered.includes('webrip')) release = 'WEBRip';
    else if (lowered.includes('bluray')) release = 'BluRay';
    else if (lowered.includes('hdrip')) release = 'HDRip';
    else if (lowered.includes('dvdrip')) release = 'DVDRip';
  }

  const downloadMatch = html.match(/\/en\/download\/file\/(\d+)/);
  const downloadUrl = downloadMatch ? `https://dl.opensubtitles.org/en/download/file/${downloadMatch[1]}` : null;

  let nfo = null;
  const nfoMatch = html.match(/\/en\/nfo\/(\d+)/);
  if (nfoMatch) {
    const nfoId = nfoMatch[1];
    const nfoUrl = `https://www.opensubtitles.org/en/nfo/${nfoId}`;
    try {
      const { data: nfoHtml } = await axios.get(nfoUrl);
      const _$ = cheerio.load(nfoHtml);
      nfo = _$('.nfo pre').text().trim() || null;
    } catch {
      // nfo not found or error
    }
  }

  return {
    subtitleId,
    subtitleUrl: url,
    downloadUrl,
    language,
    ...(filename && { filename }),
    ...(release && { release }),
    ...(nfo && { nfo })
  };
};
