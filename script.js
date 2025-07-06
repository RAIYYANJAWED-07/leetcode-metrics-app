document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-btn');
    const userNameInput = document.getElementById('user-input');
    const progressBarContainer = document.getElementById('progress-bar-container'); // Progress bar container

    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');

    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');

    const cardStatsContainer = document.querySelector('.stats-cards');

    // Initially hide the progress bar
    progressBarContainer.style.display = 'none';

    function validateUserName(userName) {
        if (userName.trim() === '') {
            alert('User should not be empty.');
            return false;
        }
        const regx = /^[a-zA-Z0-9_]{1,16}$/;
        const isMatching = regx.test(userName);
        if (!isMatching) {
            alert('Invalid username format.');
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;

            // Use the local backend proxy
            const url = `http://localhost:3001/leetcode/${username}`;
            const options = {
                method: 'GET'
            };

            console.log('Fetching:', url);
            const response = await fetch(url, options);
            console.log('Response status:', response.status);
            let parsedData;
            try {
                parsedData = await response.json();
            } catch (jsonErr) {
                console.error('Failed to parse JSON:', jsonErr);
                statsContainer.innerHTML += `<p style=\"color: red;\">Invalid JSON response</p>`;
                return;
            }
            console.log('API Data:', parsedData);
            displayUserData(parsedData);
        } catch (error) {
            console.error('Fetch error:', error);
            statsContainer.innerHTML += `<p style=\"color: red;\">NO DATA FOUND: ${error.message}</p>`;
        } finally {
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        progressBarContainer.style.display = 'flex';

        if (!parsedData || !parsedData.data || !parsedData.data.allQuestionsCount || !parsedData.data.matchedUser) {
            statsContainer.innerHTML += `<p style=\"color: red;\">NO DATA FOUND</p>`;
            return;
        }

        // Get total questions by difficulty
        const allQuestions = parsedData.data.allQuestionsCount;
        const easyTotal = allQuestions.find(q => q.difficulty === "Easy").count;
        const mediumTotal = allQuestions.find(q => q.difficulty === "Medium").count;
        const hardTotal = allQuestions.find(q => q.difficulty === "Hard").count;

        // Get solved questions by difficulty
        const acSubmissionNum = parsedData.data.matchedUser.submitStats.acSubmissionNum;
        const easySolved = acSubmissionNum.find(q => q.difficulty === "Easy").count;
        const mediumSolved = acSubmissionNum.find(q => q.difficulty === "Medium").count;
        const hardSolved = acSubmissionNum.find(q => q.difficulty === "Hard").count;

        updateProgress(easySolved, easyTotal, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, mediumTotal, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, hardTotal, hardLabel, hardProgressCircle);

        // Get total submissions by difficulty
        const totalSubmissionNum = parsedData.data.matchedUser.submitStats.totalSubmissionNum;
        const totalSubmissions = totalSubmissionNum.find(q => q.difficulty === "All").count;
        const easySubmissions = totalSubmissionNum.find(q => q.difficulty === "Easy").count;
        const mediumSubmissions = totalSubmissionNum.find(q => q.difficulty === "Medium").count;
        const hardSubmissions = totalSubmissionNum.find(q => q.difficulty === "Hard").count;

        // Stats cards
        const cardData = [
            { label: 'Total Submissions', value: totalSubmissions },
            { label: 'Easy Submissions', value: easySubmissions },
            { label: 'Medium Submissions', value: mediumSubmissions },
            { label: 'Hard Submissions', value: hardSubmissions }
        ];

        cardStatsContainer.innerHTML = cardData.map(data => `
            <div class='card'>
                <h4>${data.label}</h4>
                <p>${data.value}</p>
            </div>
        `).join('');
    }

    searchButton.addEventListener('click', function () {
        const username = userNameInput.value;
        if (validateUserName(username)) {
            fetchUserDetails(username);
        }
    });
});
