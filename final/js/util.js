
const allowedMethods = [ 'get', 'post', 'put', 'patch', 'delete' ];

/**
 *
 * @param {string} method get | post | put | patch | delete
 * @param {string} url the url to make the request to
 * @param {Record<string, any>} data any data you want to send with the request
 * @param {Record<string, string>} headers any extra headers you want to send
 *
 * @returns parsed JSON response or the body text if it's not JSON
 * @throws Error if the request fails
 */
export const apiRequest = async (method, url, data = undefined, headers = {}) => {
  method = method.toString().toLowerCase();

  if (allowedMethods.includes(method) === false) {
    throw new Error('Invalid method');
  }

  const requestInfo = { method, headers };

  if (method === 'post' && data) {
    requestInfo.body = JSON.stringify(data);
  }

  const response = await fetch(url, requestInfo);

  if (response.ok) {
    // Return either JSON or just the body
    try {
      return await response.json();
    } catch (e) {
      return response.body;
    }
  }

  throw new Error(`Something went wrong with the request ${response.statusText}`);
}

/**
 * Converts a string to nice title case
 *
 * @param {string} str the string to convert
 * @returns {string} the converted string
 */
export const titleCase = (str) => {
  return str.toLowerCase().split(' ').map((word) => {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

/**
 * Helper to know whether we're local or live
 *
 * @returns {Boolean} whether or not we're on the github pages site
 */
export const onGithub = () => {
  return window.location.toString().includes('derrikmilligan.github.io');
}

export const isLive = onGithub();
export const isDev  = !isLive;
