const JOURNAL_KEY = 'mindful_journal_entries';

document.addEventListener('DOMContentLoaded', function() {
    const entryField = document.getElementById('journal-entry');
    const saveBtn = document.getElementById('save-journal-btn');
    const entriesList = document.getElementById('entries-list');
    const feedback = document.getElementById('entry-feedback');

    function loadEntries() {
        const entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
        if (entries.length === 0) {
            entriesList.innerHTML = '<p style="color: var(--text-light); text-align: center;">✨ No entries yet. Write your first reflection.</p>';
            return;
        }
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        entriesList.innerHTML = entries.map(entry => `
            <div class="entry-card" data-id="${entry.id}">
                <div class="entry-date">
                    <span>📅 ${new Date(entry.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}</span>
                    <button class="delete-entry" data-id="${entry.id}">🗑️</button>
                </div>
                <div class="entry-content">${entry.text.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    }

    function saveEntry() {
        const text = entryField.value.trim();
        if (!text) {
            feedback.textContent = '✏️ Write something before saving.';
            feedback.style.color = '#D45D79';
            return;
        }

        const entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
        const newEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            text: text
        };
        entries.push(newEntry);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));

        entryField.value = '';
        feedback.textContent = '✅ Entry saved!';
        feedback.style.color = '#2D9C8A';
        setTimeout(() => feedback.textContent = '', 2500);
        loadEntries();
    }

    saveBtn.addEventListener('click', saveEntry);

    entriesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-entry')) {
            const id = e.target.dataset.id;
            let entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
            entries = entries.filter(entry => entry.id !== id);
            localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
            loadEntries();
            feedback.textContent = '🗑️ Entry deleted.';
            setTimeout(() => feedback.textContent = '', 2000);
        }
    });

    loadEntries();
});