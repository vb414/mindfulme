// MindfulMe Pro - Complete Functional App

class MindfulMeProApp {
    constructor() {
        this.data = this.loadData() || this.getDefaultData();
        this.currentMood = null;
        this.selectedFactors = [];
        this.currentTags = [];
        this.breathingActive = false;
        this.meditationActive = false;
        this.breathingTimer = null;
        this.meditationTimer = null;
        this.cycleCount = 0;
        this.init();
    }

    getDefaultData() {
        return {
            moods: [],
            journals: [],
            breathingSessions: [],
            meditationSessions: [],
            streak: 0,
            lastVisit: new Date().toDateString()
        };
    }

    async init() {
        console.log('Initializing app...');
        this.updateDateTime();
        this.updateStats();
        this.loadDailyQuote();
        this.loadCommunityData();
        this.setupEventListeners();
        
        // Update every minute
        setInterval(() => this.updateDateTime(), 60000);
        
        // Auto-save every 5 minutes
        setInterval(() => this.saveData(), 300000);
        
        // Check daily streak
        this.checkDailyStreak();
    }

    setupEventListeners() {
        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-btn') && !e.target.closest('.notification-panel')) {
                const panel = document.getElementById('notificationPanel');
                if (panel) panel.classList.remove('active');
            }
            if (!e.target.closest('.user-avatar') && !e.target.closest('.profile-dropdown')) {
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) dropdown.classList.remove('active');
            }
        });

        // Chat input auto-resize
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    // Load daily inspirational quote from API
    async loadDailyQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=inspirational|happiness|wisdom&maxLength=100');
            const data = await response.json();
            
            const quoteEl = document.getElementById('dailyQuote');
            const authorEl = document.getElementById('quoteAuthor');
            
            if (quoteEl && authorEl) {
                quoteEl.textContent = data.content;
                authorEl.textContent = `— ${data.author}`;
            }
        } catch (error) {
            console.log('Error loading quote:', error);
            const quoteEl = document.getElementById('dailyQuote');
            if (quoteEl) {
                quoteEl.textContent = "Every day is a new beginning. Take a deep breath and start again.";
            }
        }
    }

    // Load community data (simulated)
    loadCommunityData() {
        // Update community stats
        const members = 2847 + Math.floor(Math.random() * 50);
        const posts = 156 + Math.floor(Math.random() * 20);
        
        const membersEl = document.getElementById('communityMembers');
        const postsEl = document.getElementById('todayPosts');
        
        if (membersEl) membersEl.textContent = members.toLocaleString();
        if (postsEl) postsEl.textContent = posts;
        
        // Load motivational message
        this.loadMotivationalMessage();
    }

    // Load motivational message from API
    async loadMotivationalMessage() {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=motivational&maxLength=150');
            const data = await response.json();
            
            const messageEl = document.getElementById('motivationalMessage');
            if (messageEl) {
                messageEl.innerHTML = `
                    <div class="message-card">
                        <i class="fas fa-quote-left"></i>
                        <p>${data.content}</p>
                        <cite>— ${data.author}</cite>
                    </div>
                `;
            }
        } catch (error) {
            console.log('Error loading motivational message:', error);
        }
    }

    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const greeting = this.getGreeting();
        
        // Update greeting
        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
            greetingEl.innerHTML = `${greeting}, <span class="username">Friend</span>!`;
        }
        
        // Update date/time
        const dateTimeEl = document.getElementById('dateTime');
        if (dateTimeEl) {
            dateTimeEl.textContent = `${dateStr} • ${timeStr}`;
        }
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.data.lastVisit;
        
        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                this.data.streak++;
            } else {
                this.data.streak = 1;
            }
            
            this.data.lastVisit = today;
            this.saveData();
        }
    }

    updateStats() {
        // Update all statistics
        document.getElementById('streakDays').textContent = this.data.streak;
        document.getElementById('currentStreak').textContent = this.data.streak;
        document.getElementById('journalEntries').textContent = this.data.journals.length;
        
        // Calculate mindful minutes
        const totalMinutes = this.data.breathingSessions.reduce((sum, session) => 
            sum + Math.floor(session.duration / 60), 0
        );
        document.getElementById('mindfulMinutes').textContent = totalMinutes;
        
        // Update mood history
        this.updateMoodHistory();
        
        // Update charts
        this.updateCharts();
    }

    updateMoodHistory() {
        const historyEl = document.getElementById('moodHistory');
        if (!historyEl) return;
        
        const recentMoods = this.data.moods.slice(-5).reverse();
        
        if (recentMoods.length === 0) {
            historyEl.innerHTML = '<p>No mood entries yet. Start tracking!</p>';
            return;
        }
        
        historyEl.innerHTML = recentMoods.map(mood => {
            const date = new Date(mood.date);
            const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
            
            return `
                <div class="mood-history-item">
                    <span class="mood-emoji">${moodEmojis[mood.value - 1]}</span>
                    <span class="mood-date">${date.toLocaleDateString()}</span>
                    ${mood.note ? `<p class="mood-note">${mood.note}</p>` : ''}
                    <div class="mood-factors">
                        ${mood.factors.map(f => `<span class="factor-tag">${f}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCharts() {
        // Update mini mood chart
        this.updateMiniMoodChart();
        
        // Update analytics charts
        this.updateAnalyticsCharts();
    }

    updateMiniMoodChart() {
        const canvas = document.getElementById('miniMoodChart');
        if (!canvas || !Chart) return;
        
        const ctx = canvas.getContext('2d');
        const last7Days = this.getLast7DaysMoods();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(d => d.label),
                datasets: [{
                    data: last7Days.map(d => d.average),
                    borderColor: '#6366f1',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0, max: 5 }
                }
            }
        });
    }

    updateAnalyticsCharts() {
        // Mood trends chart
        const moodCanvas = document.getElementById('moodTrendsChart');
        if (moodCanvas && Chart) {
            const ctx = moodCanvas.getContext('2d');
            const data = this.getLast30DaysMoods();
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        label: 'Mood',
                        data: data.map(d => d.average),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                callback: function(value) {
                                    const emojis = ['', '😢', '😟', '😐', '🙂', '😊'];
                                    return emojis[value] || value;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Activity chart
        const activityCanvas = document.getElementById('activityChart');
        if (activityCanvas && Chart) {
            const ctx = activityCanvas.getContext('2d');
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mood', 'Journal', 'Breathe', 'Meditate'],
                    datasets: [{
                        label: 'This Week',
                        data: [
                            this.getWeeklyCount('moods'),
                            this.getWeeklyCount('journals'),
                            this.getWeeklyCount('breathingSessions'),
                            this.getWeeklyCount('meditationSessions')
                        ],
                        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
        
        // Mood factors
        this.updateMoodFactors();
    }

    updateMoodFactors() {
        const factorsEl = document.getElementById('moodFactors');
        if (!factorsEl) return;
        
        const factorCounts = {};
        this.data.moods.forEach(mood => {
            mood.factors.forEach(factor => {
                factorCounts[factor] = (factorCounts[factor] || 0) + 1;
            });
        });
        
        const sortedFactors = Object.entries(factorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        factorsEl.innerHTML = sortedFactors.map(([factor, count]) => `
            <div class="factor-item">
                <span>${factor}</span>
                <div class="factor-bar">
                    <div class="factor-fill" style="width: ${(count / this.data.moods.length) * 100}%"></div>
                </div>
                <span>${count}</span>
            </div>
        `).join('');
    }

    getLast7DaysMoods() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayMoods = this.data.moods.filter(mood => {
                const moodDate = new Date(mood.date);
                return moodDate.toDateString() === date.toDateString();
            });
            
            days.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                average: dayMoods.length > 0 
                    ? dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length 
                    : 0
            });
        }
        
        return days;
    }

    getLast30DaysMoods() {
        const days = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayMoods = this.data.moods.filter(mood => {
                const moodDate = new Date(mood.date);
                return moodDate.toDateString() === date.toDateString();
            });
            
            days.push({
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                average: dayMoods.length > 0 
                    ? dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length 
                    : 0
            });
        }
        
        return days;
    }

    getWeeklyCount(type) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        return this.data[type].filter(item => 
            new Date(item.date) >= weekAgo
        ).length;
    }

    // Mood tracking
    selectMood(value) {
        this.currentMood = value;
        
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.closest('.mood-btn').classList.add('selected');
        
        // Show factors section
        document.querySelector('.mood-factors').style.display = 'block';
    }

    toggleFactor(factor) {
        const index = this.selectedFactors.indexOf(factor);
        if (index > -1) {
            this.selectedFactors.splice(index, 1);
        } else {
            this.selectedFactors.push(factor);
        }
        
        // Update UI
        event.target.classList.toggle('selected');
    }

    saveMood() {
        if (!this.currentMood) {
            this.showMessage('Please select a mood', 'error');
            return;
        }
        
        const moodEntry = {
            value: this.currentMood,
            factors: [...this.selectedFactors],
            note: document.getElementById('moodNote').value,
            date: new Date().toISOString()
        };
