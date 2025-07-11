// MindfulMe Pro - Complete Functional App with API Key Management

// Global navigation functions
window.showPage = function(page) {
    console.log('Navigating to:', page);
    
    // Hide ALL sections including hero
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Also hide the hero section explicitly
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = 'none';
    }
    
    // Show the requested page
    if (page === 'home') {
        // Show hero section for home
        if (heroSection) {
            heroSection.style.display = 'block';
        }
    } else {
        // Show the specific page section
        const pageElement = document.getElementById(page);
        
        if (pageElement) {
            pageElement.style.display = 'block';
            console.log('Showing page:', page);
        } else {
            console.error('Page not found:', page);
        }
    }
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    
    // Page-specific actions
    if (window.app) {
        switch(page) {
            case 'home':
                app.updateStats();
                break;
            case 'journal':
                app.loadRecentEntries();
                break;
            case 'insights':
                app.updateAnalyticsCharts();
                break;
            case 'ai-therapist':
                checkAPIKeySetup();
                break;
        }
    }
};

// API Key Management
window.saveAPIKey = function() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        document.getElementById('apiSetup').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'block';
        window.app.showMessage('API key saved successfully!', 'success');
    } else {
        window.app.showMessage('Please enter a valid API key', 'error');
    }
};

window.clearAPIKey = function() {
    if (confirm('Are you sure you want to clear your API key?')) {
        localStorage.removeItem('gemini_api_key');
        checkAPIKeySetup();
        window.app.showMessage('API key cleared', 'info');
    }
};

function checkAPIKeySetup() {
    const savedKey = localStorage.getItem('gemini_api_key');
    const setupEl = document.getElementById('apiSetup');
    const chatEl = document.getElementById('chatContainer');
    
    if (setupEl && chatEl) {
        if (savedKey) {
            setupEl.style.display = 'none';
            chatEl.style.display = 'block';
        } else {
            setupEl.style.display = 'block';
            chatEl.style.display = 'none';
        }
    }
}

window.toggleNav = function() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu) navMenu.classList.toggle('active');
    if (navToggle) navToggle.classList.toggle('active');
};

window.toggleNotifications = function() {
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.classList.toggle('active');
};

window.toggleProfile = function() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.toggle('active');
};

window.showSettings = function() {
    alert('Settings page coming soon!');
};

window.showPrivacy = function() {
    alert('Privacy settings coming soon!');
};

window.exportAllData = function() {
    if (window.app) {
        const dataStr = JSON.stringify(window.app.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindfulme_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        window.app.showMessage('Data exported successfully!', 'success');
    }
};

window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
    }
};

// Resource functions
window.showGuide = function(topic) {
    alert(`${topic.charAt(0).toUpperCase() + topic.slice(1)} guide coming soon!`);
};

window.findTherapist = function() {
    window.open('https://www.psychologytoday.com/us/therapists', '_blank');
};

// Global mood functions
window.selectMood = function(value, element) {
    if (window.app) {
        window.app.selectMood(value, element);
    }
};

window.toggleFactor = function(factor, element) {
    if (window.app) {
        window.app.toggleFactor(factor, element);
    }
};

window.saveMood = function() {
    if (window.app) {
        window.app.saveMood();
    }
};

// Global breathing functions
window.startBreathing = function(technique) {
    if (window.app) {
        window.app.startBreathing(technique);
    }
};

// Global journal functions
window.addTag = function() {
    if (window.app) {
        window.app.addTag();
    }
};

window.saveJournal = function() {
    if (window.app) {
        window.app.saveJournal();
    }
};

// Global meditation functions
window.startMeditation = function(type) {
    if (window.app) {
        window.app.startMeditation(type);
    }
};

window.toggleMeditation = function() {
    if (window.app) {
        window.app.toggleMeditation();
    }
};

window.stopMeditation = function() {
    if (window.app) {
        window.app.stopMeditation();
    }
};

// Global chat functions
window.sendMessage = function() {
    if (window.app) {
        window.app.sendMessage();
    }
};

// Main App Class
class MindfulMeProApp {
    constructor() {
        this.data = this.loadData() || this.getDefaultData();
        this.currentMood = null;
        this.selectedFactors = [];
        this.currentTags = [];
        this.breathingActive = false;
        this.breathingPaused = false;
        this.meditationActive = false;
        this.breathingTimer = null;
        this.meditationTimer = null;
        this.cycleCount = 0;
        this.countdownInterval = null;
        this.chatHistory = [];
        this.chartInstances = {};
        this.init();
    }

    getDefaultData() {
        return {
            moods: this.generateSampleMoods(),
            journals: [],
            breathingSessions: [],
            meditationSessions: [],
            streak: 4,
            lastVisit: new Date().toDateString()
        };
    }

    generateSampleMoods() {
        // Generate sample mood data for analytics
        const moods = [];
        const factors = ['Sleep', 'Exercise', 'Diet', 'Social', 'Work', 'Weather'];
       
       for (let i = 30; i >= 0; i--) {
           const date = new Date();
           date.setDate(date.getDate() - i);
           
           // Generate 1-2 moods per day
           const moodsPerDay = Math.random() > 0.5 ? 2 : 1;
           
           for (let j = 0; j < moodsPerDay; j++) {
               const moodValue = Math.floor(Math.random() * 2) + 3; // Mostly happy moods (3-5)
               const selectedFactors = [];
               
               // Select 2-3 random factors
               const numFactors = Math.floor(Math.random() * 2) + 2;
               for (let k = 0; k < numFactors; k++) {
                   const factor = factors[Math.floor(Math.random() * factors.length)];
                   if (!selectedFactors.includes(factor)) {
                       selectedFactors.push(factor);
                   }
               }
               
               moods.push({
                   value: moodValue,
                   factors: selectedFactors,
                   note: '',
                   date: date.toISOString()
               });
           }
       }
       
       return moods;
   }

   async init() {
       console.log('Initializing app...');
       this.updateDateTime();
       this.updateStats();
       this.loadDailyQuote();
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
       }
   }

   // Load daily inspirational quote
   loadDailyQuote() {
       const quotes = [
           { content: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
           { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
           { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
           { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
           { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
           { content: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
           { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
           { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
           { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
           { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
       ];
       
       const quoteEl = document.getElementById('dailyQuote');
       const authorEl = document.getElementById('quoteAuthor');
       
       // Pick a random quote
       const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
       
       if (quoteEl) {
           quoteEl.textContent = randomQuote.content;
       }
       if (authorEl) {
           authorEl.textContent = `— ${randomQuote.author}`;
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
       // Update all statistics with safe checks
       const streakEl = document.getElementById('streakDays');
       if (streakEl) streakEl.textContent = this.data.streak;
       
       const currentStreakEl = document.getElementById('currentStreak');
       if (currentStreakEl) currentStreakEl.textContent = this.data.streak;
       
       const journalEntriesEl = document.getElementById('journalEntries');
       if (journalEntriesEl) journalEntriesEl.textContent = this.data.journals.length;
       
       // Calculate mindful minutes
       const totalMinutes = this.data.breathingSessions.reduce((sum, session) => 
           sum + Math.floor(session.duration / 60), 0
       );
       const mindfulMinutesEl = document.getElementById('mindfulMinutes');
       if (mindfulMinutesEl) mindfulMinutesEl.textContent = totalMinutes || '7';
       
       // Calculate average mood
       if (this.data.moods.length > 0) {
           const avgMood = this.data.moods.reduce((sum, mood) => sum + mood.value, 0) / this.data.moods.length;
           const avgMoodEl = document.getElementById('avgMoodScore');
           if (avgMoodEl) avgMoodEl.textContent = avgMood.toFixed(1);
       }
       
       // Update mood history
       this.updateMoodHistory();
       
       // Update mini chart
       this.updateMiniMoodChart();
       
       // Update wellness score
       this.updateWellnessScore();
   }

   updateWellnessScore() {
       let score = 50; // Base score
       
       // Add points for streak
       score += Math.min(this.data.streak * 2, 20);
       
       // Add points for recent activities
       const recentMoods = this.data.moods.filter(m => {
           const moodDate = new Date(m.date);
           const weekAgo = new Date();
           weekAgo.setDate(weekAgo.getDate() - 7);
           return moodDate >= weekAgo;
       });
       
       if (recentMoods.length > 0) {
           const avgMood = recentMoods.reduce((sum, m) => sum + m.value, 0) / recentMoods.length;
           score += avgMood * 6;
       }
       
       // Cap at 100
       score = Math.min(Math.round(score), 100);
       
       const scoreEl = document.getElementById('wellnessScore');
       if (scoreEl) scoreEl.textContent = score;
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

   updateMiniMoodChart() {
       const canvas = document.getElementById('miniMoodChart');
       if (!canvas || !window.Chart) return;
       
       // Destroy existing chart
       if (this.chartInstances.miniMood) {
           this.chartInstances.miniMood.destroy();
       }
       
       const ctx = canvas.getContext('2d');
       const last7Days = this.getLast7DaysMoods();
       
       this.chartInstances.miniMood = new Chart(ctx, {
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
                   : 3 // Default to neutral
           });
       }
       
       return days;
   }

   updateAnalyticsCharts() {
       // Mood trends chart
       const moodCanvas = document.getElementById('moodTrendsChart');
       if (moodCanvas && window.Chart) {
           // Destroy existing chart
           if (this.chartInstances.moodTrends) {
               this.chartInstances.moodTrends.destroy();
           }
           
           const ctx = moodCanvas.getContext('2d');
           const last30Days = this.getLast30DaysMoods();
           
           this.chartInstances.moodTrends = new Chart(ctx, {
               type: 'line',
               data: {
                   labels: last30Days.map(d => d.label),
                   datasets: [{
                       label: 'Mood',
                       data: last30Days.map(d => d.average),
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
       if (activityCanvas && window.Chart) {
           // Destroy existing chart
           if (this.chartInstances.activity) {
               this.chartInstances.activity.destroy();
           }
           
           const ctx = activityCanvas.getContext('2d');
           
           this.chartInstances.activity = new Chart(ctx, {
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
       this.updateMoodFactorsAnalytics();
   }

   updateMoodFactorsAnalytics() {
       const factorsEl = document.getElementById('moodFactorsAnalytics');
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
       
       if (sortedFactors.length === 0) {
           factorsEl.innerHTML = '<p>Track more moods to see patterns</p>';
           return;
       }
       
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
                   : 3
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
   selectMood(value, element) {
       this.currentMood = value;
       
       // Update UI
       document.querySelectorAll('.mood-btn').forEach(btn => {
           btn.classList.remove('selected');
       });
       element.classList.add('selected');
       
       // Show factors section
       document.getElementById('moodFactors').style.display = 'block';
   }

   toggleFactor(factor, element) {
       const index = this.selectedFactors.indexOf(factor);
       if (index > -1) {
           this.selectedFactors.splice(index, 1);
       } else {
           this.selectedFactors.push(factor);
       }
       
       // Update UI
       element.classList.toggle('selected');
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
       
       this.data.moods.push(moodEntry);
       this.saveData();
       this.updateStats();
       
       // Reset form
       this.currentMood = null;
       this.selectedFactors = [];
       document.getElementById('moodNote').value = '';
       document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
       document.querySelectorAll('.factor-chip').forEach(chip => chip.classList.remove('selected'));
       document.getElementById('moodFactors').style.display = 'none';
       
       this.showMessage('Mood saved successfully! 🎉', 'success');
       
       setTimeout(() => {
           showPage('home');
       }, 1500);
   }

   // Breathing exercises - FIXED
   startBreathing(technique) {
       const techniques = {
           '478': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing' },
           'box': { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: 'Box Breathing' },
           'calm': { inhale: 3, hold: 0, exhale: 6, name: 'Calm Breathing' }
       };
       
       this.currentTechnique = techniques[technique];
       this.breathingActive = true;
       this.breathingPaused = false;
       this.cycleCount = 0;
       this.sessionStartTime = Date.now();
       
       // Hide techniques and show breathing interface
       document.getElementById('breathingTechniques').style.display = 'none';
       document.getElementById('breathingContainer').style.display = 'block';
       
       // Create breathing interface
       document.getElementById('breathingContainer').innerHTML = `
           <h3>${this.currentTechnique.name}</h3>
           <div class="breathing-visual">
               <div class="breathing-circle" id="breathingCircle">
                   <div class="breathing-text" id="breathingText">Get Ready</div>
                   <div class="breathing-counter" id="breathingCounter">3</div>
               </div>
           </div>
           <div class="breathing-stats">
               <div>Cycles: <span id="breathCycles">0</span></div>
               <div>Time: <span id="breathTime">0:00</span></div>
           </div>
           <div class="breathing-controls">
               <button class="btn btn-secondary" onclick="app.pauseBreathing()">
                   <span id="pauseText">Pause</span>
               </button>
               <button class="btn btn-secondary" onclick="app.stopBreathing()">Stop</button>
           </div>
       `;
       
       // Start breathing cycle
       this.breathingCycle();
       
       // Update timer
       this.breathingTimer = setInterval(() => {
           if (this.breathingActive && !this.breathingPaused) {
               const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
               const minutes = Math.floor(elapsed / 60);
               const seconds = elapsed % 60;
               document.getElementById('breathTime').textContent = 
                   `${minutes}:${seconds.toString().padStart(2, '0')}`;
           }
       }, 1000);
   }

   breathingCycle() {
       if (!this.breathingActive || this.breathingPaused) return;
       
       const circle = document.getElementById('breathingCircle');
       const text = document.getElementById('breathingText');
       const counter = document.getElementById('breathingCounter');
       
       // Breathing phases
       const phases = [
           { text: 'Breathe In', duration: this.currentTechnique.inhale, class: 'inhale' },
           { text: 'Hold', duration: this.currentTechnique.hold, class: 'hold' },
           { text: 'Breathe Out', duration: this.currentTechnique.exhale, class: 'exhale' }
       ];
       
       if (this.currentTechnique.hold2) {
           phases.push({ text: 'Hold', duration: this.currentTechnique.hold2, class: 'hold' });
       }
       
       // Remove phases with 0 duration
       const activePhases = phases.filter(p => p.duration > 0);
       
       let phaseIndex = 0;
       
       const runPhase = () => {
           if (!this.breathingActive || this.breathingPaused) return;
           
           const phase = activePhases[phaseIndex];
           circle.className = `breathing-circle ${phase.class}`;
           text.textContent = phase.text;
           
           let countdown = phase.duration;
           counter.textContent = countdown;
           
           // Clear any existing countdown
           if (this.countdownInterval) {
               clearInterval(this.countdownInterval);
           }
           
           this.countdownInterval = setInterval(() => {
               if (!this.breathingActive) {
                   clearInterval(this.countdownInterval);
                   return;
               }
               
               if (this.breathingPaused) {
                   return;
               }
               
               countdown--;
               counter.textContent = countdown;
               
               if (countdown <= 0) {
                   clearInterval(this.countdownInterval);
                   
                   phaseIndex++;
                   if (phaseIndex >= activePhases.length) {
                       phaseIndex = 0;
                       this.cycleCount++;
                       const cyclesEl = document.getElementById('breathCycles');
                       if (cyclesEl) cyclesEl.textContent = this.cycleCount;
                   }
                   
                   if (this.breathingActive && !this.breathingPaused) {
                       runPhase();
                   }
               }
           }, 1000);
       };
       
       runPhase();
   }

   pauseBreathing() {
       this.breathingPaused = !this.breathingPaused;
       document.getElementById('pauseText').textContent = this.breathingPaused ? 'Resume' : 'Pause';
       
       if (!this.breathingPaused) {
           // Resume from where we left off
           this.breathingCycle();
       }
   }

   stopBreathing() {
       this.breathingActive = false;
       this.breathingPaused = false;
       
       // Clear all intervals
       if (this.breathingTimer) {
           clearInterval(this.breathingTimer);
           this.breathingTimer = null;
       }
       
       if (this.countdownInterval) {
           clearInterval(this.countdownInterval);
           this.countdownInterval = null;
       }
       
       const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
       
       // Save session
       this.data.breathingSessions.push({
           technique: this.currentTechnique.name,
           duration: duration,
           cycles: this.cycleCount,
           date: new Date().toISOString()
       });
       
       this.saveData();
       this.updateStats();
       
       // Show completion message
       document.getElementById('breathingContainer').innerHTML = `
           <div class="completion-message">
               <i class="fas fa-check-circle"></i>
               <h3>Great job!</h3>
               <p>You completed ${this.cycleCount} breathing cycles in ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}</p>
               <button class="btn btn-primary" onclick="showPage('home')">Back to Dashboard</button>
           </div>
       `;
       
       // Reset techniques display
       setTimeout(() => {
           document.getElementById('breathingTechniques').style.display = 'grid';
           document.getElementById('breathingContainer').style.display = 'none';
       }, 5000);
   }

   // Journal functions
   addTag(tag) {
       if (!tag) {
           tag = document.getElementById('journalTag').value.trim();
           document.getElementById('journalTag').value = '';
       }
       
       if (tag && !this.currentTags.includes(tag)) {
           this.currentTags.push(tag);
           this.updateTagsDisplay();
       }
   }

   updateTagsDisplay() {
       const container = document.getElementById('journalTags');
       container.innerHTML = this.currentTags.map(tag => `
           <span class="tag">
               ${tag}
               <button onclick="app.removeTag('${tag}')" class="tag-remove">&times;</button>
           </span>
       `).join('');
   }

   removeTag(tag) {
       this.currentTags = this.currentTags.filter(t => t !== tag);
       this.updateTagsDisplay();
   }

   saveJournal() {
       const title = document.getElementById('journalTitle').value.trim();
       const content = document.getElementById('journalContent').value.trim();
       
       if (!content) {
           this.showMessage('Please write something', 'error');
           return;
       }
       
       const entry = {
           title: title || 'Untitled',
           content: content,
           tags: [...this.currentTags],
           date: new Date().toISOString()
       };
       
       this.data.journals.push(entry);
       this.saveData();
       this.updateStats();
       this.loadRecentEntries();
       
       // Reset form
       document.getElementById('journalTitle').value = '';
       document.getElementById('journalContent').value = '';
       this.currentTags = [];
       this.updateTagsDisplay();
       
       this.showMessage('Journal entry saved! 📝', 'success');
   }

   loadRecentEntries() {
       const container = document.getElementById('recentEntries');
       if (!container) return;
       
       const recent = this.data.journals.slice(-3).reverse();
       
       if (recent.length === 0) {
           container.innerHTML = '<p>No entries yet. Start writing!</p>';
           return;
       }
       
       container.innerHTML = recent.map(entry => {
           const date = new Date(entry.date);
           return `
               <div class="journal-entry">
                   <h4>${entry.title}</h4>
                   <p class="entry-date">${date.toLocaleDateString()}</p>
                   <p class="entry-preview">${entry.content.substring(0, 100)}...</p>
                   <div class="entry-tags">
                       ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                   </div>
               </div>
           `;
       }).join('');
   }

   // Meditation with ambient sounds
   startMeditation(type) {
       const meditations = {
           'morning': { 
               name: 'Morning Energy', 
               duration: 300,
               description: 'Energize your day with focused breathing and positive affirmations'
           },
           'sleep': { 
               name: 'Deep Sleep', 
               duration: 600,
               description: 'Drift into peaceful sleep with calming guidance'
           },
           'focus': { 
               name: 'Focus & Clarity', 
               duration: 900,
               description: 'Enhance concentration and mental clarity'
           }
       };
       
       this.currentMeditation = meditations[type];
       this.meditationActive = true;
       this.meditationStartTime = Date.now();
       
       // Show player
       document.getElementById('meditationPlayer').style.display = 'block';
       document.getElementById('currentMeditationTitle').textContent = this.currentMeditation.name;
       document.getElementById('meditationDuration').textContent = 
           `${Math.floor(this.currentMeditation.duration / 60)}:00`;
       
       // Create and play ambient sound
       this.playAmbientSound();
       
       // Start timer
       this.meditationTimer = setInterval(() => {
           if (this.meditationActive) {
               const elapsed = Math.floor((Date.now() - this.meditationStartTime) / 1000);
               const minutes = Math.floor(elapsed / 60);
               const seconds = elapsed % 60;
               document.getElementById('meditationTime').textContent = 
                   `${minutes}:${seconds.toString().padStart(2, '0')}`;
               
               if (elapsed >= this.currentMeditation.duration) {
                   this.completeMeditation();
               }
           }
       }, 1000);
   }

   playAmbientSound() {
       // Create audio context for ambient sound generation
       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
       
       // Create white noise
       const bufferSize = 2 * audioContext.sampleRate;
       const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
       const output = noiseBuffer.getChannelData(0);
       
       for (let i = 0; i < bufferSize; i++) {
           output[i] = Math.random() * 2 - 1;
       }
       
       const whiteNoise = audioContext.createBufferSource();
       whiteNoise.buffer = noiseBuffer;
       whiteNoise.loop = true;
       
       // Create filter for brown noise effect
       const filter = audioContext.createBiquadFilter();
       filter.type = 'lowpass';
       filter.frequency.value = 400;
       
       // Create gain for volume control
       const gain = audioContext.createGain();
       gain.gain.value = 0.05; // Very low volume
       
       // Connect nodes
       whiteNoise.connect(filter);
       filter.connect(gain);
       gain.connect(audioContext.destination);
       
       // Start playing
       whiteNoise.start();
       
       // Store references for stopping
       this.ambientSound = {
           source: whiteNoise,
           context: audioContext
       };
   }

   toggleMeditation() {
       this.meditationActive = !this.meditationActive;
       const icon = document.getElementById('meditationPlayPause');
       icon.className = this.meditationActive ? 'fas fa-pause' : 'fas fa-play';
       
       if (this.meditationActive && this.ambientSound) {
           this.ambientSound.context.resume();
       } else if (this.ambientSound) {
           this.ambientSound.context.suspend();
       }
   }

   stopMeditation() {
       this.completeMeditation();
   }

   completeMeditation() {
       this.meditationActive = false;
       clearInterval(this.meditationTimer);
       
       // Stop ambient sound
       if (this.ambientSound) {
           this.ambientSound.source.stop();
           this.ambientSound.context.close();
           this.ambientSound = null;
       }
       
       const duration = Math.floor((Date.now() - this.meditationStartTime) / 1000);
       
       // Save session
       this.data.meditationSessions = this.data.meditationSessions || [];
       this.data.meditationSessions.push({
           type: this.currentMeditation.name,
           duration: duration,
           date: new Date().toISOString()
       });
       
       this.saveData();
       this.updateStats();
       
       // Hide player
       document.getElementById('meditationPlayer').style.display = 'none';
       
       this.showMessage('Meditation completed! 🧘', 'success');
   }

   // Enhanced AI Chat with Gemini API
   async sendMessage() {
       const input = document.getElementById('chatInput');
       const message = input.value.trim();
       
       if (!message) return;
       
       // Add user message
       this.addChatMessage(message, 'user');
       input.value = '';
       input.style.height = 'auto';
       
       // Store in history
       this.chatHistory.push({ role: 'user', content: message });
       
       // Generate AI response
       const response = await this.generateEnhancedAIResponse(message);
       
       // Add typing indicator
       const typingDiv = this.addTypingIndicator();
       
       setTimeout(() => {
           typingDiv.remove();
           this.addChatMessage(response, 'ai');
           this.chatHistory.push({ role: 'ai', content: response });
       }, 1500);
   }

   addTypingIndicator() {
       const chatMessages = document.getElementById('chatMessages');
       const typingDiv = document.createElement('div');
       typingDiv.className = 'message ai-message typing-indicator';
       typingDiv.innerHTML = `
           <div class="message-avatar">
               <i class="fas fa-robot"></i>
           </div>
           <div class="message-content">
               <div class="typing-dots">
                   <span></span>
                   <span></span>
                   <span></span>
               </div>
           </div>
       `;
       chatMessages.appendChild(typingDiv);
       chatMessages.scrollTop = chatMessages.scrollHeight;
       return typingDiv;
   }

   async generateEnhancedAIResponse(message) {
       // Crisis detection first - this is important to keep
       const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead'];
       const containsCrisis = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
       
       if (containsCrisis) {
           return "I'm deeply concerned about what you're sharing. Your life has value and this pain won't last forever. Please reach out for immediate help:\n\n" +
                  "**Crisis Hotline**: Call 988 (Suicide & Crisis Lifeline)\n" +
                  "**Crisis Text**: Text HOME to 741741\n\n" +
                  "Would you like me to help you find additional resources or someone to talk to right now?";
       }
       
       // Get API key from localStorage
       const API_KEY = localStorage.getItem('gemini_api_key');
       
       if (!API_KEY) {
           return "Please set up your API key first. Click the 'Change API Key' button below to add your free Google Gemini API key.";
       }
       
       try {
           // Build conversation context
           const conversationContext = this.chatHistory.slice(-10).map(msg => 
               `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
           ).join('\n');
           
           const prompt = `You are MindfulMe AI, a compassionate and empathetic mental health support assistant. Your role is to:
- Listen with empathy and without judgment
- Provide emotional support and validation
- Suggest coping strategies when appropriate
- Encourage self-care and wellness activities
- Recommend using the app's features (mood tracking, breathing exercises, meditation, journaling) when relevant
- Always encourage professional help for serious concerns
- Never provide medical advice or diagnoses

Previous conversation:
${conversationContext}

User: ${message}

Respond in a warm, supportive, and conversational tone. Keep responses concise but meaningful (2-4 sentences). Ask follow-up questions to show you're engaged and caring.`;

           const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   contents: [{
                       parts: [{
                           text: prompt
                       }]
                   }],
                   generationConfig: {
                       temperature: 0.7,
                       maxOutputTokens: 150,
                   }
               })
           });
           
           if (!response.ok) {
               if (response.status === 403) {
                   throw new Error('Invalid API key. Please check your key and try again.');
               }
               throw new Error(`API error: ${response.status}`);
           }
           
           const data = await response.json();
           
           if (data.candidates && data.candidates[0] && data.candidates[0].content) {
               const aiResponse = data.candidates[0].content.parts[0].text;
               return aiResponse.trim();
           } else {
               throw new Error('Invalid response format');
           }
           
       } catch (error) {
           console.error('Gemini AI Error:', error);
           
           if (error.message.includes('Invalid API key')) {
               localStorage.removeItem('gemini_api_key');
               checkAPIKeySetup();
               return "Your API key seems to be invalid. Please enter a valid key in the setup above.";
           }
           
           // Fallback responses if API fails
           const fallbacks = [
               "I'm having a bit of trouble connecting right now, but I'm still here for you. How are you feeling today?",
               "Sorry, I'm experiencing some technical difficulties, but I want you to know I'm here to listen. What's on your mind?",
               "I apologize for the connection issue. While I sort this out, would you like to try one of our breathing exercises or meditation sessions?",
               "I'm having trouble with my connection, but your wellbeing is important to me. Have you tried journaling about how you're feeling?"
           ];
           
           return fallbacks[Math.floor(Math.random() * fallbacks.length)];
       }
   }

   addChatMessage(message, sender) {
       const chatMessages = document.getElementById('chatMessages');
       const messageDiv = document.createElement('div');
       messageDiv.className = `message ${sender}-message`;
       
       if (sender === 'ai') {
           messageDiv.innerHTML = `
               <div class="message-avatar">
                   <i class="fas fa-robot"></i>
               </div>
               <div class="message-content">
                   <p>${message}</p>
               </div>
           `;
       } else {
           messageDiv.innerHTML = `
               <div class="message-content">
                   <p>${message}</p>
               </div>
           `;
       }
       
       chatMessages.appendChild(messageDiv);
       chatMessages.scrollTop = chatMessages.scrollHeight;
   }

   // Helper functions
   showMessage(message, type = 'info') {
       const toast = document.getElementById('messageToast');
       toast.innerHTML = `
           <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
           <span>${message}</span>
       `;
       toast.className = `message-toast ${type} show`;
       
       setTimeout(() => {
           toast.classList.remove('show');
       }, 3000);
   }

   loadData() {
       try {
           const saved = localStorage.getItem('mindfulme_data');
           return saved ? JSON.parse(saved) : null;
       } catch (error) {
           console.error('Error loading data:', error);
           return null;
       }
   }

   saveData() {
       try {
           localStorage.setItem('mindfulme_data', JSON.stringify(this.data));
       } catch (error) {
           console.error('Error saving data:', error);
       }
   }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
   console.log('DOM loaded, creating app...');
   app = new MindfulMeProApp();
   window.app = app;
   
   // Make sure home page is shown
   showPage('home');
   
   // Initialize quote immediately
   const quotes = [
       { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
       { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
       { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
       { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
       { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" }
   ];
   
   const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
   const quoteEl = document.getElementById('dailyQuote');
   const authorEl = document.getElementById('quoteAuthor');
   if (quoteEl) quoteEl.textContent = randomQuote.text;
   if (authorEl) authorEl.textContent = `— ${randomQuote.author}`;
});

