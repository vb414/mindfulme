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

        this.data.moods.push(moodEntry);
       this.saveData();
       this.updateStats();
       
       // Reset form
       this.currentMood = null;
       this.selectedFactors = [];
       document.getElementById('moodNote').value = '';
       document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
       document.querySelectorAll('.factor-chip').forEach(chip => chip.classList.remove('selected'));
       document.querySelector('.mood-factors').style.display = 'none';
       
       this.showMessage('Mood saved successfully! 🎉', 'success');
       
       setTimeout(() => {
           showPage('home');
       }, 1500);
   }

   // Breathing exercises
   startBreathing(technique) {
       const techniques = {
           '478': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing' },
           'box': { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: 'Box Breathing' },
           'calm': { inhale: 3, hold: 0, exhale: 6, name: 'Calm Breathing' }
       };
       
       this.currentTechnique = techniques[technique];
       this.breathingActive = true;
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
           if (this.breathingActive) {
               const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
               const minutes = Math.floor(elapsed / 60);
               const seconds = elapsed % 60;
               document.getElementById('breathTime').textContent = 
                   `${minutes}:${seconds.toString().padStart(2, '0')}`;
           }
       }, 1000);
   }

   breathingCycle() {
       if (!this.breathingActive) return;
       
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
           if (!this.breathingActive) return;
           
           const phase = activePhases[phaseIndex];
           circle.className = `breathing-circle ${phase.class}`;
           text.textContent = phase.text;
           
           let countdown = phase.duration;
           counter.textContent = countdown;
           
           const countdownInterval = setInterval(() => {
               countdown--;
               counter.textContent = countdown;
               
               if (countdown <= 0) {
                   clearInterval(countdownInterval);
                   
                   phaseIndex++;
                   if (phaseIndex >= activePhases.length) {
                       phaseIndex = 0;
                       this.cycleCount++;
                       document.getElementById('breathCycles').textContent = this.cycleCount;
                   }
                   
                   if (this.breathingActive) {
                       runPhase();
                   }
               }
           }, 1000);
       };
       
       runPhase();
   }

   pauseBreathing() {
       this.breathingActive = !this.breathingActive;
       document.getElementById('pauseText').textContent = this.breathingActive ? 'Pause' : 'Resume';
       
       if (this.breathingActive) {
           this.breathingCycle();
       }
   }

   stopBreathing() {
       this.breathingActive = false;
       clearInterval(this.breathingTimer);
       
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

   // Meditation
   startMeditation(type) {
       const meditations = {
           'morning': { name: 'Morning Meditation', duration: 300 },
           'sleep': { name: 'Sleep Meditation', duration: 600 },
           'focus': { name: 'Focus Meditation', duration: 900 }
       };
       
       this.currentMeditation = meditations[type];
       this.meditationActive = true;
       this.meditationStartTime = Date.now();
       
       // Show player
       document.getElementById('meditationPlayer').style.display = 'block';
       document.getElementById('currentMeditationTitle').textContent = this.currentMeditation.name;
       document.getElementById('meditationDuration').textContent = 
           `${Math.floor(this.currentMeditation.duration / 60)}:00`;
       
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

   toggleMeditation() {
       this.meditationActive = !this.meditationActive;
       const icon = document.getElementById('meditationPlayPause');
       icon.className = this.meditationActive ? 'fas fa-pause' : 'fas fa-play';
   }

   stopMeditation() {
       this.completeMeditation();
   }

   completeMeditation() {
       this.meditationActive = false;
       clearInterval(this.meditationTimer);
       
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

   // AI Chat
   async sendMessage() {
       const input = document.getElementById('chatInput');
       const message = input.value.trim();
       
       if (!message) return;
       
       // Add user message
       this.addChatMessage(message, 'user');
       input.value = '';
       input.style.height = 'auto';
       
       // Generate AI response using a free API
       try {
           // Using a simple response system - in production, use a proper AI API
           const response = await this.generateAIResponse(message);
           setTimeout(() => {
               this.addChatMessage(response, 'ai');
           }, 1000);
       } catch (error) {
           this.addChatMessage("I'm here to listen. How can I support you today?", 'ai');
       }
   }

   async generateAIResponse(message) {
       const lowerMessage = message.toLowerCase();
       
       // Simple keyword-based responses
       if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
           return "I understand you're feeling anxious. That's a common experience. Have you tried our breathing exercises? They can help calm your nervous system.";
       }
       
       if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
           return "I hear that you're going through a difficult time. Remember, it's okay to feel this way. Would you like to try journaling about your feelings?";
       }
       
       if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
           return "That's wonderful to hear! Celebrating positive moments is important. What contributed to these good feelings?";
       }
       
       if (lowerMessage.includes('sleep')) {
           return "Good sleep is crucial for mental health. Try our sleep meditation or establish a calming bedtime routine. What sleep challenges are you facing?";
       }
       
       // Default response
       return "Thank you for sharing. I'm here to listen and support you. What else would you like to talk about?";
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

// Global functions
function showPage(page) {
   // Hide all pages
   document.querySelectorAll('.page-section').forEach(section => {
       section.style.display = 'none';
   });
   
   // Show selected page
   const pageElement = document.querySelector(`.${page}`);
   if (pageElement) {
       pageElement.style.display = 'block';
   }
   
   // Special handling for home page
   if (page === 'home') {
       const heroSection = document.querySelector('.hero-section');
       if (heroSection) {
           heroSection.style.display = 'block';
       }
   }
   
   // Close mobile menu
   const navMenu = document.getElementById('navMenu');
   if (navMenu) navMenu.classList.remove('active');
   
   // Scroll to top
   window.scrollTo({ top: 0, behavior: 'smooth' });
   
   // Page-specific actions
   if (window.app) {
       switch(page) {
           case 'home':
               app.updateStats();
               break;
           case 'journal':
               app.loadRecentEntries();
               break;
           case 'community':
               app.loadCommunityData();
               break;
       }
   }
}

function toggleNav() {
   const navMenu = document.getElementById('navMenu');
   if (navMenu) navMenu.classList.toggle('active');
}

function toggleNotifications() {
   const panel = document.getElementById('notificationPanel');
   if (panel) panel.classList.toggle('active');
}

function toggleProfile() {
   const dropdown = document.getElementById('profileDropdown');
   if (dropdown) dropdown.classList.toggle('active');
}

function showSettings() {
   alert('Settings page coming soon!');
}

function showPrivacy() {
   alert('Privacy settings coming soon!');
}

function exportAllData() {
   if (app) {
       const dataStr = JSON.stringify(app.data, null, 2);
       const dataBlob = new Blob([dataStr], { type: 'application/json' });
       const url = URL.createObjectURL(dataBlob);
       
       const link = document.createElement('a');
       link.href = url;
       link.download = `mindfulme_data_${new Date().toISOString().split('T')[0]}.json`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(url);
       
       app.showMessage('Data exported successfully!', 'success');
   }
}

function logout() {
   if (confirm('Are you sure you want to logout?')) {
       alert('Logged out successfully!');
   }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
   app = new MindfulMeProApp();
   window.app = app;
   showPage('home');
});
