// ===== STREET EMPIRE - FEATURES =====
// Part 3/3: Missions, Achievements, Game Loop, Init
console.log('📦 Loading game-features.js...');

// ===== MISSIONS =====
function renderMissionsTab() {
    const container = document.getElementById('missions-content');
    if (!container) return;
    
    container.innerHTML = '<div id="missions-grid" style="display: grid; grid-template-columns: 1fr; gap: 16px;"></div>';
    
    const grid = document.getElementById('missions-grid');
    
    gameState.activeMissions.forEach(mission => {
        const card = document.createElement('div');
        const canStart = checkMissionRequirements(mission);
        const progress = mission.status === 'active' && mission.startTime
            ? Math.min(100, ((Date.now() - mission.startTime) / (mission.duration * 1000)) * 100)
            : 0;
        
        const timeRemaining = mission.status === 'active' && mission.startTime
            ? Math.max(0, mission.duration - Math.floor((Date.now() - mission.startTime) / 1000))
            : 0;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        card.className = `mission-card ${mission.status}`;
        
        card.innerHTML = `
            <div class="mission-header">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-difficulty ${mission.difficulty}">${mission.difficulty}</div>
            </div>
            <div class="mission-desc">${mission.desc}</div>
            <div class="mission-requirements">
                Requires: ${Object.entries(mission.requirements).map(([k, v]) => `${k}: ${v}`).join(', ')}
            </div>
            <div class="mission-rewards">
                ${Object.entries(mission.rewards).map(([k, v]) => 
                    `<div class="reward-item">${k}: +${v}</div>`
                ).join('')}
            </div>
            ${mission.status === 'active' ? `
                <div class="mission-timer" style="font-family: var(--font-mono); font-size: 12px; color: var(--se-cyan); margin-bottom: 10px; font-weight: bold;">
                    Time: ${minutes}:${seconds.toString().padStart(2, '0')}
                </div>
                <div class="mission-progress" style="background: rgba(255, 255, 255, 0.05); height: 25px; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="mission-progress-bar" style="height: 100%; background: linear-gradient(90deg, var(--se-cyan) 0%, #0088cc 100%); width: ${progress}%; display: flex; align-items: center; padding-left: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; color: #000; transition: width 0.3s ease; box-shadow: 0 0 10px rgba(52, 214, 232, 0.5);">
                        ${Math.floor(progress)}%
                    </div>
                </div>
            ` : ''}
            ${mission.status === 'available' ? `
                <button class="btn" style="width: 100%; margin-top: 12px;" onclick="startMission(${mission.id})" ${!canStart ? 'disabled' : ''}>
                    ${canStart ? 'START MISSION' : 'REQUIREMENTS NOT MET'}
                </button>
            ` : ''}
        `;
        
        grid.appendChild(card);
    });
}

function checkMissionRequirements(mission) {
    const gangPower = calculateGangPower();
    
    for (const [key, value] of Object.entries(mission.requirements)) {
        if (key === 'gangPower' && gangPower < value) return false;
        if (key === 'weapons' && gameState.weapons < value) return false;
        if (key === 'influence' && gameState.influence < value) return false;
        if (key === 'respect' && gameState.respect < value) return false;
    }
    return true;
}

function startMission(missionId) {
    const mission = gameState.activeMissions.find(m => m.id === missionId);
    if (!mission || !checkMissionRequirements(mission)) return;
    
    mission.status = 'active';
    mission.startTime = Date.now();
    
    notify('Mission started!');
    renderMissionsTab();
}

function completeMission(mission) {
    Object.entries(mission.rewards).forEach(([key, value]) => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += value;
        }
    });
    
    // Track mission types for achievements
    if (mission.difficulty === 'easy') {
        gameState.completedEasyMissions = (gameState.completedEasyMissions || 0) + 1;
    } else if (mission.difficulty === 'hard') {
        gameState.completedHardMissions = (gameState.completedHardMissions || 0) + 1;
    }
    
    // Track speed missions (completed in under 20s)
    if (mission.startTime && (Date.now() - mission.startTime) < 20000) {
        gameState.speedMissionCompleted = (gameState.speedMissionCompleted || 0) + 1;
    }
    
    gameState.activeMissions = gameState.activeMissions.filter(m => m.id !== mission.id);
    gameState.completedMissions.push(mission.id);
    
    generateNewMission();
    
    notify(`Mission "${mission.title}" completed!`);
    updateAllUI();
    renderMissionsTab();
}

function generateInitialMissions() {
    for (let i = 0; i < 3; i++) {
        generateNewMission();
    }
    renderMissionsTab();
}

function generateNewMission() {
    const template = MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
    gameState.activeMissions.push({
        ...template,
        id: Date.now() + Math.random(),
        startTime: null,
        status: 'unavailable'
    });
}

function updateMissions() {
    let needsRender = false;
    
    gameState.activeMissions.forEach((mission) => {
        if (mission.status === 'active' && mission.startTime) {
            const elapsed = Date.now() - mission.startTime;
            if (elapsed >= mission.duration * 1000) {
                completeMission(mission);
                needsRender = true;
            }
        }
    });
    
    // Update live timers and progress bars
    gameState.activeMissions.forEach((mission) => {
        if (mission.status === 'active' && mission.startTime) {
            const elapsed = Date.now() - mission.startTime;
            const progress = Math.min(100, (elapsed / (mission.duration * 1000)) * 100);
            const timeRemaining = Math.max(0, mission.duration - Math.floor(elapsed / 1000));
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            
            // Find mission card in DOM and update it
            const missionCards = document.querySelectorAll('.mission-card.active');
            missionCards.forEach(card => {
                const titleEl = card.querySelector('.mission-title');
                if (titleEl && titleEl.textContent === mission.title) {
                    const timerEl = card.querySelector('.mission-timer');
                    const progressBar = card.querySelector('.mission-progress-bar');
                    
                    if (timerEl) {
                        timerEl.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                    
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                        progressBar.textContent = Math.floor(progress) + '%';
                    }
                }
            });
        }
    });
    
    // Update mission notification
    updateMissionNotification();
    
    if (needsRender) {
        renderMissionsTab();
    }
}

function checkMissionAvailability() {
    let changed = false;
    
    gameState.activeMissions.forEach(mission => {
        const wasAvailable = mission.status === 'available';
        const canStart = checkMissionRequirements(mission);
        
        if (!wasAvailable && mission.status !== 'active' && canStart) {
            mission.status = 'available';
            changed = true;
        }
    });
    
    if (changed) {
        renderMissionsTab();
    }
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.unlockedAchievements.includes(achievement.id)) {
            const progress = getAchievementProgress(achievement);
            if (progress >= achievement.requirement.value) {
                unlockAchievement(achievement);
            }
        }
    });
}

function unlockAchievement(achievement) {
    gameState.unlockedAchievements.push(achievement.id);
    
    Object.entries(achievement.reward).forEach(([key, value]) => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += value;
        }
    });
    
    notify(`Achievement Unlocked: ${achievement.name}!`);
    renderAchievementsTab();
    updateStatsRail();
}

// ===== GAME LOOP =====
function update() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
    
    const { income, respectIncome, influenceIncome } = calculateIncome();
    
    gameState.money += Math.floor(income * delta);
    gameState.respect += Math.floor(respectIncome * delta);
    gameState.influence += Math.floor(influenceIncome * delta);
    
    updateMissions();
    checkAchievements();
    updateStatsRail();
    updateGameTime();
}

function updateGameTime() {
    const time = new Date();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    
    const timeEl = document.getElementById('game-time');
    if (timeEl) {
        timeEl.textContent = `EAST SIDE · ${hours}:${minutes}:${seconds}`;
    }
}

// ===== MISSION NOTIFICATION =====
function updateMissionNotification() {
    let notifContainer = document.getElementById('mission-notification');
    
    const activeMissions = gameState.activeMissions.filter(m => m.status === 'active' && m.startTime);
    
    if (activeMissions.length > 0) {
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.id = 'mission-notification';
            notifContainer.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 340px;
                max-height: 500px;
                overflow-y: auto;
                z-index: 999;
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            document.body.appendChild(notifContainer);
        }
        
        notifContainer.innerHTML = '';
        
        activeMissions.forEach((mission, index) => {
            const elapsed = Date.now() - mission.startTime;
            const progress = Math.min(100, (elapsed / (mission.duration * 1000)) * 100);
            const timeRemaining = Math.max(0, mission.duration - Math.floor(elapsed / 1000));
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            
            const missionCard = document.createElement('div');
            missionCard.style.cssText = `
                background: linear-gradient(135deg, rgba(52, 214, 232, 0.15) 0%, rgba(0, 0, 0, 0.9) 100%);
                border: 2px solid var(--se-cyan);
                border-radius: 6px;
                padding: 16px;
                box-shadow: 0 8px 30px rgba(52, 214, 232, 0.4);
                animation: slideInFromRight 0.4s ease;
            `;
            
            missionCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 8px; height: 8px; background: var(--se-cyan); border-radius: 50%; box-shadow: 0 0 10px var(--se-cyan); animation: pulse 1.5s ease-in-out infinite;"></div>
                    <div style="font-family: var(--font-mono); font-size: 10px; color: var(--se-cyan); letter-spacing: 0.12em;">MISSION ${index + 1}/${activeMissions.length}</div>
                </div>
                <div style="font-family: var(--font-display); font-size: 14px; color: #fff; margin-bottom: 8px; letter-spacing: 0.05em;">${mission.title}</div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--se-cyan); margin-bottom: 10px;">
                    ${minutes}:${seconds.toString().padStart(2, '0')} REMAINING
                </div>
                <div style="background: rgba(0, 0, 0, 0.5); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, var(--se-cyan) 0%, #0088cc 100%); width: ${progress}%; transition: width 0.3s ease; box-shadow: 0 0 8px var(--se-cyan);"></div>
                </div>
            `;
            
            notifContainer.appendChild(missionCard);
        });
    } else {
        if (notifContainer) {
            notifContainer.remove();
        }
    }
}

// Add pulse animation to document
if (!document.getElementById('mission-notif-styles')) {
    const style = document.createElement('style');
    style.id = 'mission-notif-styles';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes slideInFromRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        #mission-notification::-webkit-scrollbar {
            width: 6px;
        }
        #mission-notification::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
        }
        #mission-notification::-webkit-scrollbar-thumb {
            background: var(--se-cyan);
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.v2-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Recruit button
    const recruitBtn = document.getElementById('recruit-btn');
    if (recruitBtn) {
        recruitBtn.addEventListener('click', recruitCharacter);
    }
    
    // Modal close on overlay click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target.classList.contains('v2-modal-overlay')) {
            closeModal();
        }
    });
}

function switchTab(tabName) {
    // Update nav items
    document.querySelectorAll('.v2-nav-item').forEach(item => {
        item.classList.remove('is-active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('is-active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Render specific tab content
    if (tabName === 'crew') renderCrewTab();
    else if (tabName === 'territory') renderTerritoryTab();
    else if (tabName === 'missions') renderMissionsTab();
    else if (tabName === 'wars') renderGangWarsTab();
    else if (tabName === 'collection') renderCollectionTab();
    else if (tabName === 'achievements') renderAchievementsTab();
}

// ===== INITIALIZATION =====
function initGame() {
    console.log('🎮 Starting Street Empire V2...');
    initializeCharacters();
}

function continueGameInit() {
    loadGame();
    
    updateAllUI();
    
    if (gameState.activeMissions.length === 0) {
        generateInitialMissions();
    } else {
        renderMissionsTab();
    }
    
    setupEventListeners();
    
    // Start game loops
    setInterval(update, 1000);
    setInterval(saveGame, 5000);
    setInterval(checkMissionAvailability, 1000);
    
    console.log('✅ Street Empire V2 loaded successfully!');
    notify('Welcome to Street Empire!');
}

// ===== START GAME =====
window.addEventListener('DOMContentLoaded', initGame);

console.log('✅ game-features.js loaded!');