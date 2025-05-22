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
