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
    //subtitleUrl: `${BASE}/en/subtitles/${item.id}`,
    filePage: `${BASE}/en/search/sublanguageid-${LANGS}/imdbid-${item.pic}`
  }));
}

async function getSubtitleDetails(subtitleId) {
  const fileId = await getFileIdFromSubtitlePage(subtitleId);
  return {
    subtitleId,
    subtitleUrl: `${BASE}/en/subtitles/${subtitleId}`,
    downloadUrl: `${BASE}/en/download/sub/${subtitleId}`,
    directFile: getDownloadLink(fileId) ?? null // needs page scrape, skipped on purpose
  };
}

function getDownloadLink(fileId) {
  return `https://dl.opensubtitles.org/en/download/file/${fileId}`;
}

async function getFileIdFromSubtitlePage(subtitleId) {
  const url = `${BASE}/en/search/sublanguageid-${LANGS}/imdbid-${subtitleId}`;
  try {
    const { data: html } = await axios.get(url, {
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 TestBot' // evitas bloqueos por bots
      }
    });

    const $ = cheerio.load(html);
    const match = html.match(/\/file\/(\d{7,10})/);
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
