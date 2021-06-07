const { parse } = require('url');
const { checkVAT, countries } = require('jsvat');
const fetch = require('isomorphic-unfetch');
const cors = require('./cors')();
const { handleErrors, ForbiddenError, NotFoundError } = require('./errors');

const handler = async (req, res) => {
  if (req.method !== 'GET') throw new ForbiddenError();

  const { vatId } = req.query;

  const { isValid, value: vatValue, country } = checkVAT(vatId, countries);
  if (!isValid) throw new NotFoundError();

  const response = await fetch(`https://controleerbtwnummer.eu/api/validate/${vatValue}.json`);
  if (response.status !== 200) {
    return res.json({
      valid: true,
      countryCode: country?.isoCode.short || 'BE',
      vatNumber: vatValue.replace('BE', ''),
    });
  }

  const data = await response.json();

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
  return res.json(data);
};

module.exports = handleErrors(cors(handler));
