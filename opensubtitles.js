const axios = require('axios');
const cheerio = require('cheerio');

const API_URL = 'https://www.opensubtitles.org/libs/suggest.php';
const LANGS = 'spn,spl';
const BASE = 'https://www.opensubtitles.org';

async function searchSubtitles(imdbid) {
  const url = `${API_URL}?format=json3&MovieName=${imdbid}&SubLanguageID=${LANGS}`;
  const { data } = await axios.get(url);

  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map(item => ({
    title: item.name,
    year: item.year,
    total: item.total,
    subtitleId: item.id,
    imdbid: `tt${item.pic}`,
    language: LANGS,
    subtitleUrl: `${BASE}/en/subtitles/${item.id}`,
    filePage: `${BASE}/en/search/sublanguageid-${LANGS}/imdbid-${item.pic}`
  }));
}

function getSubtitleDetails(subtitleId) {
  return {
    subtitleId,
    subtitleUrl: `${BASE}/en/subtitles/${subtitleId}`,
    downloadUrl: `${BASE}/en/download/sub/${subtitleId}`,
    directFile: null // needs page scrape, skipped on purpose
  };
}

function getDownloadLink(fileId) {
  return `https://dl.opensubtitles.org/en/download/file/${fileId}`;
}

async function getFileIdFromSubtitlePage(subtitleId) {
  const url = `https://www.opensubtitles.org/en/subtitles/${subtitleId}`;
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0' // evitas bloqueos por bots
      }
    });

    const $ = cheerio.load(html);
    const downloadLink = $('a[href*="/en/download/file/"]').attr('href');

    if (!downloadLink) return null;

    const match = downloadLink.match(/file\/(\d+)/);
    return match ? match[1] : null;

  } catch (err) {
    console.error(`❌ Error fetching fileId for subtitle ${subtitleId}:`, err.message);
    return null;
  }
}

module.exports = {
  searchSubtitles,
  getSubtitleDetails,
  getDownloadLink,
  getFileIdFromSubtitlePage
};
