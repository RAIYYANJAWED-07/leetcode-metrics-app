# LeetCode Metrics App: Backend Proxy Setup

This guide will help you set up a simple Node.js backend to fetch LeetCode stats without needing RapidAPI, subscriptions, or browser CORS workarounds.

---

## 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v14+ recommended)

---

## 2. Create the Backend File

Create a new file in your project directory called `leetcode-backend.js` with the following content:

```js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3001;

app.get('/leetcode/:username', async (req, res) => {
  const username = req.params.username;
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query getUserProfile($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
            totalSubmissionNum { difficulty count }
          }
        }
      }`,
      variables: { username }
    })
  });
  const data = await response.json();
  res.json(data);
});

app.get('/', (req, res) => {
  res.send('LeetCode Backend Proxy is running! Use /leetcode/:username');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

---

## 3. Install Dependencies

In your project directory, run:

```
npm init -y
npm install express node-fetch@2
```

---

## 4. Start the Backend Server

```
node leetcode-backend.js
```

You should see: `Server running on http://localhost:3001`

---

## 5. Update Your Frontend Code

In your `script.js`, change the fetch URL to use your local backend:

```js
const url = `http://localhost:3001/leetcode/${username}`;
```

No API key or RapidAPI host is needed!

---

## 6. Run a Local Web Server for the Frontend
**Do NOT open `index.html` directly in your browser (file://...)** as this can cause CORS or JS issues. Instead, run a simple local server in your project directory.

### If you have Python installed:
```
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### If you have Node.js installed:
```
npx http-server .
```
or
```
npm install -g http-server
http-server .
```
Then open the provided localhost URL.

---

## 7. Open Your App
- Go to [http://localhost:8000](http://localhost:8000) (or the port shown by your server).
- Enter a LeetCode username and click Search.
- You should see the stats update, powered by your backend!

---

## 8. Notes
- This backend is for personal or small-scale use. For production, consider deploying to a service like Render, Railway, or Vercel.
- If you want to support more endpoints or data, you can modify the backend code as needed.

---

**Enjoy your LeetCode stats app without CORS or RapidAPI hassles!** 