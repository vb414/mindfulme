// MindfulMe Pro - Advanced Mental Health Companion App

class MindfulMeProApp {
    constructor() {
        this.data = this.loadData();
        this.currentMood = null;
        this.selectedFactors = [];
        this.currentTags = [];
        this.breathingInterval = null;
        this.breathingTimer = null;
        this.sessionStartTime = null;
        this.sessionTimer = null;
        this.isPaused = false;
        this.cycleCount = 0;
        this.pausedTime = 0;
        this.totalPausedDuration = 0;
        this.achievements = this.initAchievements();
        this.currentEmotion = null;
        this.emotionIntensity = 5;
        this.voiceRecognition = null;
        this.meditationAudio = null;
        this.aiChatHistory = [];
        this.sentiment = null;
        this.tf = null;
        this.wellnessScore = 0;
        this.init();
    }

    // Enhanced initialization
    async init() {
        this.loadAchievements();
        this.updateStats();
        this.updateDateTime();
        this.loadJournalPrompt();
        this.loadRecentEntries();
        this.checkDailyStreak();
        this.displayAchievements();
        this.initializeEmotionWheel();
        this.initializeCharts();
        this.initializeAI();
        this.calculateWellnessScore();
        this.loadCommunityData();
        this.setupEventListeners();
        this.checkNotifications();
        
        // Load TensorFlow.js
        if (typeof tf !== 'undefined') {
            this.tf = tf;
            await this.loadAIModels();
        }
        
        // Load sentiment analysis
        if (typeof Sentiment !== 'undefined') {
            this.sentiment = new Sentiment();
        }
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
        
        // Auto-save every 5 minutes
        setInterval(() => this.saveData(), 300000);
        
        // Update wellness metrics every hour
        setInterval(() => this.updateWellnessMetrics(), 3600000);
        
        // Check for mood reminder
        this.setupMoodReminders();
    }

    // Initialize enhanced achievements
    initAchievements() {
        return {
            firstMood: { id: 'firstMood', name: 'First Step', description: 'Track your first mood', icon: '🌱', unlocked: false, xp: 10 },
            weekStreak: { id: 'weekStreak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, xp: 50 },
            monthStreak: { id: 'monthStreak', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '💎', unlocked: false, xp: 200 },
            tenMoods: { id: 'tenMoods', name: 'Mood Master', description: 'Track 10 moods', icon: '📊', unlocked: false, xp: 30 },
            fiftyMoods: { id: 'fiftyMoods', name: 'Emotion Expert', description: 'Track 50 moods', icon: '🎯', unlocked: false, xp: 100 },
            firstJournal: { id: 'firstJournal', name: 'Dear Diary', description: 'Write your first journal entry', icon: '📝', unlocked: false, xp: 15 },
            longJournal: { id: 'longJournal', name: 'Wordsmith', description: 'Write a 500+ word journal entry', icon: '📚', unlocked: false, xp: 40 },
            breathingPro: { id: 'breathingPro', name: 'Breathing Pro', description: 'Complete 5 breathing sessions', icon: '🌬️', unlocked: false, xp: 25 },
            meditationMaster: { id: 'meditationMaster', name: 'Meditation Master', description: 'Complete 10 meditation sessions', icon: '🧘', unlocked: false, xp: 60 },
            earlyBird: { id: 'earlyBird', name: 'Early Bird', description: 'Track mood before 9 AM', icon: '🌅', unlocked: false, xp: 20 },
            nightOwl: { id: 'nightOwl', name: 'Night Owl', description: 'Track mood after 9 PM', icon: '🌙', unlocked: false, xp: 20 },
            moodExplorer: { id: 'moodExplorer', name: 'Mood Explorer', description: 'Use all emotion categories', icon: '🎭', unlocked: false, xp: 35 },
            consistentUser: { id: 'consistentUser', name: 'Consistent User', description: 'Use app 3 days in a row', icon: '⭐', unlocked: false, xp: 25 },
            zenMaster: { id: 'zenMaster', name: 'Zen Master', description: '30 minutes of breathing exercises', icon: '☮️', unlocked: false, xp: 80 },
            communityHelper: { id: 'communityHelper', name: 'Community Helper', description: 'Help 5 community members', icon: '🤝', unlocked: false, xp: 45 },
            insightfulUser: { id: 'insightfulUser', name: 'Insightful', description: 'View analytics 10 times', icon: '💡', unlocked: false, xp: 30 },
            sleepChampion: { id: 'sleepChampion', name: 'Sleep Champion', description: 'Log 7 nights of good sleep', icon: '😴', unlocked: false, xp: 50 },
            wellnessWarrior: { id: 'wellnessWarrior', name: 'Wellness Warrior', description: 'Achieve 80+ wellness score', icon: '🏆', unlocked: false, xp: 100 }
        };
    }

    // Enhanced data structure
    loadData() {
        const savedData = localStorage.getItem('mindfulme_pro_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            // Convert arrays back to Sets
            if (data.usedMoodValues && Array.isArray(data.usedMoodValues)) {
                data.usedMoodValues = new Set(data.usedMoodValues);
            }
            if (data.usedEmotions && Array.isArray(data.usedEmotions)) {
                data.usedEmotions = new Set(data.usedEmotions);
            }
            return data;
        }
        return {
            moods: [],
            journals: [],
            breathingSessions: [],
            meditationSessions: [],
            sleepLogs: [],
            communityPosts: [],
            aiConversations: [],
            lastVisit: new Date().toDateString(),
            streak: 1,
            totalXP: 0,
            level: 1,
            usedMoodValues: new Set(),
            usedEmotions: new Set(),
            puzzlesCompleted: 0,
            preferences: {
                reminderTime: '09:00',
                theme: 'dark',
                notifications: true,
                soundEnabled: true,
                privacyMode: false
            },
            analytics: {
                moodPatterns: {},
                sleepPatterns: {},
                factorCorrelations: {},
                weeklyTrends: []
            }
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Smooth scroll on navigation
        document.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-btn') && !e.target.closest('.notification-panel')) {
                document.getElementById('notificationPanel').classList.remove('active');
            }
            if (!e.target.closest('.user-avatar') && !e.target.closest('.profile-dropdown')) {
                document.getElementById('profileDropdown').classList.remove('active');
            }
        });

        // Auto-resize journal textarea
        const journalEditor = document.getElementById('journalEditor');
        if (journalEditor) {
            journalEditor.addEventListener('input', () => {
                this.updateJournalStats();
            });
        }

        // Voice recognition for journal
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;
            this.voiceRecognition.lang = 'en-US';
        }

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

    // Initialize emotion wheel
    initializeEmotionWheel() {
        const canvas = document.getElementById('emotionWheelCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 180;

        // Define emotions with colors
        const emotions = [
            { name: 'Joy', color: '#FFD93D', subcategories: ['Happy', 'Excited', 'Grateful', 'Proud'] },
            { name: 'Sadness', color: '#6C7A9C', subcategories: ['Disappointed', 'Lonely', 'Grief', 'Despair'] },
            { name: 'Anger', color: '#E74C3C', subcategories: ['Frustrated', 'Irritated', 'Furious', 'Resentful'] },
            { name: 'Fear', color: '#9B59B6', subcategories: ['Anxious', 'Worried', 'Scared', 'Nervous'] },
            { name: 'Surprise', color: '#3498DB', subcategories: ['Shocked', 'Amazed', 'Confused', 'Startled'] },
            { name: 'Disgust', color: '#27AE60', subcategories: ['Contempt', 'Revolted', 'Disapproval', 'Offended'] }
        ];

        // Draw emotion wheel
        const angleStep = (Math.PI * 2) / emotions.length;
        
        emotions.forEach((emotion, index) => {
            const startAngle = index * angleStep - Math.PI / 2;
            const endAngle = (index + 1) * angleStep - Math.PI / 2;

            // Draw main emotion
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = emotion.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw subcategories
            const subAngleStep = angleStep / emotion.subcategories.length;
            emotion.subcategories.forEach((sub, subIndex) => {
                const subStartAngle = startAngle + subIndex * subAngleStep;
                const subEndAngle = startAngle + (subIndex + 1) * subAngleStep;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius * 0.6, subStartAngle, subEndAngle);
                ctx.closePath();
                ctx.fillStyle = this.adjustBrightness(emotion.color, -20);
                ctx.fill();
                ctx.stroke();
            });

            // Draw emotion labels
            const labelAngle = startAngle + angleStep / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.8);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.8);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emotion.name, labelX, labelY);
        });

        // Add click handler
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate clicked emotion
            const dx = x - centerX;
            const dy = y - centerY;
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
            const emotionIndex = Math.floor(normalizedAngle / angleStep);
            
            if (emotionIndex >= 0 && emotionIndex < emotions.length) {
                this.selectEmotion(emotions[emotionIndex]);
            }
        });
    }

    // Helper function to adjust color brightness
    adjustBrightness(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Select emotion from wheel
    selectEmotion(emotion) {
        this.currentEmotion = emotion;
        document.getElementById('selectedEmotionText').textContent = `Selected: ${emotion.name}`;
        
        // Track used emotions
        if (!this.data.usedEmotions) {
            this.data.usedEmotions = new Set();
        }
        this.data.usedEmotions.add(emotion.name);
        
        // Show subcategory selection if needed
        // Add your subcategory UI here
    }

    // Update intensity display
    updateIntensityDisplay(value) {
        this.emotionIntensity = value;
        document.getElementById('intensityValue').textContent = value;
    }

    // Initialize charts
    initializeCharts() {
        // Mini mood chart on dashboard
        this.initializeMiniMoodChart();
        
        // Weekly overview chart
        this.initializeWeeklyOverview();
        
        // Initialize other charts as needed
    }

    // Mini mood chart
    initializeMiniMoodChart() {
        const canvas = document.getElementById('miniMoodChart');
        if (!canvas || !Chart) return;

        const ctx = canvas.getContext('2d');
        const last7Days = this.getLast7DaysMoods();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(d => d.date.toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    data: last7Days.map(d => d.average || 0),
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

    // Weekly overview chart
    initializeWeeklyOverview() {
        const canvas = document.getElementById('weeklyOverviewChart');
        if (!canvas || !Chart) return;

        const ctx = canvas.getContext('2d');
        const weekData = this.getWeeklyData();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: weekData.labels,
                datasets: [
                    {
                        label: 'Mood',
                        data: weekData.mood,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Energy',
                        data: weekData.energy,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Stress',
                        data: weekData.stress,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // Get weekly data for charts
    getWeeklyData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);

        const mood = [];
        const energy = [];
        const stress = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            
            // Get data for this day (simplified - you'd calculate from actual data)
            mood.push(Math.random() * 5 + 5);
            energy.push(Math.random() * 5 + 5);
            stress.push(Math.random() * 5 + 2);
        }

        return { labels: days, mood, energy, stress };
    }

    // Initialize AI components
    async initializeAI() {
        // Initialize TensorFlow models
        if (this.tf) {
            try {
                // Load pre-trained models (you would host these)
                // this.moodPredictionModel = await tf.loadLayersModel('/models/mood-prediction/model.json');
                // this.patternRecognitionModel = await tf.loadLayersModel('/models/pattern-recognition/model.json');
            } catch (error) {
                console.log('AI models not available, using fallback methods');
            }
        }

        // Initialize AI chat
        this.initializeAIChat();
    }

    // Initialize AI chat system
    initializeAIChat() {
        // Predefined responses for demo
        this.aiResponses = {
            greetings: [
                "Hello! How are you feeling today?",
                "Hi there! I'm here to listen and support you.",
                "Welcome back! What's on your mind?"
            ],
            anxiety: [
                "I understand you're feeling anxious. Let's work through this together. Can you tell me more about what's triggering these feelings?",
                "Anxiety can be overwhelming. Have you tried any breathing exercises today? They can help calm your nervous system.",
                "I hear you. Remember, anxiety is temporary and you have the strength to get through this. What usually helps you feel calmer?"
            ],
            depression: [
                "I'm sorry you're going through a difficult time. You're not alone in this. What's been weighing on your mind?",
                "Depression can make everything feel harder. Have you been able to do any small activities today that usually bring you comfort?",
                "Thank you for sharing with me. It takes courage to talk about these feelings. What's one small thing we could work on together today?"
            ],
            support: [
                "You're doing great by reaching out. Every step forward, no matter how small, is progress.",
                "I'm proud of you for taking care of your mental health. You're stronger than you know.",
                "Remember, it's okay to have difficult days. You're human, and you're doing your best."
            ]
        };
    }

   // Calculate wellness score
    calculateWellnessScore() {
        let score = 50; // Base score

        // Mood component (30%)
        if (this.data.moods.length > 0) {
            const recentMoods = this.data.moods.slice(-7);
            const avgMood = recentMoods.reduce((sum, m) => sum + (m.value || m.intensity || 3), 0) / recentMoods.length;
            score += (avgMood / 5) * 30;
        }

        // Activity component (20%)
        const recentActivities = this.getRecentActivities(7);
        const activityScore = Math.min(recentActivities.length / 7, 1) * 20;
        score += activityScore;

        // Sleep component (20%)
        if (this.data.sleepLogs && this.data.sleepLogs.length > 0) {
            const recentSleep = this.data.sleepLogs.slice(-7);
            const avgSleepQuality = recentSleep.reduce((sum, s) => {
                const quality = { excellent: 4, good: 3, fair: 2, poor: 1 };
                return sum + (quality[s.quality] || 2);
            }, 0) / recentSleep.length;
            score += (avgSleepQuality / 4) * 20;
        }

        // Consistency component (15%)
        const consistencyScore = Math.min(this.data.streak / 30, 1) * 15;
        score += consistencyScore;

        // Social/Community component (15%)
        const communityEngagement = this.getCommunityEngagement();
        score += Math.min(communityEngagement / 10, 1) * 15;

        this.wellnessScore = Math.round(score);
        return this.wellnessScore;
    }

    // Get recent activities
    getRecentActivities(days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const activities = [
            ...this.data.moods.filter(m => new Date(m.date) > cutoff),
            ...this.data.journals.filter(j => new Date(j.date) > cutoff),
            ...this.data.breathingSessions.filter(b => new Date(b.date) > cutoff),
            ...(this.data.meditationSessions || []).filter(m => new Date(m.date) > cutoff)
        ];
        
        return activities;
    }

    // Get community engagement score
    getCommunityEngagement() {
        // Calculate based on community interactions
        const posts = this.data.communityPosts || [];
        const recentPosts = posts.filter(p => {
            const postDate = new Date(p.date);
            const daysSince = (new Date() - postDate) / (1000 * 60 * 60 * 24);
            return daysSince <= 30;
        });
        return recentPosts.length;
    }

    // Update wellness metrics
    updateWellnessMetrics() {
        this.calculateWellnessScore();
        
        // Update UI
        const mentalBattery = document.getElementById('mentalBattery');
        if (mentalBattery) {
            mentalBattery.textContent = this.wellnessScore;
        }
        
        // Check wellness achievement
        if (this.wellnessScore >= 80 && !this.achievements.wellnessWarrior.unlocked) {
            this.achievements.wellnessWarrior.unlocked = true;
            this.showAchievement(this.achievements.wellnessWarrior);
            this.saveAchievements();
        }
    }

    // Enhanced mood saving with emotion wheel data
    async saveMood() {
        if (!this.currentEmotion && !this.currentMood) {
            this.showMessage('Please select an emotion from the wheel', 'error');
            return;
        }
        
        const moodNote = document.getElementById('moodNote').value;
        const moodEntry = {
            emotion: this.currentEmotion,
            intensity: this.emotionIntensity,
            value: this.currentMood,
            factors: [...this.selectedFactors],
            note: moodNote,
            date: new Date().toISOString(),
            sentiment: null
        };
        
        // Analyze sentiment if note exists
        if (moodNote && this.sentiment) {
            const analysis = this.sentiment.analyze(moodNote);
            moodEntry.sentiment = {
                score: analysis.score,
                comparative: analysis.comparative,
                positive: analysis.positive,
                negative: analysis.negative
            };
        }
        
        this.data.moods.push(moodEntry);
        
        // Update analytics
        this.updateMoodAnalytics(moodEntry);
        
        // Check time-based achievements
        const hour = new Date().getHours();
        this.checkTimeBasedAchievements(hour);
        
        // AI suggestions based on mood
        if (this.currentEmotion && (this.currentEmotion.name === 'Sadness' || this.currentEmotion.name === 'Fear')) {
            this.showAISuggestion();
        }
        
        this.saveData();
        this.updateStats();
        this.checkAchievements();
        
        // Reset form
        this.resetMoodForm();
        
        // Show success with animation
        this.showMessage('Mood saved successfully! Keep up the great work! 🌟', 'success');
        
        // Update mood timeline
        this.updateMoodTimeline();
        
        setTimeout(() => {
            showPage('home');
        }, 1500);
    }

    // Update mood analytics
    updateMoodAnalytics(moodEntry) {
        const date = new Date(moodEntry.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const hour = date.getHours();
        
        // Update patterns
        if (!this.data.analytics.moodPatterns[dayOfWeek]) {
            this.data.analytics.moodPatterns[dayOfWeek] = [];
        }
        this.data.analytics.moodPatterns[dayOfWeek].push(moodEntry.intensity);
        
        // Update factor correlations
        moodEntry.factors.forEach(factor => {
            if (!this.data.analytics.factorCorrelations[factor]) {
                this.data.analytics.factorCorrelations[factor] = [];
            }
            this.data.analytics.factorCorrelations[factor].push(moodEntry.intensity);
        });
    }

    // Show AI suggestion based on mood
    showAISuggestion() {
        const suggestions = [
            { activity: 'breathing', text: 'Try a calming breathing exercise', icon: '🌬️' },
            { activity: 'meditation', text: 'A short meditation might help', icon: '🧘' },
            { activity: 'journal', text: 'Writing about your feelings can provide clarity', icon: '📝' },
            { activity: 'community', text: 'Connect with others who understand', icon: '👥' }
        ];
        
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        const aiInsight = document.getElementById('aiInsight');
        
        if (aiInsight) {
            aiInsight.innerHTML = `
                ${suggestion.icon} Based on your current mood, ${suggestion.text}. 
                Remember, it's okay to feel this way, and you're taking positive steps by tracking your emotions.
            `;
        }
    }

    // Update mood timeline
    updateMoodTimeline() {
        const timeline = document.getElementById('moodTimeline');
        if (!timeline) return;
        
        const recentMoods = this.data.moods.slice(-5).reverse();
        
        timeline.innerHTML = recentMoods.map(mood => {
            const date = new Date(mood.date);
            const emotion = mood.emotion || { name: 'Unknown', color: '#6366f1' };
            
            return `
                <div class="timeline-entry fade-in">
                    <div class="timeline-marker" style="background: ${emotion.color}"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-emotion">${emotion.name}</span>
                            <span class="timeline-time">${this.formatRelativeTime(date)}</span>
                        </div>
                        <div class="timeline-intensity">Intensity: ${mood.intensity}/10</div>
                        ${mood.note ? `<div class="timeline-note">${mood.note}</div>` : ''}
                        ${mood.factors.length > 0 ? `
                            <div class="timeline-factors">
                                ${mood.factors.map(f => `<span class="factor-tag">${f}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Format relative time
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    // Enhanced breathing exercise with biofeedback simulation
    startBreathingExercise(type) {
        const exercises = {
            'coherent': {
                name: 'Coherent Breathing',
                pattern: [5, 0, 5, 0],
                cycles: 10,
                description: 'Breathe at 5 breaths per minute for optimal heart rate variability'
            },
            'wim-hof': {
                name: 'Wim Hof Method',
                pattern: [2, 0, 1, 1],
                cycles: 30,
                description: 'Power breathing followed by breath retention'
            },
            'pranayama': {
                name: 'Pranayama',
                pattern: [4, 4, 4, 4],
                cycles: 12,
                description: 'Ancient yogic breathing for balance'
            }
        };
        
        this.currentBreathingExercise = exercises[type];
        document.getElementById('breathingInterface').style.display = 'block';
        document.querySelector('.breathing-selection').style.display = 'none';
        
        document.getElementById('breathingTitle').textContent = this.currentBreathingExercise.name;
        
        this.startBreathingSession();
    }

    // Start breathing session with enhanced visualization
    startBreathingSession() {
        this.breathingActive = true;
        this.breathCycles = 0;
        this.sessionStartTime = Date.now();
        
        const phases = this.currentBreathingExercise.pattern;
        let currentPhase = 0;
        
        const breathingCycle = () => {
            if (!this.breathingActive) return;
            
            const phaseDuration = phases[currentPhase] * 1000;
            const phaseNames = ['Inhale', 'Hold', 'Exhale', 'Hold'];
            
            // Update UI
            document.getElementById('breathPhase').textContent = phaseNames[currentPhase];
            document.getElementById('breathCount').textContent = phases[currentPhase];
            
            // Animate breathing circle
            this.animateBreathingCircle(currentPhase, phaseDuration);
            
            // Countdown
            let timeLeft = phases[currentPhase];
            const countdown = setInterval(() => {
                timeLeft -= 0.1;
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    currentPhase = (currentPhase + 1) % 4;
                    
                    if (currentPhase === 0) {
                        this.breathCycles++;
                        this.updateBreathingMetrics();
                        
                        if (this.breathCycles >= this.currentBreathingExercise.cycles) {
                            this.completeBreathingSession();
                            return;
                        }
                    }
                    
                    breathingCycle();
                } else {
                    document.getElementById('breathCount').textContent = timeLeft.toFixed(1);
                }
            }, 100);
        };
        
        breathingCycle();
    }

    // Animate breathing circle
    animateBreathingCircle(phase, duration) {
        const circle = document.querySelector('.breath-progress');
        if (!circle) return;
        
        const circumference = 2 * Math.PI * 180;
        circle.style.strokeDasharray = circumference;
        
        if (phase === 0 || phase === 2) { // Inhale or Exhale
            circle.style.transition = `stroke-dashoffset ${duration}ms linear`;
            circle.style.strokeDashoffset = phase === 0 ? 0 : circumference;
        }
    }

    // Update breathing metrics
    updateBreathingMetrics() {
        const elapsed = (Date.now() - this.sessionStartTime) / 1000;
        const bpm = (this.breathCycles / elapsed) * 60;
        
        document.getElementById('breathsPerMinute').textContent = bpm.toFixed(1);
        document.getElementById('sessionDuration').textContent = this.formatDuration(elapsed);
        
        // Simulate heart coherence
        const coherence = Math.min(100, this.breathCycles * 10);
        document.getElementById('heartCoherence').textContent = coherence + '%';
    }

    // Complete breathing session
    completeBreathingSession() {
        this.breathingActive = false;
        const duration = (Date.now() - this.sessionStartTime) / 1000;
        
        const session = {
            type: this.currentBreathingExercise.name,
            duration: duration,
            cycles: this.breathCycles,
            date: new Date().toISOString()
        };
        
        this.data.breathingSessions.push(session);
        this.saveData();
        this.checkAchievements();
        
        // Show completion message
        this.showMessage(`Great job! You completed ${this.breathCycles} breathing cycles. 🌟`, 'success');
        
        // Reset UI
        setTimeout(() => {
            document.getElementById('breathingInterface').style.display = 'none';
            document.querySelector('.breathing-selection').style.display = 'grid';
        }, 2000);
    }

    // Enhanced journal with AI analysis
    async analyzeAndSave() {
        const content = document.getElementById('journalEditor').innerText.trim();
        if (!content) {
            this.showMessage('Please write something before analyzing', 'error');
            return;
        }
        
        // Show loading
        this.showLoading(true);
        
        // Perform sentiment analysis
        let analysis = {
            sentiment: null,
            themes: [],
            suggestions: []
        };
        
        if (this.sentiment) {
            const sentimentResult = this.sentiment.analyze(content);
            analysis.sentiment = {
                score: sentimentResult.score,
                comparative: sentimentResult.comparative,
                positive: sentimentResult.positive.slice(0, 5),
                negative: sentimentResult.negative.slice(0, 5)
            };
        }
        
        // Extract themes (simplified version)
        analysis.themes = this.extractThemes(content);
        
        // Generate suggestions
        analysis.suggestions = this.generateJournalSuggestions(analysis);
        
        // Save journal entry
        const entry = {
            content: content,
            analysis: analysis,
            tags: [...this.currentTags],
            wordCount: content.split(/\s+/).length,
            date: new Date().toISOString(),
            mood: document.querySelector('.mood-select').value
        };
        
        this.data.journals.push(entry);
        this.saveData();
        this.updateStats();
        this.checkAchievements();
        
        // Show analysis results
        this.showJournalAnalysis(analysis);
        
        // Update journal stats
        this.updateJournalStats();
        
        this.showLoading(false);
        
        // Check for long journal achievement
        if (entry.wordCount >= 500 && !this.achievements.longJournal.unlocked) {
            this.achievements.longJournal.unlocked = true;
            this.showAchievement(this.achievements.longJournal);
        }
    }

    // Extract themes from journal content
    extractThemes(content) {
        const themes = [];
        const themeKeywords = {
            'Growth': ['grow', 'learn', 'improve', 'better', 'progress'],
            'Gratitude': ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
            'Challenges': ['difficult', 'hard', 'struggle', 'challenge', 'problem'],
            'Relationships': ['friend', 'family', 'love', 'relationship', 'people'],
            'Work': ['work', 'job', 'career', 'project', 'task'],
            'Health': ['health', 'exercise', 'sleep', 'energy', 'tired'],
            'Emotions': ['feel', 'emotion', 'happy', 'sad', 'angry', 'anxious']
        };
        
        const lowerContent = content.toLowerCase();
        
        Object.entries(themeKeywords).forEach(([theme, keywords]) => {
            const matches = keywords.filter(keyword => lowerContent.includes(keyword));
            if (matches.length > 0) {
                themes.push(theme);
            }
        });
        
        return themes.slice(0, 3); // Return top 3 themes
    }

    // Generate journal suggestions
    generateJournalSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.sentiment && analysis.sentiment.comparative < -0.5) {
            suggestions.push({
                icon: '💙',
                text: 'Your journal shows some challenging emotions. Consider trying a mood-lifting activity or reaching out to someone you trust.'
            });
        }
        
        if (analysis.themes.includes('Challenges')) {
            suggestions.push({
                icon: '💪',
                text: 'You\'re facing challenges head-on. Remember to celebrate small victories and be kind to yourself.'
            });
        }
        
        if (analysis.themes.includes('Gratitude')) {
            suggestions.push({
                icon: '🙏',
                text: 'Practicing gratitude is powerful! Keep nurturing this positive mindset.'
            });
        }
        
        if (suggestions.length === 0) {
            suggestions.push({
                icon: '✨',
                text: 'Keep up the great journaling habit! Regular reflection helps build self-awareness.'
            });
        }
        
        return suggestions;
    }

    // Show journal analysis results
    showJournalAnalysis(analysis) {
        const analysisDiv = document.getElementById('aiAnalysis');
        if (!analysisDiv) return;
        
        analysisDiv.style.display = 'block';
        
        // Update sentiment meter
        if (analysis.sentiment) {
            const sentimentScore = (analysis.sentiment.comparative + 5) * 10; // Normalize to 0-100
            document.getElementById('sentimentFill').style.width = `${Math.max(0, Math.min(100, sentimentScore))}%`;
            
            const sentimentText = sentimentScore > 60 ? 'Positive' : sentimentScore > 40 ? 'Neutral' : 'Challenging';
            document.getElementById('sentimentText').textContent = `Your journal tone is ${sentimentText}`;
        }
        
        // Update themes
        const themeTags = document.getElementById('themeTags');
        themeTags.innerHTML = analysis.themes.map(theme => 
            `<span>${theme}</span>`
        ).join('');
        
        // Update suggestions
        const suggestionList = document.getElementById('suggestionList');
        suggestionList.innerHTML = analysis.suggestions.map(suggestion => 
            `<div>${suggestion.icon} ${suggestion.text}</div>`
        ).join('');
    }

    // Update journal statistics
    updateJournalStats() {
        // Calculate total words
        const totalWords = this.data.journals.reduce((sum, entry) => sum + entry.wordCount, 0);
        document.getElementById('totalWords').textContent = totalWords.toLocaleString();
        
        // Calculate insights found
        const insightsCount = this.data.journals.filter(entry => 
            entry.analysis && entry.analysis.themes.length > 0
        ).length;
        document.getElementById('insightsFound').textContent = insightsCount;
        
        // Calculate positivity score
        const sentiments = this.data.journals
            .filter(entry => entry.analysis && entry.analysis.sentiment)
            .map(entry => entry.analysis.sentiment.comparative);
        
        if (sentiments.length > 0) {
            const avgSentiment = sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
            const positivityScore = Math.round((avgSentiment + 5) * 10);
            document.getElementById('sentimentScore').textContent = `${positivityScore}%`;
        }
    }

    // Start meditation session
    startMeditation(type) {
        const meditations = {
            'calm-waters': {
                name: 'Calm Waters',
                duration: 600,
                audio: 'calm-waters.mp3',
                category: 'anxiety'
            },
            'peaceful-night': {
                name: 'Peaceful Night',
                duration: 1200,
                audio: 'peaceful-night.mp3',
                category: 'sleep'
            },
            'laser-focus': {
                name: 'Laser Focus',
                duration: 900,
                audio: 'laser-focus.mp3',
                category: 'focus'
            }
        };
        
        this.currentMeditation = meditations[type];
        this.meditationStartTime = Date.now();
        
        // Show player
        document.getElementById('meditationPlayer').style.display = 'block';
        document.getElementById('currentMeditationTitle').textContent = this.currentMeditation.name;
        document.getElementById('totalTime').textContent = this.formatDuration(this.currentMeditation.duration);
        
        // Start meditation
        this.startMeditationTimer();
        
        // In a real app, you would play audio here
        // this.meditationAudio = new Audio(`/audio/${this.currentMeditation.audio}`);
        // this.meditationAudio.play();
    }

    // Start meditation timer
    startMeditationTimer() {
        this.meditationTimer = setInterval(() => {
            const elapsed = (Date.now() - this.meditationStartTime) / 1000;
            const progress = (elapsed / this.currentMeditation.duration) * 100;
            
            document.getElementById('currentTime').textContent = this.formatDuration(elapsed);
            document.getElementById('meditationProgress').style.width = `${progress}%`;
            
            if (elapsed >= this.currentMeditation.duration) {
                this.completeMeditation();
            }
        }, 100);
    }

    // Complete meditation
    completeMeditation() {
        clearInterval(this.meditationTimer);
        
        const session = {
            type: this.currentMeditation.name,
            duration: this.currentMeditation.duration,
            category: this.currentMeditation.category,
            date: new Date().toISOString()
        };
        
        if (!this.data.meditationSessions) {
            this.data.meditationSessions = [];
        }
        this.data.meditationSessions.push(session);
        
        this.saveData();
        this.updateStats();
        
        // Check meditation achievement
        if (this.data.meditationSessions.length >= 10 && !this.achievements.meditationMaster.unlocked) {
            this.achievements.meditationMaster.unlocked = true;
            this.showAchievement(this.achievements.meditationMaster);
        }
        
        this.showMessage('Meditation completed! Great job on taking time for yourself. 🧘', 'success');
        
        // Close player
        setTimeout(() => {
            document.getElementById('meditationPlayer').style.display = 'none';
        }, 2000);
    }

    // AI Chat functionality
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        document.getElementById('typingIndicator').style.display = 'flex';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            document.getElementById('typingIndicator').style.display = 'none';
            this.addChatMessage(response, 'ai');
            
            // Save conversation
            this.data.aiConversations.push({
                user: message,
                ai: response,
                date: new Date().toISOString()
            });
            this.saveData();
        }, 1500);
    }

    // Add chat message to UI
    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message fade-in`;
        
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

    // Generate AI response (simplified for demo)
    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords
        if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
            return this.aiResponses.anxiety[Math.floor(Math.random() * this.aiResponses.anxiety.length)];
        }
        
        if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
            return this.aiResponses.depression[Math.floor(Math.random() * this.aiResponses.depression.length)];
        }
        
        if (lowerMessage.includes('thank') || lowerMessage.includes('better')) {
            return this.aiResponses.support[Math.floor(Math.random() * this.aiResponses.support.length)];
        }
        
        // Default response
        return "I hear you. Can you tell me more about what you're experiencing? I'm here to listen and support you.";
    }

    // Send quick response
    sendQuickResponse(response) {
        document.getElementById('chatInput').value = response;
        this.sendMessage();
    }

    // Community features
    loadCommunityData() {
        // Simulated community data
        this.communityData = {
            members: 2847,
            todayDiscussions: 156,
            supportRate: 98
        };
        
        // Update UI if on community page
        this.updateCommunityStats();
    }

    // Update community statistics
    updateCommunityStats() {
        // Update stats if elements exist
        const elements = {
            'communityMembers': this.communityData.members,
            'todayDiscussions': this.communityData.todayDiscussions,
            'supportRate': this.communityData.supportRate + '%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    // Sleep tracking
    logSleep() {
        const bedtime = document.getElementById('bedtime').value;
        const wakeTime = document.getElementById('wakeTime').value;
        const quality = document.getElementById('sleepQuality').value;
        const dreams = document.getElementById('dreams').value;
        
        if (!bedtime || !wakeTime) {
            this.showMessage('Please enter both bedtime and wake time', 'error');
            return;
        }
        
        // Calculate sleep duration
        const bedDate = new Date();
        const wakeDate = new Date();
        const [bedHour, bedMin] = bedtime.split(':');
        const [wakeHour, wakeMin] = wakeTime.split(':');
        
        bedDate.setHours(bedHour, bedMin);
        wakeDate.setHours(wakeHour, wakeMin);
        
        if (wakeDate < bedDate) {
            wakeDate.setDate(wakeDate.getDate() + 1);
        }
        
        const duration = (wakeDate - bedDate) / (1000 * 60 * 60);
        
        const sleepLog = {
            bedtime: bedtime,
            wakeTime: wakeTime,
            duration: duration,
            quality: quality,
            dreams: dreams,
            date: new Date().toISOString()
        };
        
        if (!this.data.sleepLogs) {
            this.data.sleepLogs = [];
        }
        this.data.sleepLogs.push(sleepLog);
        
        this.saveData();
        this.updateStats();
        this.checkAchievements();
        
        // Check sleep achievement
        const goodSleepNights = this.data.sleepLogs.filter(log => 
            log.quality === 'excellent' || log.quality === 'good'
        ).length;
        
        if (goodSleepNights >= 7 && !this.achievements.sleepChampion.unlocked) {
            this.achievements.sleepChampion.unlocked = true;
            this.showAchievement(this.achievements.sleepChampion);
        }
        
        this.showMessage('Sleep logged successfully! Sweet dreams lead to better days. 🌙', 'success');
        
        // Update sleep dashboard
        this.updateSleepDashboard();
    }

    // Update sleep dashboard
    updateSleepDashboard() {
        if (this.data.sleepLogs && this.data.sleepLogs.length > 0) {
            const lastNight = this.data.sleepLogs[this.data.sleepLogs.length - 1];
            
            // Update last night's sleep
            const hoursElement = document.querySelector('.hours');
            if (hoursElement) {
                hoursElement.textContent = lastNight.duration.toFixed(1);
            }
            
            // Update sleep quality
            const qualityElement = document.querySelector('.quality-score');
            if (qualityElement) {
                qualityElement.textContent = lastNight.quality.charAt(0).toUpperCase() + lastNight.quality.slice(1);
            }
            
            // Update 7-day average
            const last7Days = this.data.sleepLogs.slice(-7);
            const avgDuration = last7Days.reduce((sum, log) => sum + log.duration, 0) / last7Days.length;
            
            const avgElement = document.getElementById('avgSleepDuration');
            if (avgElement) {
                avgElement.textContent = avgDuration.toFixed(1) + ' hours';
            }
        }
    }

    // Analytics functions
    changePeriod(period) {
        this.currentAnalyticsPeriod = period;
        this.updateAnalyticsCharts();
        
        // Update UI
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    // Update analytics charts based on period
    updateAnalyticsCharts() {
        this.updateMoodPatternsChart();
        this.updateCorrelationMatrix();
        this.updateWellnessScoreTrend();
        this.generatePredictions();
    }

    // Update mood patterns chart
    updateMoodPatternsChart() {
        const canvas = document.getElementById('moodPatternsChart');
        if (!canvas || !Chart) return;

        const ctx = canvas.getContext('2d');
        const data = this.getMoodPatternData();

        // Destroy existing chart if any
        if (this.moodPatternsChartInstance) {
            this.moodPatternsChartInstance.destroy();
        }

        this.moodPatternsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Mood Intensity',
                    data: data.values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Intensity: ${context.parsed.y}/10`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // Get mood pattern data based on period
    getMoodPatternData() {
        const period = this.currentAnalyticsPeriod || 'month';
        const now = new Date();
        let startDate = new Date();
        let labels = [];
        let values = [];

        switch(period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                for (let i = 0; i < 7; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                    
                    // Get mood for this day
                    const dayMoods = this.data.moods.filter(mood => {
                        const moodDate = new Date(mood.date);
                        return moodDate.toDateString() === date.toDateString();
                    });
                    
                    const avgIntensity = dayMoods.length > 0
                        ? dayMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / dayMoods.length
                        : null;
                    
                    values.push(avgIntensity);
                }
                break;
                
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                // Weekly averages for the month
                for (let week = 0; week < 4; week++) {
                    const weekStart = new Date(startDate);
                    weekStart.setDate(startDate.getDate() + (week * 7));
                    labels.push(`Week ${week + 1}`);
                    
                    const weekMoods = this.data.moods.filter(mood => {
                        const moodDate = new Date(mood.date);
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 7);
                        return moodDate >= weekStart && moodDate < weekEnd;
                    });
                    
                    const avgIntensity = weekMoods.length > 0
                        ? weekMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / weekMoods.length
                        : null;
                    
                    values.push(avgIntensity);
                }
                break;
                
            case 'year':
                // Monthly averages for the year
                for (let month = 0; month < 12; month++) {
                    const monthDate = new Date(now.getFullYear(), month, 1);
                    labels.push(monthDate.toLocaleDateString('en-US', { month: 'short' }));
                    
                    const monthMoods = this.data.moods.filter(mood => {
                        const moodDate = new Date(mood.date);
                        return moodDate.getMonth() === month && moodDate.getFullYear() === now.getFullYear();
                    });
                    
                    const avgIntensity = monthMoods.length > 0
                        ? monthMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / monthMoods.length
                        : null;
                    
                    values.push(avgIntensity);
                }
                break;
        }

        return { labels, values };
    }

    // Update correlation matrix
    updateCorrelationMatrix() {
        const container = document.getElementById('correlationMatrix');
        if (!container) return;

        const factors = ['Sleep', 'Exercise', 'Social', 'Work', 'Stress'];
        const correlations = this.calculateCorrelations(factors);

        // Create visual matrix
        let html = '<div class="correlation-grid">';
        
        // Headers
        html += '<div></div>'; // Empty corner
        factors.forEach(factor => {
            html += `<div class="matrix-header">${factor}</div>`;
        });

        // Rows
        factors.forEach((factor1, i) => {
            html += `<div class="matrix-header">${factor1}</div>`;
            factors.forEach((factor2, j) => {
                const correlation = correlations[i][j];
                const intensity = Math.abs(correlation);
                const color = correlation > 0 ? '#10b981' : '#ef4444';
                
                html += `
                    <div class="correlation-cell" 
                         style="background: ${color}; opacity: ${intensity}"
                         title="${factor1} vs ${factor2}: ${(correlation * 100).toFixed(0)}%">
                    </div>
                `;
            });
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Calculate correlations between factors
    calculateCorrelations(factors) {
        const matrix = [];
        
        for (let i = 0; i < factors.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < factors.length; j++) {
                if (i === j) {
                    matrix[i][j] = 1;
                } else {
                    // Simplified correlation calculation
                    const moodsWithFactor1 = this.data.moods.filter(m => m.factors.includes(factors[i]));
                    const moodsWithFactor2 = this.data.moods.filter(m => m.factors.includes(factors[j]));
                    const moodsWithBoth = this.data.moods.filter(m => 
                        m.factors.includes(factors[i]) && m.factors.includes(factors[j])
                    );
                    
                    const correlation = moodsWithBoth.length / 
                        Math.sqrt(moodsWithFactor1.length * moodsWithFactor2.length) || 0;
                    
                    matrix[i][j] = correlation;
                }
            }
        }
        
        return matrix;
    }

    // Update wellness score trend
    updateWellnessScoreTrend() {
        // Update visual wellness score
        const scoreElement = document.querySelector('.score-value');
        if (scoreElement) {
            scoreElement.textContent = this.wellnessScore;
        }

        // Update progress ring
        const progressRing = document.querySelector('.score-progress');
        if (progressRing) {
            const circumference = 2 * Math.PI * 90;
            const offset = circumference - (this.wellnessScore / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }

        // Update breakdown
        this.updateWellnessBreakdown();
    }

    // Update wellness breakdown
    updateWellnessBreakdown() {
        const breakdowns = {
            'Mood': (this.calculateMoodScore() / 30) * 100,
            'Activity': (this.calculateActivityScore() / 20) * 100,
            'Sleep': (this.calculateSleepScore() / 20) * 100
        };

        Object.entries(breakdowns).forEach(([category, percentage]) => {
            const element = document.querySelector(`[data-category="${category}"] .progress-fill`);
            if (element) {
                element.style.width = `${percentage}%`;
            }
        });
    }

    // Calculate individual scores
    calculateMoodScore() {
        if (this.data.moods.length === 0) return 0;
        
        const recentMoods = this.data.moods.slice(-7);
        const avgIntensity = recentMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / recentMoods.length;
        return (avgIntensity / 10) * 30;
    }

    calculateActivityScore() {
        const recentActivities = this.getRecentActivities(7);
        return Math.min(recentActivities.length / 7, 1) * 20;
    }

    calculateSleepScore() {
        if (!this.data.sleepLogs || this.data.sleepLogs.length === 0) return 0;
        
        const recentSleep = this.data.sleepLogs.slice(-7);
        const avgQuality = recentSleep.reduce((sum, s) => {
            const quality = { excellent: 4, good: 3, fair: 2, poor: 1 };
            return sum + (quality[s.quality] || 2);
        }, 0) / recentSleep.length;
        
        return (avgQuality / 4) * 20;
    }

    // Generate AI predictions
    generatePredictions() {
        const predictions = [];

        // Analyze recent patterns
        if (this.data.moods.length >= 14) {
            const recentMoods = this.data.moods.slice(-14);
            const firstWeek = recentMoods.slice(0, 7);
            const secondWeek = recentMoods.slice(7);
            
            const firstWeekAvg = firstWeek.reduce((sum, m) => sum + (m.intensity || 5), 0) / firstWeek.length;
            const secondWeekAvg = secondWeek.reduce((sum, m) => sum + (m.intensity || 5), 0) / secondWeek.length;
            
            if (secondWeekAvg > firstWeekAvg) {
                predictions.push({
                    icon: 'fas fa-chart-line',
                    title: 'Positive Trend',
                    text: 'Your mood has been improving! Keep up the good habits.'
                });
            }
        }

        // Sleep pattern analysis
        if (this.data.sleepLogs && this.data.sleepLogs.length >= 7) {
            const avgSleepDuration = this.data.sleepLogs.slice(-7)
                .reduce((sum, log) => sum + log.duration, 0) / 7;
            
            if (avgSleepDuration < 7) {
                predictions.push({
                    icon: 'fas fa-exclamation-triangle',
                    title: 'Sleep Alert',
                    text: 'Your average sleep is below recommended. Try going to bed 30 minutes earlier.'
                });
            }
        }

        // Update UI
        const predictionsContainer = document.querySelector('.predictions');
        if (predictionsContainer && predictions.length > 0) {
            predictionsContainer.innerHTML = predictions.map(pred => `
                <div class="prediction-item">
                    <i class="${pred.icon}"></i>
                    <div>
                        <h4>${pred.title}</h4>
                        <p>${pred.text}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Generate reports
    async generateReport(type) {
        this.showLoading(true);
        
        const reportData = {
            type: type,
            generatedDate: new Date().toISOString(),
            period: this.currentAnalyticsPeriod || 'month',
            data: {}
        };

        switch(type) {
            case 'monthly':
                reportData.data = this.generateMonthlyReportData();
                break;
            case 'patterns':
                reportData.data = this.generatePatternsReportData();
                break;
            case 'progress':
                reportData.data = this.generateProgressReportData();
                break;
        }

        // In a real app, you would generate a PDF here
        this.showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated! Check your downloads.`, 'success');
        
        this.showLoading(false);
    }

    // Generate monthly report data
    generateMonthlyReportData() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthData = {
            moodEntries: this.data.moods.filter(m => new Date(m.date) >= monthStart).length,
            journalEntries: this.data.journals.filter(j => new Date(j.date) >= monthStart).length,
            breathingSessions: this.data.breathingSessions.filter(b => new Date(b.date) >= monthStart).length,
            averageMood: 0,
            topFactors: [],
            insights: []
        };

        // Calculate average mood
        const monthMoods = this.data.moods.filter(m => new Date(m.date) >= monthStart);
        if (monthMoods.length > 0) {
            monthData.averageMood = monthMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / monthMoods.length;
        }

        return monthData;
    }

    // Share with therapist functionality
    shareWithTherapist() {
        const therapistEmail = prompt('Enter your therapist\'s email address:');
        if (!therapistEmail) return;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(therapistEmail)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // In a real app, this would send an encrypted report
        this.showMessage(`Report will be securely shared with ${therapistEmail}`, 'success');
        
        // Log the share
        this.data.therapistShares = this.data.therapistShares || [];
        this.data.therapistShares.push({
            email: therapistEmail,
            date: new Date().toISOString(),
            reportType: 'comprehensive'
        });
        this.saveData();
    }

    // Notification system
    checkNotifications() {
        const notifications = [];
        
        // Check for mood reminder
        const lastMood = this.data.moods[this.data.moods.length - 1];
        if (!lastMood || this.hoursSince(new Date(lastMood.date)) > 24) {
            notifications.push({
                icon: 'fas fa-smile',
                title: 'Mood Check-in',
                message: 'Time for your daily mood check-in',
                action: () => showPage('mood')
            });
        }

        // Check for streak milestone
        if (this.data.streak % 7 === 0 && this.data.streak > 0) {
            notifications.push({
                icon: 'fas fa-fire',
                title: 'Streak Milestone!',
                message: `Amazing! ${this.data.streak} day streak!`,
                action: () => showPage('home')
            });
        }

        // Update notification count
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = notifications.length;
            notificationCount.style.display = notifications.length > 0 ? 'block' : 'none';
        }

        this.currentNotifications = notifications;
    }

    // Setup mood reminders
    setupMoodReminders() {
        // Check if it's time for a reminder
        const reminderTime = this.data.preferences.reminderTime;
        if (!reminderTime) return;

        const checkReminder = () => {
            const now = new Date();
            const [hour, minute] = reminderTime.split(':');
            const reminderDate = new Date();
            reminderDate.setHours(hour, minute, 0, 0);

            if (now.getHours() === parseInt(hour) && now.getMinutes() === parseInt(minute)) {
                this.showNotification('Time for your mood check-in!', {
                    body: 'Take a moment to reflect on how you\'re feeling',
                    icon: '/icon-192.png'
                });
            }
        };

        // Check every minute
        setInterval(checkReminder, 60000);
    }

    // Show browser notification
    showNotification(title, options) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, options);
        }
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showMessage('Notifications enabled! You\'ll receive helpful reminders.', 'success');
            }
        }
    }

    // Helper functions
    hoursSince(date) {
        return (new Date() - date) / (1000 * 60 * 60);
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

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

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('active', show);
    }

    resetMoodForm() {
        this.currentMood = null;
        this.currentEmotion = null;
        this.selectedFactors = [];
        this.emotionIntensity = 5;
        
        document.getElementById('moodNote').value = '';
        document.getElementById('selectedEmotionText').textContent = 'Click on the wheel to select';
        document.getElementById('moodIntensity').value = 5;
        document.getElementById('intensityValue').textContent = '5';
        
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.factor-chip').forEach(chip => chip.classList.remove('selected'));
    }

    // Export enhanced data
    exportAllData() {
        const exportData = {
            ...this.data,
            exportDate: new Date().toISOString(),
            version: '2.0',
            achievements: this.achievements
        };

        // Convert Sets to Arrays for export
        if (exportData.usedMoodValues instanceof Set) {
            exportData.usedMoodValues = Array.from(exportData.usedMoodValues);
        }
        if (exportData.usedEmotions instanceof Set) {
            exportData.usedEmotions = Array.from(exportData.usedEmotions);
        }

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindfulme_pro_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('Your data has been exported successfully!', 'success');
    }

    // Save data with error handling
    saveData() {
        try {
            const dataToSave = { ...this.data };
            
            // Convert Sets to Arrays for storage
            if (this.data.usedMoodValues instanceof Set) {
                dataToSave.usedMoodValues = Array.from(this.data.usedMoodValues);
            }
            if (this.data.usedEmotions instanceof Set) {
                dataToSave.usedEmotions = Array.from(this.data.usedEmotions);
            }
            
            localStorage.setItem('mindfulme_pro_data', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showMessage('Error saving data. Please try again.', 'error');
        }
    }
}

// Global functions for UI interactions
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Close mobile menu if open
    document.getElementById('navMenu').classList.remove('active');
    document.querySelector('.nav-toggle').classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show selected page
    const pageElement = document.querySelector(`.${page}`);
    if (pageElement) {
        pageElement.style.display = 'block';
        
        // Page-specific initialization
        switch(page) {
            case 'home':
                app.updateStats();
                app.calculateWellnessScore();
                app.initializeCharts();
                break;
            case 'insights':
                app.updateAnalyticsCharts();
                break;
            case 'community':
                app.updateCommunityStats();
                break;
            case 'journal':
                app.updateJournalStats();
                break;
            case 'sleep':
                app.updateSleepDashboard();
                break;
        }
    }
}

function toggleNav() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.querySelector('.nav-toggle');
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('active');
    document.getElementById('profileDropdown').classList.remove('active');
}

function toggleProfile() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
    document.getElementById('notificationPanel').classList.remove('active');
}

// Voice input functions
function switchToVoice() {
    document.getElementById('textInput').style.display = 'none';
    document.getElementById('voiceInput').style.display = 'block';
    document.querySelectorAll('.input-option').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function switchToText() {
    document.getElementById('voiceInput').style.display = 'none';
    document.getElementById('textInput').style.display = 'block';
    document.querySelectorAll('.input-option').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Filter functions
function filterMeditations(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const cards = document.querySelectorAll('.meditation-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterJournals(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Implement journal filtering logic
    app.filterJournalHistory(filter);
}

// Meditation controls
function closeMeditationPlayer() {
    document.getElementById('meditationPlayer').style.display = 'none';
    if (app.meditationTimer) {
        clearInterval(app.meditationTimer);
    }
}

function togglePlayPause() {
    const icon = document.getElementById('playPauseIcon');
    if (icon.classList.contains('fa-pause')) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        // Pause meditation
    } else {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        // Resume meditation
    }
}

// Breathing controls
function toggleBreathing() {
    const icon = document.getElementById('breathingPlayPause');
    if (app.breathingActive) {
        app.breathingActive = false;
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    } else {
        app.startBreathingSession();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
}

function adjustBreathingSpeed(speed) {
    app.breathingSpeed = parseFloat(speed);
}

function backToBreathingSelection() {
    document.getElementById('breathingInterface').style.display = 'none';
    document.querySelector('.breathing-selection').style.display = 'grid';
    app.breathingActive = false;
}

// Journal functions
function formatText(command) {
    document.execCommand(command, false, null);
}

function insertEmoji() {
    const emojis = ['😊', '😢', '😰', '🎉', '😌', '💪', '❤️', '🙏'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    document.execCommand('insertText', false, emoji);
}

function usePrompt(element) {
    const prompt = element.querySelector('p').textContent;
    const editor = document.getElementById('journalEditor');
    editor.focus();
    document.execCommand('insertText', false, prompt + ' ');
}

// Settings functions
function showSettings() {
    // Implement settings page
    app.showMessage('Settings page coming soon!', 'info');
}

function showPrivacy() {
    // Implement privacy page
    app.showMessage('Privacy settings coming soon!', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout? Your data will be saved locally.')) {
        app.showMessage('Logged out successfully!', 'success');
        // In a real app, handle authentication
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MindfulMeProApp();
    
    // Show home page by default
    showPage('home');
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            app.requestNotificationPermission();
        }, 5000);
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initialize service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service worker registration failed:', err);
        });
    }
});

// Prevent closing without saving
window.addEventListener('beforeunload', (e) => {
    app.saveData();
});

// End of enhanced app.js
