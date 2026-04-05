/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
const API_BASE = process.env.REACT_APP_API_URL || "";

async function fetchModel(url) {
  const path = url.startsWith("/") ? url : `/${url}`;
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default fetchModel;
