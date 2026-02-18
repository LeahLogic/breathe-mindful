class MeditationSession {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        this.minutes = parseInt(urlParams.get('minutes')) || 5;
        this.practiceType = urlParams.get('practice') || 'breath';
        this.practiceName = urlParams.get('name') || 'Mindful Breathing';
        
        this.totalSeconds = this.minutes * 60;
        this.timeLeft = this.totalSeconds;
        this.isRunning = false;
        this.isSoundOn = false;
        this.interval = null;
        
        this.countdownEl = document.getElementById('countdown');
        this.progressFillEl = document.getElementById('progress-fill');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.soundBtn = document.getElementById('sound-btn');
        this.finishBtn = document.getElementById('finish-btn');
        this.practiceTitleEl = document.getElementById('practice-title');
        this.hintTextEl = document.getElementById('hint-text');
        this.backgroundEl = document.getElementById('background-image');
        this.player = document.getElementById('player');
        
        this.hints = [
            "Find a comfortable position...",
            "Close your eyes gently...",
            "Breathe in slowly through your nose...",
            "Feel your chest and belly expand...",
            "Exhale slowly through your mouth...",
            "Notice the pause between breaths...",
            "If your mind wanders, gently return to your breath...",
            "Notice how your body feels...",
            "Release any tension with each exhale...",
            "Stay present in this moment..."
        ];
        
        this.hintIndex = 0;
        this.hintInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupPractice();
        this.updateDisplay();
        this.setupEventListeners();
        
        if (!this.isMobile()) {
            setTimeout(() => this.startSession(), 1000);
        }
    }
    
    setupPractice() {
        this.practiceTitleEl.textContent = this.practiceName;
        document.body.classList.add(`${this.practiceType}-practice`);
        this.setAudioForPractice();
    }
    
    setAudioForPractice() {
        const audioFiles = {
            'breath': '../audio/breathe.mp3',
            'focus': '../audio/breathing.mp3', 
            'relax': '../audio/relax.mp3',
            'morning': '../audio/breathe.mp3',
            'midday': '../audio/breathing.mp3',
            'evening': '../audio/evening.mp3'
        };
        
        const audioPath = audioFiles[this.practiceType];
        
        if (!audioPath) {
            return;
        }
        
        const currentSrc = this.player.src.split('/').pop();
        const newSrc = audioPath.split('/').pop();
        
        if (currentSrc === newSrc && this.player.src) {
            return;
        }
        
        this.player.src = audioPath;
        this.player.load();
        
        this.isSoundOn = false;
        this.soundBtn.querySelector('.btn-icon').textContent = '🔇';
        this.soundBtn.querySelector('.btn-text').textContent = 'Sound Off';
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.pauseSession();
            } else {
                this.startSession();
            }
        });
        
        this.soundBtn.addEventListener('click', () => {
            this.toggleSound();
        });
        
        this.finishBtn.addEventListener('click', () => {
            this.finishSession();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.isRunning && !this.playPauseBtn.contains(e.target)) {
                this.startSession();
            }
        });
    }
    
    startSession() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timeLeft = this.totalSeconds;
        this.playPauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        this.playPauseBtn.querySelector('.btn-text').textContent = 'Pause';
        this.interval = setInterval(() => this.updateTimer(), 1000);
        this.startHints();
        
        if (!this.isMobile()) {
            this.turnSoundOn();
        }
        
        this.startTime = new Date();
    }
    
    pauseSession() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        clearInterval(this.hintInterval);
        
        this.playPauseBtn.querySelector('.btn-icon').textContent = '▶️';
        this.playPauseBtn.querySelector('.btn-text').textContent = 'Resume';
        this.hintTextEl.textContent = "Session paused...";
    }
    
    updateTimer() {
        this.timeLeft--;
        this.updateDisplay();
        
        if (this.timeLeft <= 0) {
            this.completeSession();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.countdownEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        const progress = ((this.totalSeconds - this.timeLeft) / this.totalSeconds) * 100;
        this.progressFillEl.style.width = `${progress}%`;
    }
    
    startHints() {
        this.showNextHint();
        this.hintInterval = setInterval(() => {
            this.showNextHint();
        }, 30000);
    }
    
    showNextHint() {
        this.hintTextEl.textContent = this.hints[this.hintIndex];
        this.hintIndex = (this.hintIndex + 1) % this.hints.length;
    }
    
    toggleSound() {
        if (this.isSoundOn) {
            this.turnSoundOff();
        } else {
            this.turnSoundOn();
        }
    }
    
    turnSoundOn() {
        this.player.muted = false;
        this.player.play().then(() => {
            this.isSoundOn = true;
            this.soundBtn.querySelector('.btn-icon').textContent = '🔊';
            this.soundBtn.querySelector('.btn-text').textContent = 'Sound On';
        }).catch(error => {
            if (this.isMobile()) {
                this.hintTextEl.textContent = "Tap the sound button to enable audio";
            }
        });
    }
    
    turnSoundOff() {
        this.player.muted = true;
        this.isSoundOn = false;
        this.soundBtn.querySelector('.btn-icon').textContent = '🔇';
        this.soundBtn.querySelector('.btn-text').textContent = 'Sound Off';
    }
    
    completeSession() {
        clearInterval(this.interval);
        clearInterval(this.hintInterval);
        
        this.isRunning = false;
        this.countdownEl.textContent = "0:00";
        this.progressFillEl.style.width = '100%';
        this.hintTextEl.textContent = "Great job! You completed your meditation. 🎉";
        this.playPauseBtn.querySelector('.btn-icon').textContent = '🔄';
        this.playPauseBtn.querySelector('.btn-text').textContent = 'Restart';
        
        this.saveToHistory();
        
        setTimeout(() => {
            if (confirm("Session completed! Return to home page?")) {
                window.location.href = '../index.html';
            }
        }, 5000);
    }
    
    finishSession() {
        if (confirm("Are you sure you want to finish this session early?")) {
            clearInterval(this.interval);
            clearInterval(this.hintInterval);
            window.location.href = '../index.html';
        }
    }
    
    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('meditation_history') || '[]');
        
        const sessionRecord = {
            date: new Date().toISOString(),
            practice: this.practiceType,
            name: this.practiceName,
            duration: this.minutes,
            completed: true
        };
        
        history.push(sessionRecord);
        localStorage.setItem('meditation_history', JSON.stringify(history));
        this.updateStreak();
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastSessionDate = localStorage.getItem('last_meditation_date');
        
        let streak = parseInt(localStorage.getItem('meditation_streak') || '0');
        
        if (lastSessionDate === today) {
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSessionDate === yesterday.toDateString()) {
            streak += 1;
        } else {
            streak = 1;
        }
        
        localStorage.setItem('meditation_streak', streak.toString());
        localStorage.setItem('last_meditation_date', today);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const session = new MeditationSession();
});