const DEFAULT_ALLOW_METHODS = [
  "POST",
  "GET",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS"
];

const DEFAULT_ALLOW_HEADERS = [
  "X-Requested-With",
  "Access-Control-Allow-Origin",
  "X-HTTP-Method-Override",
  "Content-Type",
  "Authorization",
  "Accept"
];

const cors = (options = {}) => handler => (req, res, ...restArgs) => {
  const {
    origin = "*",
    allowMethods = DEFAULT_ALLOW_METHODS,
    allowHeaders = DEFAULT_ALLOW_HEADERS,
    allowCredentials = true,
    exposeHeaders = []
  } = options;

  res.setHeader("Access-Control-Allow-Origin", origin);
  if (allowCredentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (exposeHeaders.length) {
    res.setHeader("Access-Control-Expose-Headers", exposeHeaders.join(","));
  }

  // Any OPTIONS requests should be replied to directly from the edge.
  const preFlight = req.method === "OPTIONS";
  if (preFlight) {
    res.setHeader("Access-Control-Allow-Methods", allowMethods.join(","));
    res.setHeader("Access-Control-Allow-Headers", allowHeaders.join(","));
    res.setHeader("Access-Control-Max-Age", String(1728000));
    res.status(204);
    return res.json("ok");
  }

  return handler(req, res, ...restArgs);
};

module.exports = cors;
