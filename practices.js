const practiceLibrary = [
    
    { id: 'breath1', category: 'breath', name: 'Calm Breathing', duration: 3, icon: '🌬️', desc: 'Slow down with deep belly breaths.' },
    { id: 'breath2', category: 'breath', name: '4-7-8 Breath', duration: 5, icon: '🧘', desc: 'Relax your nervous system.' },
    { id: 'breath3', category: 'breath', name: 'Morning Awakening', duration: 2, icon: '🌅', desc: 'Energize your body.' },
    
    { id: 'focus1', category: 'focus', name: 'Laser Focus', duration: 5, icon: '🎯', desc: 'Train your attention.' },
    { id: 'focus2', category: 'focus', name: 'Body Scan', duration: 7, icon: '🫀', desc: 'Mind-body awareness.' },
    { id: 'focus3', category: 'focus', name: 'Counting Breaths', duration: 3, icon: '🔢', desc: 'Simple concentration.' },
    
    { id: 'relax1', category: 'relax', name: 'Deep Rest', duration: 10, icon: '😴', desc: 'Let go of tension.' },
    { id: 'relax2', category: 'relax', name: 'Loving-Kindness', duration: 8, icon: '❤️', desc: 'Cultivate compassion.' },
    { id: 'relax3', category: 'relax', name: 'Evening Wind Down', duration: 7, icon: '🌙', desc: 'Prepare for sleep.' }
];

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.all-practices-grid');
    const tabs = document.querySelectorAll('.category-tab');

    function renderPractices(category = 'all') {
        let filtered = category === 'all' 
            ? practiceLibrary 
            : practiceLibrary.filter(p => p.category === category);
        
        grid.innerHTML = filtered.map(p => `
            <div class="practice-library-card" data-category="${p.category}">
                <div class="practice-icon">${p.icon}</div>
                <h3>${p.name}</h3>
                <p class="practice-desc">${p.desc}</p>
                <div class="practice-meta">
                    <span class="duration-badge">${p.duration} min</span>
                    <button class="btn-start-practice" 
                        data-minutes="${p.duration}" 
                        data-type="${p.category}" 
                        data-name="${p.name}">
                        Start
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPractices('all');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            renderPractices(category);
        });
    });

    grid.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-start-practice')) {
            const btn = e.target;
            const minutes = btn.dataset.minutes;
            const type = btn.dataset.type;
            const name = btn.dataset.name;
            window.startSession(minutes, type, name);
        }
    });
});