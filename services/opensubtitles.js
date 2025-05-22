const axios = require('axios');
const cheerio = require('cheerio');

const getSuggestions = async (query) => {
  const url = `https://www.opensubtitles.org/libs/suggest.php?format=json3&MovieName=${encodeURIComponent(query)}&SubLanguageID=spn,spl`;
  const res = await axios.get(url);
  return res.data;
};

const getSubtitlesByImdb = async (imdbid) => {
  const searchUrl = `https://www.opensubtitles.org/en/search/sublanguageid-spn,spl/imdbid-${imdbid}`;
  const { data: html } = await axios.get(searchUrl);
  const $ = cheerio.load(html);

  const results = [];

  $('a.bnone').each((i, el) => {
    const href = $(el).attr('href');
    if (!href.includes('/en/subtitles/')) return;

    const subtitleId = href.split('/')[3];
    const subtitleUrl = `https://www.opensubtitles.org${href}`;
    const downloadIdMatch = $(el).closest('tr').find('a[href*="/download/file/"]').attr('href');
    const downloadUrl = downloadIdMatch
      ? `https://dl.opensubtitles.org${downloadIdMatch}`
      : null;

    results.push({
      subtitleId,
      subtitleUrl,
      downloadUrl,
    });
  });

  return results;
};

module.exports = {
  getSuggestions,
  getSubtitlesByImdb,
};

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
