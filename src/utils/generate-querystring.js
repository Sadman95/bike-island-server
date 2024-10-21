
/**
 * @summary Query string generator from request query
 * @param {Object} query
 * @returns {string}
 * */
const generateQueryString = (query) => {
  return Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key])}`)
    .join('&');
}
module.exports = generateQueryString