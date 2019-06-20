const { parse } = require('url');
const fetch = require('isomorphic-fetch');

module.exports = async (req, res) => {
  // For CORS
  if (req.method === 'OPTIONS') return res.json('ok');

  const { vat } = req.query;
  
  if (vat && vat.length > 10) {
    // remove spaces and other weird chars
    const vatNr = vat.replace(/[. ,:-]+/g, '');
    try {
      const response = await fetch(
        `https://controleerbtwnummer.eu/api/validate/${vat}.json`
      );
      res.json(await response.json());
    } catch (error) {
      res.status(500);
      res.json('Service offline.');
    }
  } else {
    res.json({ valid: false });
  }
};
