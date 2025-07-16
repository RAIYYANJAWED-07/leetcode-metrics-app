# LeetCode Metrics App

This app displays LeetCode user statistics (solved problems, submissions, etc.) in a beautiful dashboard. It uses a custom backend to fetch data from LeetCode and a static frontend to display the results.

---

## How the Backend Works

- The backend is a simple Node.js/Express server (`leetcode-backend.js`).
- When the frontend requests `/leetcode/:username`, the backend:
  1. Sends a POST request to the **LeetCode GraphQL API**:  
     [https://leetcode.com/graphql](https://leetcode.com/graphql)
  2. Uses the following GraphQL query to fetch user stats:
     ```graphql
     query getUserProfile($username: String!) {
       allQuestionsCount { difficulty count }
       matchedUser(username: $username) {
         submitStats {
           acSubmissionNum { difficulty count }
           totalSubmissionNum { difficulty count }
         }
       }
     }
     ```
  3. Returns the JSON response to the frontend.

**Backend code reference:** See [`leetcode-backend.js`](./leetcode-backend.js)

---

## How the Frontend Works

- The frontend (HTML/CSS/JS) sends a request to the backend:
  ```js
  fetch(`http://localhost:3001/leetcode/${username}`)
  ```
- The backend responds with the user's LeetCode stats in JSON format.
- The frontend parses this data and updates the UI (progress bars, stats cards, etc.).

---

## LeetCode API Reference
- The backend uses the official (but undocumented) LeetCode GraphQL API:
  - [https://leetcode.com/graphql](https://leetcode.com/graphql)
- This API is not CORS-enabled for browsers, so a backend proxy is required.

---

## Running the App Locally
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the backend:
   ```sh
   node leetcode-backend.js
   ```
3. In a new terminal, start a local web server for the frontend:
   ```sh
   python3 -m http.server 8000
   # or
   npx http-server . -p 8000
   ```
4. Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Project Structure
```
leetcode-metrics-app/
├── leetcode-backend.js   # Backend server (Node.js/Express)
├── script.js             # Frontend JS
├── index.html            # Frontend HTML
├── style.css             # Frontend CSS
├── package.json          # Node.js dependencies
├── README.md             # This documentation
└── ...
```

---

## Credits
- LeetCode for the data/API
- Express.js and Node.js for backend
- [Your Name] for this project 