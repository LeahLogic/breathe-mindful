class MindfulApp {
    constructor() {
        this.init();
    }

    init() {
        this.setTimeOfDay();
        this.loadUserData();
        this.setupEventListeners();
        this.updateDailyStatus();
        this.loadQuote();
    }


    setTimeOfDay() {
        const hour = new Date().getHours();
        const timeOfDayEl = document.getElementById('time-of-day');

        if (hour < 12) {
            timeOfDayEl.textContent = 'Morning';
        } else if (hour < 17) {
            timeOfDayEl.textContent = 'Afternoon';
        } else {
            timeOfDayEl.textContent = 'Evening';
        }
    }


    loadUserData() {
        const userName = localStorage.getItem('mindful_username') || 'Friend';
        const streak = localStorage.getItem('mindful_streak') || 0;

        document.getElementById('user-name').textContent = userName;
        document.getElementById('streak').textContent = streak;

        if (!localStorage.getItem('mindful_username')) {
            setTimeout(() => {
                const name = prompt("Welcome to Mindful Minutes! What's your name?") || 'Friend';
                localStorage.setItem('mindful_username', name);
                document.getElementById('user-name').textContent = name;
            }, 1500);
        }
    }


    loadQuote() {
        const quotes = [
            "Peace begins with a breath.",
            "The present moment is a gift.",
            "Mindfulness is the path to peace.",
            "Breathe in calm, breathe out stress.",
            "Every breath is a new beginning.",
            "Stillness is the foundation of action.",
            "Inhale the future, exhale the past."
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('daily-quote').textContent = `"${randomQuote}"`;
    }


    updateDailyStatus() {
        const today = new Date().toDateString();
        const lastCompleted = JSON.parse(localStorage.getItem('mindful_completed') || '{}');

        const practices = ['morning', 'midday', 'evening'];
        practices.forEach(practice => {
            const statusEl = document.getElementById(`${practice}-status`);
            if (lastCompleted[practice] === today) {
                statusEl.textContent = 'Completed';
                statusEl.style.background = 'rgba(116, 235, 213, 0.2)';
                statusEl.style.color = '#2D9C8A';
            } else {
                statusEl.textContent = 'Not started';
                statusEl.style.background = 'rgba(255, 154, 158, 0.1)';
                statusEl.style.color = '#D45D79';
            }
        });
    }

    setupEventListeners() {

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = e.currentTarget.dataset.minutes;
                const type = e.currentTarget.dataset.type;
                this.startQuickSession(minutes, type);
            });
        });


        document.querySelectorAll('.start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const practice = e.currentTarget.dataset.practice;
                this.startDailyPractice(practice);
            });
        });

        document.querySelector('.avatar').addEventListener('click', () => {
            this.changeUserName();
        });
    }

    changeUserName() {
        const currentName = localStorage.getItem('mindful_username') || 'Friend';
        const newName = prompt(`Change your name (current: ${currentName}):`, currentName);

        if (newName && newName.trim() !== '') {
            localStorage.setItem('mindful_username', newName.trim());
            document.getElementById('user-name').textContent = newName.trim();
            alert(`Name changed to ${newName.trim()}!`);
        }
    }

    startQuickSession(minutes, type) {
        const sessionData = {
            type: 'quick',
            minutes: minutes,
            practice: type,
            timestamp: new Date().toISOString()
        };

        const sessions = JSON.parse(localStorage.getItem('mindful_sessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('mindful_sessions', JSON.stringify(sessions));

        this.updateStreak();

        const practiceNames = {
            'breath': 'Breathe Practice',
            'focus': 'Focus Session',
            'relax': 'Relaxation Time'
        };

        const name = practiceNames[type] || type.charAt(0).toUpperCase() + type.slice(1);

        window.location.href = `session/session.html?minutes=${minutes}&practice=${type}&name=${encodeURIComponent(name)}`;
    }


    startDailyPractice(practice) {
        const durations = {
            morning: 5,
            midday: 3,
            evening: 7
        };

        const minutes = durations[practice];
        window.location.href = `session/session.html?minutes=${minutes}&practice=${practice}`;
    }


    updateStreak() {
        const today = new Date().toDateString();
        const lastSession = localStorage.getItem('mindful_last_session');

        if (lastSession !== today) {
            let streak = parseInt(localStorage.getItem('mindful_streak') || 0);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastSession === yesterday.toDateString()) {
                streak += 1;
            } else {
                streak = 1;
            }

            localStorage.setItem('mindful_streak', streak);
            localStorage.setItem('mindful_last_session', today);

            document.getElementById('streak').textContent = streak;
        }
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const app = new MindfulApp();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(() => {});
    });
}

function startSession(minutes, practice, name) {
    const sessionData = {
        minutes: minutes,
        practice: practice,
        name: name,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('last_session', JSON.stringify(sessionData));

    window.location.href = `session/session.html?minutes=${minutes}&practice=${practice}&name=${encodeURIComponent(name)}`;
}

window.startSession = startSession;