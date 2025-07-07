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
        
        // Sentiment analysis disabled for browser compatibility
        this.sentiment = null;
        
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

    // Load achievements
    loadAchievements() {
        const saved = localStorage.getItem('mindfulme_achievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            Object.keys(savedAchievements).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = savedAchievements[key].unlocked;
                }
            });
        }
    }

    // Save achievements
    saveAchievements() {
        localStorage.setItem('mindfulme_achievements', JSON.stringify(this.achievements));
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

    // Get last 7 days moods
    getLast7DaysMoods() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayMoods = this.data.moods.filter(mood => 
                new Date(mood.date).toDateString() === dateStr
            );
            
            days.push({
                date: date,
                moods: dayMoods,
                average: dayMoods.length > 0 
                    ? dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length 
                    : 0,
                count: dayMoods.length
            });
        }
        
        return days;
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

    // Load AI models placeholder
    async loadAIModels() {
        // Placeholder for AI model loading
        console.log('AI models would be loaded here in production');
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

    // Update date/time display
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        const dateStr = now.toLocaleDateString('en-US', options);
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Update greeting
        const hour = now.getHours();
        let greeting = 'Good Morning';
        if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
        else if (hour >= 17) greeting = 'Good Evening';
        
        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
            greetingEl.innerHTML = `${greeting}, <span class="username">Friend</span>!`;
        }
        
        const dateTimeEl = document.getElementById('dateTime');
        if (dateTimeEl) {
            dateTimeEl.textContent = `${dateStr} • ${timeStr}`;
        }
        
        const moodCheckTime = document.getElementById('moodCheckTime');
        if (moodCheckTime) {
            moodCheckTime.textContent = `${dateStr} at ${timeStr}`;
        }
    }

    // Check and update daily streak
    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastVisit = new Date(this.data.lastVisit);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (this.data.lastVisit !== today) {
            if (daysDiff === 1) {
                this.data.streak++;
            } else if (daysDiff > 1) {
                this.data.streak = 1;
            }
            this.data.lastVisit = today;
            this.saveData();
        }
    }

    // Update statistics
    updateStats() {
        // Streak
        const streakEl = document.getElementById('streakDays');
        if (streakEl) streakEl.textContent = this.data.streak;
        
        const currentStreakEl = document.getElementById('currentStreak');
        if (currentStreakEl) currentStreakEl.textContent = this.data.streak;
        
        // Total entries
        const totalEntries = this.data.moods.length + this.data.journals.length;
        const totalEntriesEl = document.getElementById('totalEntries');
        if (totalEntriesEl) totalEntriesEl.textContent = totalEntries;
        
        // Journal entries
        const journalEntriesEl = document.getElementById('journalEntries');
        if (journalEntriesEl) journalEntriesEl.textContent = this.data.journals.length;
        
        // Average mood
        if (this.data.moods.length > 0) {
            const avgMoodValue = this.data.moods.reduce((sum, mood) => sum + mood.value, 0) / this.data.moods.length;
            const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
            const avgMoodEl = document.getElementById('avgMood');
            if (avgMoodEl) avgMoodEl.textContent = moodEmojis[Math.round(avgMoodValue) - 1];
            
            const avgMoodScoreEl = document.getElementById('avgMoodScore');
            if (avgMoodScoreEl) avgMoodScoreEl.textContent = avgMoodValue.toFixed(1);
            
            // Current mood (today's last mood)
            const todayMoods = this.data.moods.filter(mood => {
                const moodDate = new Date(mood.date).toDateString();
                return moodDate === new Date().toDateString();
            });
            if (todayMoods.length > 0) {
                const currentMoodEmojiEl = document.getElementById('currentMoodEmoji');
                if (currentMoodEmojiEl) currentMoodEmojiEl.textContent = moodEmojis[todayMoods[todayMoods.length - 1].value - 1];
            }
        }
        
        // Mindful minutes
        const totalMinutes = this.data.breathingSessions.reduce((sum, session) => sum + Math.floor(session.duration / 60), 0);
        const mindfulMinutesEl = document.getElementById('mindfulMinutes');
        if (mindfulMinutesEl) mindfulMinutesEl.textContent = totalMinutes;
        
        // Weekly check-ins
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyCheckIns = this.data.breathingSessions.filter(session => new Date(session.date) >= weekAgo).length;
        const weeklyCheckInsEl = document.getElementById('weeklyCheckIns');
        if (weeklyCheckInsEl) weeklyCheckInsEl.textContent = weeklyCheckIns;
        
        // Mental battery
        const mentalBatteryEl = document.getElementById('mentalBattery');
        if (mentalBatteryEl) mentalBatteryEl.textContent = this.wellnessScore || 75;
        
        // Week trend
        const weekTrendEl = document.getElementById('weekTrend');
        if (weekTrendEl) weekTrendEl.textContent = '↑ 12%';
    }

    // Display achievements
    displayAchievements() {
        const container = document.getElementById('achievementCarousel');
        if (!container) return;

        const unlockedCount = Object.values(this.achievements).filter(a => a.unlocked).length;
        const totalCount = Object.values(this.achievements).length;

        container.innerHTML = Object.values(this.achievements).map(achievement => `
            <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}" 
                 title="${achievement.description}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                ${achievement.unlocked ? `<div class="achievement-xp">+${achievement.xp} XP</div>` : ''}
            </div>
        `).join('');
    }

    // Check achievements
    checkAchievements() {
        let newUnlock = false;

        // First mood
        if (this.data.moods.length >= 1 && !this.achievements.firstMood.unlocked) {
            this.achievements.firstMood.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.firstMood);
        }

        // Ten moods
        if (this.data.moods.length >= 10 && !this.achievements.tenMoods.unlocked) {
            this.achievements.tenMoods.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.tenMoods);
        }

        // Week streak
        if (this.data.streak >= 7 && !this.achievements.weekStreak.unlocked) {
            this.achievements.weekStreak.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.weekStreak);
        }

        // First journal
        if (this.data.journals.length >= 1 && !this.achievements.firstJournal.unlocked) {
            this.achievements.firstJournal.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.firstJournal);
        }

        // Breathing pro
        if (this.data.breathingSessions.length >= 5 && !this.achievements.breathingPro.unlocked) {
            this.achievements.breathingPro.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.breathingPro);
        }

        // Zen master (30 minutes breathing)
        const totalBreathingTime = this.data.breathingSessions.reduce((sum, session) => sum + session.duration, 0);
        if (totalBreathingTime >= 1800 && !this.achievements.zenMaster.unlocked) {
            this.achievements.zenMaster.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.zenMaster);
        }

        // Mood explorer
        if (this.data.usedMoodValues && this.data.usedMoodValues.size >= 5 && !this.achievements.moodExplorer.unlocked) {
            this.achievements.moodExplorer.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.moodExplorer);
        }

        // Consistent user (3 days in a row)
        if (this.data.streak >= 3 && !this.achievements.consistentUser.unlocked) {
            this.achievements.consistentUser.unlocked = true;
            newUnlock = true;
            this.showAchievement(this.achievements.consistentUser);
        }

        if (newUnlock) {
            this.saveAchievements();
            this.displayAchievements();
        }
    }

    // Show achievement notification
    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);

        // Add XP
        this.data.totalXP = (this.data.totalXP || 0) + achievement.xp;
        this.updateLevel();
    }

    // Update user level
    updateLevel() {
        const xpPerLevel = 100;
        const newLevel = Math.floor(this.data.totalXP / xpPerLevel) + 1;
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            this.showMessage(`Level Up! You're now level ${newLevel}!`, 'success');
        }
    }

    // Load journal prompt
    loadJournalPrompt() {
        const prompts = [
            "What are three things you're grateful for today?",
            "Describe a moment today that made you smile.",
            "What's one thing you learned about yourself recently?",
            "If today had a color, what would it be and why?",
            "What's something you're looking forward to?",
            "Describe how you're feeling right now in detail.",
            "What would you tell your younger self today?",
            "What small victory did you achieve today?",
            "What's been on your mind lately?",
            "How have you grown in the past month?"
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        const promptEl = document.getElementById('journalPrompt');
        if (promptEl) promptEl.textContent = randomPrompt;
    }

    // Load recent journal entries
    loadRecentEntries() {
        const container = document.getElementById('recentEntries');
        if (!container) return;
        
        const recent = this.data.journals.slice(-3).reverse();
        
        if (recent.length === 0) {
            container.innerHTML = '<p class="no-entries">No journal entries yet. Start writing!</p>';
            return;
        }
        
        container.innerHTML = recent.map(entry => {
            const date = new Date(entry.date);
            const preview = entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');
            
            return `
                <div class="recent-entry">
                    <div class="entry-date">${date.toLocaleDateString()}</div>
                    <div class="entry-preview">${preview}</div>
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Load community data
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
        // Implementation would update community stats
    }

    // Check notifications
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

    // Mood tracking methods
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

    // Toggle mood factor
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

    // Check time-based achievements
    checkTimeBasedAchievements(hour) {
        if (hour < 9 && !this.achievements.earlyBird.unlocked) {
            this.achievements.earlyBird.unlocked = true;
            this.showAchievement(this.achievements.earlyBird);
        }
        if (hour >= 21 && !this.achievements.nightOwl.unlocked) {
            this.achievements.nightOwl.unlocked = true;
            this.showAchievement(this.achievements.nightOwl);
        }
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
            const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
            
            return `
                <div class="timeline-entry fade-in">
                    <div class="timeline-marker" style="background: ${emotion.color || '#6366f1'}"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-emotion">${mood.value ? moodEmojis[mood.value - 1] : emotion.name}</span>
                            <span class="timeline-time">${this.formatRelativeTime(date)}</span>
                        </div>
                        ${mood.intensity ? `<div class="timeline-intensity">Intensity: ${mood.intensity}/10</div>` : ''}
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

    // Reset mood form
    resetMoodForm() {
        this.currentMood = null;
        this.currentEmotion = null;
        this.selectedFactors = [];
        this.emotionIntensity = 5;
        
        document.getElementById('moodNote').value = '';
        const selectedEmotionEl = document.getElementById('selectedEmotionText');
        if (selectedEmotionEl) selectedEmotionEl.textContent = 'Click on the wheel to select';
        
        const intensityEl = document.getElementById('moodIntensity');
        if (intensityEl) intensityEl.value = 5;
        
        const intensityValueEl = document.getElementById('intensityValue');
        if (intensityValueEl) intensityValueEl.textContent = '5';
        
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.factor-chip').forEach(chip => chip.classList.remove('selected'));
        
        const moodFactorsEl = document.querySelector('.mood-factors');
        if (moodFactorsEl) moodFactorsEl.style.display = 'none';
    }

    // Breathing exercise methods
    startBreathing(technique) {
        const techniques = {
            '478': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing' },
            'box': { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing' },
            'calm': { inhale: 3, hold: 0, exhale: 6, name: 'Calm Breathing' }
        };
        
        const selected = techniques[technique];
        this.currentTechnique = selected;
        this.sessionStartTime = Date.now();
        this.cycleCount = 0;
        this.isPaused = false;
        this.totalPausedDuration = 0;
        
        // Hide technique selection and show breathing exercise
        document.getElementById('breathingTechniques').style.display = 'none';
        document.getElementById('breathingContainer').style.display = 'block';
        
        // Update breathing container
        document.getElementById('breathingContainer').innerHTML = `
            <button class="btn btn-secondary" style="margin-bottom: 1rem;" onclick="app.backToTechniques()">
                <i class="fas fa-arrow-left"></i> Back to Techniques
            </button>
            <h3>${selected.name}</h3>
            <div class="breathing-stats">
                <div class="breathing-stat">
                    <span class="stat-label">Cycles</span>
                    <span class="stat-value" id="cycleCount">0</span>
                </div>
                <div class="breathing-stat">
                    <span class="stat-label">Session Time</span>
                    <span class="stat-value" id="sessionTime">0:00</span>
                </div>
            </div>
            <div class="breathing-visual">
                <div class="breathing-circle" id="breathingCircle">
                    <svg class="progress-ring" width="200" height="200">
                        <circle class="progress-ring-bg" cx="100" cy="100" r="90" />
                        <circle class="progress-ring-circle" cx="100" cy="100" r="90" />
                    </svg>
                    <div class="breathing-inner">
                        <div class="breathing-text" id="breathingText">Get Ready</div>
                        <div class="breathing-counter" id="breathingCounter"></div>
                    </div>
                </div>
            </div>
            <div class="breathing-progress">
                <div class="breathing-progress-bar" id="breathingProgress"></div>
            </div>
            <div class="breathing-controls">
                <button class="btn btn-secondary" onclick="app.pauseBreathing()" id="pauseBtn">Pause</button>
                <button class="btn btn-secondary" onclick="app.stopBreathing()">Stop</button>
            </div>
        `;
        
        // Start session timer
        this.sessionTimer = setInterval(() => this.updateSessionTimer(), 1000);
        
        // Start breathing cycle
        this.breathingCycle();
    }

    // Update session timer
    updateSessionTimer() {
        if (!this.isPaused && this.sessionStartTime) {
            const elapsed = Math.floor((Date.now() - this.sessionStartTime - this.totalPausedDuration) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('sessionTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Breathing cycle
    breathingCycle() {
        if (this.isPaused) return;
        
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const counter = document.getElementById('breathingCounter');
        const progress = document.getElementById('breathingProgress');
        const progressCircle = document.querySelector('.progress-ring-circle');
        
        const phases = [
            { 
                text: 'Breathe In', 
                duration: this.currentTechnique.inhale * 1000, 
                class: 'breathing-in',
                color: '#6366f1'
            },
            { 
                text: 'Hold', 
                duration: this.currentTechnique.hold * 1000, 
                class: 'breathing-hold',
                color: '#eab308'
            },
            { 
                text: 'Breathe Out', 
                duration: this.currentTechnique.exhale * 1000, 
                class: 'breathing-out',
                color: '#10b981'
            }
        ];
        
        if (this.currentTechnique.hold === 0) {
            phases.splice(1, 1); // Remove hold phase for calm breathing
        }
        
        let phaseIndex = 0;
        
        const runPhase = () => {
            if (this.isPaused) return;
            
            const phase = phases[phaseIndex];
            circle.className = 'breathing-circle ' + phase.class;
            text.textContent = phase.text;
            progress.style.background = phase.color;
            
            // Animate progress circle
            const circumference = 2 * Math.PI * 90;
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.stroke = phase.color;
            
            let timeLeft = phase.duration / 1000;
            counter.textContent = timeLeft.toFixed(1);
            
            // Smooth countdown
            progressCircle.style.strokeDashoffset = 0;
            progressCircle.style.transition = 'none';
            setTimeout(() => {
                progressCircle.style.transition = `stroke-dashoffset ${phase.duration}ms linear`;
                progressCircle.style.strokeDashoffset = circumference;
            }, 50);
            
            this.breathingTimer = setInterval(() => {
                if (this.isPaused) return;
                
                timeLeft -= 0.1;
                if (timeLeft <= 0) {
                    clearInterval(this.breathingTimer);
                    
                    phaseIndex++;
                    if (phaseIndex >= phases.length) {
                        phaseIndex = 0;
                        this.cycleCount++;
                        document.getElementById('cycleCount').textContent = this.cycleCount;
                        
                        // Check for milestone
                        if (this.cycleCount % 5 === 0) {
                            this.showMilestone(this.cycleCount);
                        }
                    }
                    
                    // Add small pause between phases
                    setTimeout(() => {
                        if (!this.isPaused) {
                            runPhase();
                        }
                    }, 200);
                } else {
                    counter.textContent = timeLeft.toFixed(1);
                }
            }, 100);
        };
        
        runPhase();
    }

    // Show milestone popup
    showMilestone(cycles) {
        const popup = document.createElement('div');
        popup.className = 'milestone-popup';
        popup.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-icon">🎉</div>
                <div class="milestone-text">Amazing! ${cycles} cycles completed!</div>
            </div>
        `;
        document.body.appendChild(popup);
        
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 2000);
    }

    // Pause breathing
    pauseBreathing() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (this.isPaused) {
            this.pausedTime = Date.now();
            clearInterval(this.breathingTimer);
        } else {
            this.totalPausedDuration += Date.now() - this.pausedTime;
            this.breathingCycle();
        }
    }

    // Stop breathing exercise
    stopBreathing() {
        clearInterval(this.breathingTimer);
        clearInterval(this.sessionTimer);
        
        if (this.sessionStartTime) {
            const duration = Math.floor((Date.now() - this.sessionStartTime - this.totalPausedDuration) / 1000);
            this.data.breathingSessions.push({
                technique: this.currentTechnique.name,
                duration: duration,
                cycles: this.cycleCount,
                date: new Date().toISOString()
            });
            this.saveData();
            this.updateStats();
            this.checkAchievements();
        }
        
        document.getElementById('breathingContainer').innerHTML = `
            <p>Great job! You completed ${this.cycleCount} cycles.</p>
            <button class="btn btn-primary" onclick="showPage('home')">Back to Home</button>
        `;
    }

    // Back to techniques
    backToTechniques() {
        this.stopBreathing();
        document.getElementById('breathingTechniques').style.display = 'grid';
        document.getElementById('breathingContainer').style.display = 'none';
        document.getElementById('breathingContainer').innerHTML = '';
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

    // Journal methods
    saveJournal() {
        const content = document.getElementById('journalContent').value.trim();
        const title = document.getElementById('journalTitle').value.trim();
        
        if (!content) {
            this.showMessage('Please write something before saving', 'error');
            return;
        }
        
        const entry = {
            title: title || 'Untitled Entry',
            content: content,
            tags: [...this.currentTags],
            date: new Date().toISOString()
        };
        
        this.data.journals.push(entry);
        this.saveData();
        this.updateStats();
        this.checkAchievements();
        
        // Reset form
        document.getElementById('journalTitle').value = '';
        document.getElementById('journalContent').value = '';
        this.currentTags = [];
        this.updateTagsDisplay();
        
        this.showMessage('Journal entry saved! Keep reflecting and growing. 📝', 'success');
        this.loadRecentEntries();
        
        // Auto-navigate back to home
        setTimeout(() => showPage('home'), 1500);
    }

    // Add journal tag
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

    // Update tags display
    updateTagsDisplay() {
        const container = document.getElementById('journalTags');
        container.innerHTML = this.currentTags.map(tag => `
            <span class="tag">
                ${tag}
                <button onclick="app.removeTag('${tag}')" class="tag-remove">&times;</button>
            </span>
        `).join('');
    }

    // Remove tag
    removeTag(tag) {
        this.currentTags = this.currentTags.filter(t => t !== tag);
        this.updateTagsDisplay();
    }

    // Update journal stats
    updateJournalStats() {
        const editor = document.getElementById('journalEditor');
        if (!editor) return;
        
        const content = editor.innerText;
        const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = content.length;
        const readTime = Math.ceil(words / 200); // Average reading speed
        
        document.getElementById('wordCount').textContent = words;
        document.getElementById('charCount').textContent = chars;
        document.getElementById('readTime').textContent = readTime;
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
        
        // Perform basic analysis (sentiment analysis disabled for browser)
        let analysis = {
            sentiment: null,
            themes: [],
            suggestions: []
        };
        
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
        this.updateJournalStatsDashboard();
        
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
        
        // Update themes
        const themeTags = document.getElementById('themeTags');
        if (themeTags) {
            themeTags.innerHTML = analysis.themes.map(theme => 
                `<span>${theme}</span>`
            ).join('');
        }
        
        // Update suggestions
        const suggestionList = document.getElementById('suggestionList');
        if (suggestionList) {
            suggestionList.innerHTML = analysis.suggestions.map(suggestion => 
                `<div>${suggestion.icon} ${suggestion.text}</div>`
            ).join('');
        }
    }

    // Update journal statistics dashboard
    updateJournalStatsDashboard() {
        // Journal streak
        const journalStreak = this.calculateJournalStreak();
        const journalStreakEl = document.getElementById('journalStreak');
        if (journalStreakEl) journalStreakEl.textContent = journalStreak;
        
        // Calculate total words
        const totalWords = this.data.journals.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
        const totalWordsEl = document.getElementById('totalWords');
        if (totalWordsEl) totalWordsEl.textContent = totalWords.toLocaleString();
        
        // Calculate insights found
        const insightsCount = this.data.journals.filter(entry => 
            entry.analysis && entry.analysis.themes && entry.analysis.themes.length > 0
        ).length;
        const insightsFoundEl = document.getElementById('insightsFound');
        if (insightsFoundEl) insightsFoundEl.textContent = insightsCount;
    }

    // Calculate journal streak
    calculateJournalStreak() {
        if (this.data.journals.length === 0) return 0;
        
        const sortedEntries = [...this.data.journals].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sortedEntries.length; i++) {
            const entryDate = new Date(sortedEntries[i].date);
            entryDate.setHours(0, 0, 0, 0);
            
            const dayDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === streak) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
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
        input.style.height = 'auto';
        
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
        if (!toast) {
            const newToast = document.createElement('div');
            newToast.id = 'messageToast';
            newToast.className = 'message-toast';
            document.body.appendChild(newToast);
        }
        
        const toastEl = document.getElementById('messageToast');
        toastEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        toastEl.className = `message-toast ${type} show`;
        
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
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
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.remove('active');
    
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) navToggle.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show selected page
    const pageElement = document.querySelector(`.${page}`);
    if (page === 'home') {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.display = 'block';
        }
    } else if (pageElement) {
        pageElement.style.display = 'block';
    }
    
    // Page-specific initialization
    if (window.app) {
        switch(page) {
            case 'home':
                app.updateStats();
                app.calculateWellnessScore();
                app.initializeCharts();
                break;
            case 'insights':
                // Initialize analytics if needed
                break;
            case 'community':
                app.updateCommunityStats();
                break;
            case 'journal':
                app.updateJournalStatsDashboard();
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
    if (navMenu) navMenu.classList.toggle('active');
    if (navToggle) navToggle.classList.toggle('active');
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.classList.toggle('active');
    
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) profileDropdown.classList.remove('active');
}

function toggleProfile() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.toggle('active');
    
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) notificationPanel.classList.remove('active');
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
    if (app) {
        // app.filterJournalHistory(filter);
    }
}

// Meditation controls
function closeMeditationPlayer() {
    document.getElementById('meditationPlayer').style.display = 'none';
    if (app && app.meditationTimer) {
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

function skipBackward() {
    // Skip backward functionality
}

function skipForward() {
    // Skip forward functionality
}

// Breathing controls
function startBreathingExercise(type) {
    if (app) {
        app.startBreathingExercise(type);
    }
}

function toggleBreathing() {
    const icon = document.getElementById('breathingPlayPause');
    if (app && app.breathingActive) {
        app.breathingActive = false;
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    } else if (app) {
        app.startBreathingSession();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
}

function adjustBreathingSpeed(speed) {
    if (app) {
        app.breathingSpeed = parseFloat(speed);
    }
}

function backToBreathingSelection() {
    document.getElementById('breathingInterface').style.display = 'none';
    document.querySelector('.breathing-selection').style.display = 'grid';
    if (app) {
        app.breathingActive = false;
    }
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
    if (editor) {
        editor.focus();
        document.execCommand('insertText', false, prompt + ' ');
    }
}

function setJournalMood(mood) {
    // Set journal mood
}

function saveDraft() {
    if (app) {
        app.showMessage('Draft saved!', 'success');
    }
}

function analyzeAndSave() {
    if (app) {
        app.analyzeAndSave();
    }
}

// Sleep functions
function logSleep() {
    if (app) {
        app.logSleep();
    }
}

// AI Therapist functions
function sendMessage() {
    if (app) {
        app.sendMessage();
    }
}

function sendQuickResponse(response) {
    if (app) {
        app.sendQuickResponse(response);
    }
}

// Analytics functions
function changePeriod(period) {
    if (app) {
        app.changePeriod(period);
    }
}

function showCustomDateRange() {
    if (app) {
        app.showMessage('Custom date range coming soon!', 'info');
    }
}

function generateReport(type) {
    if (app) {
        app.generateReport(type);
    }
}

function shareWithTherapist() {
    if (app) {
        app.shareWithTherapist();
    }
}

// Settings functions
function showSettings() {
    if (app) {
        app.showMessage('Settings page coming soon!', 'info');
    }
}

function showPrivacy() {
    if (app) {
        app.showMessage('Privacy settings coming soon!', 'info');
    }
}

function exportAllData() {
    if (app) {
        app.exportAllData();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout? Your data will be saved locally.')) {
        if (app) {
            app.showMessage('Logged out successfully!', 'success');
        }
        // In a real app, handle authentication
    }
}

// Meditation functions
function startMeditation(type) {
    if (app) {
        app.startMeditation(type);
    }
}

// Update intensity display
function updateIntensityDisplay(value) {
    if (app) {
        app.updateIntensityDisplay(value);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    try {
        app = new MindfulMeProApp();
        window.app = app;
        
        // Show home page by default
        showPage('home');
        
        // Request notification permission after delay
        if ('Notification' in window && Notification.permission === 'default') {
            setTimeout(() => {
                app.requestNotificationPermission();
            }, 5000);
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>There was an error loading the app. Please refresh the page.</p>
            <button onclick="location.reload()">Refresh</button>
        `;
        document.body.appendChild(errorDiv);
    }
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// Prevent closing without saving
window.addEventListener('beforeunload', (e) => {
    if (app) {
        app.saveData();
    }
});

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Log errors for debugging
    if (app && app.data) {
        if (!app.data.errors) {
            app.data.errors = [];
        }
        app.data.errors.push({
            message: event.error.message,
            stack: event.error.stack,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 errors
        if (app.data.errors.length > 10) {
            app.data.errors = app.data.errors.slice(-10);
        }
        
        app.saveData();
    }
});

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.createElement('button');
    installBtn.className = 'install-pwa-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    installBtn.onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installBtn.remove();
        }
    };
    
    // Add to navbar
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.appendChild(installBtn);
    }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log slow resources
            if (entry.duration > 1000) {
                console.warn('Slow resource:', entry.name, entry.duration);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['resource'] });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (app) {
            app.saveData();
            app.showMessage('Data saved!', 'success');
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Close dropdowns
        document.getElementById('notificationPanel')?.classList.remove('active');
        document.getElementById('profileDropdown')?.classList.remove('active');
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - could navigate to next page
            console.log('Swiped left');
        } else {
            // Swiped right - could navigate to previous page
            console.log('Swiped right');
        }
    }
}

// Visibility change handler (pause timers when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any active timers
        if (app && app.breathingTimer) {
            app.pauseBreathing();
        }
    }
});

// Online/Offline detection
window.addEventListener('online', () => {
    if (app) {
        app.showMessage('You\'re back online!', 'success');
    }
});

window.addEventListener('offline', () => {
    if (app) {
        app.showMessage('You\'re offline. Don\'t worry, your data is saved locally.', 'info');
    }
});

// Debug mode (activated by typing "debug" on the page)
let debugSequence = '';
document.addEventListener('keypress', (e) => {
    debugSequence += e.key;
    if (debugSequence.includes('debug')) {
        debugSequence = '';
        if (app) {
            console.log('App Data:', app.data);
            console.log('Achievements:', app.achievements);
            console.log('Wellness Score:', app.wellnessScore);
            app.showMessage('Debug mode activated - check console', 'info');
        }
    }
    
    // Clear sequence if too long
    if (debugSequence.length > 10) {
        debugSequence = '';
    }
});

// Export global functions for use in HTML
window.showPage = showPage;
window.toggleNav = toggleNav;
window.toggleNotifications = toggleNotifications;
window.toggleProfile = toggleProfile;
window.updateIntensityDisplay = updateIntensityDisplay;
window.startBreathingExercise = startBreathingExercise;
window.toggleBreathing = toggleBreathing;
window.adjustBreathingSpeed = adjustBreathingSpeed;
window.backToBreathingSelection = backToBreathingSelection;
window.startMeditation = startMeditation;
window.closeMeditationPlayer = closeMeditationPlayer;
window.togglePlayPause = togglePlayPause;
window.skipBackward = skipBackward;
window.skipForward = skipForward;
window.filterMeditations = filterMeditations;
window.filterJournals = filterJournals;
window.formatText = formatText;
window.insertEmoji = insertEmoji;
window.usePrompt = usePrompt;
window.setJournalMood = setJournalMood;
window.saveDraft = saveDraft;
window.analyzeAndSave = analyzeAndSave;
window.sendMessage = sendMessage;
window.sendQuickResponse = sendQuickResponse;
window.logSleep = logSleep;
window.changePeriod = changePeriod;
window.showCustomDateRange = showCustomDateRange;
window.generateReport = generateReport;
window.shareWithTherapist = shareWithTherapist;
window.showSettings = showSettings;
window.showPrivacy = showPrivacy;
window.exportAllData = exportAllData;
window.logout = logout;
window.switchToVoice = switchToVoice;
window.switchToText = switchToText;

// End of fixed app.js
console.log('MindfulMe Pro initialized successfully!');
