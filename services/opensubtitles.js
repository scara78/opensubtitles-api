const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.opensubtitles.org';

async function searchSubtitles(imdbid) {
  const lang = 'spn,spl';
  const url = `${BASE_URL}/en/search/sublanguageid-${lang}/imdbid-${imdbid}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const subtitles = [];

  $('a.bnone').each((_, el) => {
    const subtitleUrl = $(el).attr('href');
    const idMatch = subtitleUrl.match(/\/subtitles\/(\d+)\//);
    const subtitleId = idMatch ? idMatch[1] : null;
    const filename = $(el).text().trim();
    const lang = $(el).closest('tr').find('td:nth-child(6)').text().trim();

    if (subtitleId) {
      subtitles.push({
        subtitleId,
        subtitleUrl: `${BASE_URL}${subtitleUrl}`,
        language: lang,
        filename,
        downloadUrl: `${BASE_URL}/en/download/sub/${subtitleId}`,
      });
    }
  });

  return subtitles;
}

async function getSubtitleDetails(id) {
  const url = `${BASE_URL}/en/subtitles/${id}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const downloadMatch = response.data.match(/href="(\/en\/download\/file\/\d+)"/);
  const downloadUrl = downloadMatch ? `${BASE_URL}${downloadMatch[1]}` : null;

  const filename = $('title').text().split('subtitles - ')[1]?.split(' -')[0]?.trim() || 'Unknown';
  const language = $('a[href*="sublanguageid"]').first().text().trim() || 'Unknown';

  return {
    subtitleId: id,
    subtitleUrl: url,
    downloadUrl,
    filename,
    language
  };
}

module.exports = {
  searchSubtitles,
  getSubtitleDetails
};
