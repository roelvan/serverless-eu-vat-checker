const { parse } = require("url");
const fetch = require("isomorphic-unfetch");
const cors = require("./cors")();
const { handleErrors } = require("./errors");

const handler = async (req, res) => {
  const { vat } = req.query;

  if (!vat || vat.length < 10) return res.json({ valid: false });
  // remove spaces and other weird chars
  const vatNr = vat.replace(/[. ,:-]+/g, "");
  const response = await fetch(
    `https://controleerbtwnummer.eu/api/validate/${vatNr}.json`
  );

  return res.json(await response.json());
};

module.exports = handleErrors(cors(handler));
