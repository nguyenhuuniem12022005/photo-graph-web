/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
const API_BASE = (process.env.REACT_APP_API_URL || "https://5c9vk6-5000.csb.app").replace(/\/$/, "");

async function fetchModel(url) {
  const path = url.startsWith("/") ? url : `/${url}`;
  const response = await fetch(`${API_BASE}${path}`);

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    if (text.trimStart().startsWith("<")) {
      const hint =
        API_BASE
          ? "Check REACT_APP_API_URL points to your API (not the React app)."
          : "Set REACT_APP_API_URL in CodeSandbox (Env) to your backend URL, e.g. https://xxxx-5000.csb.app — then restart dev server.";
      throw new Error(`Got HTML instead of JSON. ${hint}`);
    }
    throw new Error("Invalid JSON from server.");
  }
}

export default fetchModel;
