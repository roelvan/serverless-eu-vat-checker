import { parse } from 'url';
import { checkVAT, countries } from 'jsvat';
import fetch from 'isomorphic-unfetch';
import Cors from '@lib/cors';
import { handleErrors, ForbiddenError, NotFoundError } from '@lib/errors';

const cors = Cors();

async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

const handler = async (req, res) => {
  if (req.method !== 'GET') throw new ForbiddenError();

  const { vatId } = req.query;

  const { isValid, value: vatValue, country } = checkVAT(vatId, countries);
  if (!isValid) throw new NotFoundError();

  try {
    const response = await fetchWithTimeout(
      `https://controleerbtwnummer.eu/api/validate/${vatValue}.json`
    );
  } catch (error) {
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

export default handleErrors(cors(handler));
