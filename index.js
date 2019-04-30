const { parse } = require('url');
const fetch = require('isomorphic-fetch');

module.exports = async (req, res) => {
  // For CORS
  if (req.method === 'OPTIONS') {
    return res.end('ok');
  }
  const { query } = parse(req.url, true);
  const { vat } = query;
  if (vat && vat.length > 10) {
    // remove spaces and other weird chars
    const vatNr = vat.replace(/[. ,:-]+/g, '');
    const response = await fetch(
      `https://controleerbtwnummer.eu/api/validate/${vat}.json`
    );
    res.end(JSON.stringify(await response.json()));
  } else {
    res.end(JSON.stringify({ valid: false }));
  }
};
