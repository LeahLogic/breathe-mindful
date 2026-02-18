document.addEventListener('DOMContentLoaded', function() {
    const history = JSON.parse(localStorage.getItem('meditation_history') || '[]');
    const streak = parseInt(localStorage.getItem('meditation_streak') || '0');

    const totalSessions = history.length;
    const totalMinutes = history.reduce((acc, s) => acc + (s.duration || 0), 0);

    document.getElementById('stat-streak').textContent = streak;
    document.getElementById('stat-total-sessions').textContent = totalSessions;
    document.getElementById('stat-total-minutes').textContent = totalMinutes;

    const weekGrid = document.getElementById('week-grid');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toDateString());
    }

    const sessionDates = history.map(s => new Date(s.date).toDateString());

    weekGrid.innerHTML = days.map((day, index) => {
        const isActive = sessionDates.includes(last7Days[index]);
        return `<div class="week-day ${isActive ? 'active' : ''}">${day}</div>`;
    }).join('');

    const categoryCount = {};
    history.forEach(s => {
        const cat = s.practice || 'other';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categoryNames = {
        breath: 'Breath',
        focus: 'Focus',
        relax: 'Relax',
        morning: 'Morning',
        midday: 'Midday',
        evening: 'Evening'
    };

    const categoryEl = document.getElementById('category-stats');
    const entries = Object.entries(categoryCount);
    const maxCount = Math.max(...entries.map(e => e[1]), 1);

    if (entries.length === 0) {
        categoryEl.innerHTML = '<p style="color: var(--text-light);">No data yet. Start a session!</p>';
    } else {
        categoryEl.innerHTML = entries.map(([cat, count]) => {
            const percent = (count / maxCount) * 100;
            return `
                <div class="category-stat-item">
                    <span style="font-size: 20px;">${getIconForCategory(cat)}</span>
                    <span style="width: 80px;">${categoryNames[cat] || cat}</span>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span style="min-width: 30px; font-weight: 600;">${count}</span>
                </div>
            `;
        }).join('');
    }

    function getIconForCategory(cat) {
        const map = {
            breath: '🌬️',
            focus: '🎯',
            relax: '🌊',
            morning: '🌅',
            midday: '☕',
            evening: '🌙'
        };
        return map[cat] || '🧘';
    }
});