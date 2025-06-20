# Restobot 🤖🍽️  
**Your AI-powered restaurant finder assistant**

Restobot is a full-stack chatbot app that gives restaurant recommendations, directions, and menu suggestions using OpenAI and live web + Reddit reviews. It supports follow-up questions and blocks off-topic queries to stay focused on food.

![Restobot Banner](public/restobot-banner.png)

---

## 🚀 Features

- 💬 Conversational chatbot using OpenAI GPT-3.5
- 🌍 Web + Reddit search integration
- 🧠 Chat memory for follow-ups
- ⚠️ Off-topic query detection using GPT classifier
- 🔔 Toast notifications for warnings
- 🎨 Responsive, dark-themed UI with custom branding
- ↩️ Enter-to-send + Shift+Enter for new lines
- ⬇️ Auto-scrolls to latest message

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Node API routes (OpenAI, Reddit, SerpAPI)
- **AI**: GPT-3.5-turbo via OpenAI
- **APIs**: Reddit API, SerpAPI
- **Deployment**: Vercel

---

## ⚙️ Getting Started Locally

### ✅ 1. Clone the repository

```bash
git clone https://github.com/<your-username>/restobot.git
cd restobot
```

---

### ✅ 2. Install dependencies

```bash
npm install
```

You must have Node.js v18+ and npm installed.

---

### ✅ 3. Set up environment variables

Create a `.env.local` file in the root or rename `.env.local.example` to `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Web search via SerpAPI
SERP_API_KEY=your_serpapi_key

# Reddit API credentials
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_SECRET=your_reddit_secret
```

🔑 **Get your API keys**:
- OpenAI: https://platform.openai.com/account/api-keys  
- SerpAPI: https://serpapi.com/  
- Reddit:
  1. Go to https://www.reddit.com/prefs/apps
  2. Click “Create App”
  3. Choose **"script"** type
  4. Set name and `http://localhost` as redirect URI
  5. Copy `client ID` and `secret`

---

### ✅ 4. Start the development server

```bash
npm run dev
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 💡 Example Queries

Try asking:

```text
Where can I get the best sushi in Brooklyn?
What should I order at ABC Kitchen?
Is Soothr or Thai Villa better?
How to get to Olmsted?
Recommend something sweet in NYC.
```

---

## 🧪 Troubleshooting

- ❌ **Port already in use (e.g. 3000/3010)?**  
  Run:  
  ```bash
  for p in {3000..3010}; do lsof -ti :$p | xargs -r kill -9; done
  ```

- 🔐 **Keys not working?**  
  Make sure `.env.local` is saved and correctly set

- 🧠 **Debug classification issues?**  
  Open browser **DevTools > Console** to see GPT prompt & response logs

---

## 🌐 Deploying to Vercel

1. Push this repo to GitHub  
2. Go to [https://vercel.com/import](https://vercel.com/import)  
3. Import your GitHub repo  
4. Add the `.env.local` keys in Vercel’s dashboard  
5. Click **Deploy**

---

## ✍️ Developed by

**Sujithkumar Menon**  
Built for a full-stack take-home assessment to demonstrate skills in:
- Frontend UX
- Conversational UI
- API integration
- Intelligent assistant design

---

## 📄 License

MIT License — Feel free to use, fork, or extend.