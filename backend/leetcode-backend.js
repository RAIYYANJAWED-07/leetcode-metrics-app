// Make sure you have installed node-fetch version 2: npm install node-fetch@2
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3001;

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/leetcode/:username', async (req, res) => {
  const username = req.params.username;
  try {
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from LeetCode', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('LeetCode Backend Proxy is running! Use /leetcode/:username');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 