import axios from 'axios';


export async function searchReddit(query) {
  try {
    // 1. Get Reddit Access Token using Client Credentials
    const tokenRes = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const token = tokenRes.data.access_token;

    // 2. Make authenticated search request to Reddit
    const res = await axios.get(
      `https://oauth.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'restobot-chat-app/1.0',
        },
      }
    );

    const posts = res.data.data.children || [];
    return posts.map(post => `- ${post.data.title}`).join('\n');
  } catch (err) {
    console.error("🔴 Reddit Search Failed:", err.response?.data || err.message);
    return 'No Reddit results available at this time.';
  }
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
