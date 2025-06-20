import axios from 'axios';

// Simple Reddit search using public API
export async function searchReddit(query) {
  const res = await axios.get(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}`);
  const posts = res.data.data.children;

  return posts.slice(0, 3).map(post => `- ${post.data.title}`).join('\n');
}

// Example Web Search using SerpAPI
export async function webSearch(query) {
  const res = await axios.get(`https://serpapi.com/search`, {
    params: {
      q: query,
      api_key: process.env.SERP_API_KEY,
    }
  });

  const results = res.data.organic_results || [];
  return results.slice(0, 3).map(r => `- ${r.title}: ${r.snippet}`).join('\n');
}
