// ===== STREET EMPIRE - UI RENDERING =====
// Part 2/3: All UI rendering and update functions
console.log('📦 Loading game-ui.js...');

// ===== MAIN UI UPDATE =====
function updateAllUI() {
    updateStatsRail();
    updateNavCounts();
    renderCrewTab();
    renderTerritoryTab();
    renderCollectionTab();
    renderAchievementsTab();
}

function updateStatsRail() {
    const { income, respectIncome, influenceIncome } = calculateIncome();
    
    document.getElementById('money').textContent = '$' + Math.floor(gameState.money).toLocaleString();
    document.getElementById('respect').textContent = Math.floor(gameState.respect).toLocaleString();
    document.getElementById('influence').textContent = Math.floor(gameState.influence).toLocaleString();
    document.getElementById('weapons').textContent = Math.floor(gameState.weapons).toLocaleString();
    document.getElementById('prestige').textContent = Math.floor(gameState.prestige).toLocaleString();
    
    document.getElementById('income-trend').textContent = '+$' + Math.floor(income).toLocaleString() + '/s';
    document.getElementById('respect-trend').textContent = '+' + Math.floor(respectIncome * 60).toLocaleString() + '/m';
    document.getElementById('influence-trend').textContent = '+' + Math.floor(influenceIncome * 60).toLocaleString() + '/m';
    
    document.getElementById('recruit-cost').textContent = '$' + gameState.recruitCost.toLocaleString();
}

function updateNavCounts() {
    const activeCount = Object.values(gameState.assignedPositions).filter(id => id !== undefined).length;
    document.getElementById('nav-crew-count').textContent = activeCount + ' ACTIVE';
    
    document.getElementById('nav-territory-lvl').textContent = gameState.baseLevel;
    
    const availableMissions = gameState.activeMissions.filter(m => m.status === 'available').length;
    document.getElementById('nav-missions-count').textContent = availableMissions + ' OPEN';
    
    const collected = new Set([
        ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
        ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
    ]);
    document.getElementById('nav-collection-count').textContent = collected.size + '/' + TOTAL_CHARACTERS;
    
    const unlockedCount = gameState.unlockedAchievements.length;
    document.getElementById('nav-achievements-count').textContent = unlockedCount + '/' + ACHIEVEMENTS.length;
    
    const territoryDescs = ['STARTER', 'RISING', 'EMPIRE'];
    document.getElementById('territory-status').textContent = territoryDescs[gameState.baseLevel - 1];
}

// ===== CREW TAB =====
function renderCrewTab() {
    const container = document.getElementById('crew-content');
    if (!container) return;
    
    const { income } = calculateIncome();
    const gangPower = calculateGangPower();
    const combatStr = calculateCombatStrength();
    
    document.getElementById('meta-income').textContent = '$' + Math.floor(income).toLocaleString();
    document.getElementById('meta-power').textContent = gangPower.toLocaleString();
    document.getElementById('meta-combat').textContent = combatStr.toLocaleString();
    
    container.innerHTML = `
        <div style="margin-top: 28px;">
            <h2 style="font-family: var(--font-display); font-size: 18px; color: var(--se-acid); margin-bottom: 18px; letter-spacing: 0.08em;">POSITIONS</h2>
            <div class="positions-grid" id="positions-grid"></div>
        </div>
    `;
    
    const grid = document.getElementById('positions-grid');
    
    POSITIONS.forEach(pos => {
        const card = document.createElement('div');
        card.className = 'position-card';
        
        const assignedCharId = gameState.assignedPositions[pos.id];
        
        if (assignedCharId !== undefined) {
            card.classList.add('filled');
            const char = ALL_CHARACTERS.find(c => c.id === assignedCharId);
            
            if (char) {
                const charDisplay = char.image 
                    ? `<img src="characters/images/${char.image}" alt="${char.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : char.emoji;
                
                card.innerHTML = `
                    <div class="position-name">${pos.name}</div>
                    <div class="position-bonus">${pos.bonus}</div>
                    <div class="assigned-char">
                        <div class="char-avatar rarity-${char.rarity}">${charDisplay}</div>
                        <div class="char-info">
                            <div class="char-name">${char.name}</div>
                            <div class="char-stat">${pos.preferredStat.toUpperCase()}: ${char[pos.preferredStat]}</div>
                        </div>
                        <button class="btn btn-secondary btn-small" onclick="unassignPosition('${pos.id}')">✕</button>
                    </div>
                `;
            }
        } else {
            card.innerHTML = `
                <div class="position-name">${pos.name}</div>
                <div class="position-bonus">${pos.bonus}</div>
                <div style="text-align: center; padding: 24px; color: #555; font-family: var(--font-mono); font-size: 12px;">
                    EMPTY SLOT<br>
                    <span style="font-size: 10px; opacity: 0.6;">CLICK TO ASSIGN</span>
                </div>
            `;
        }
        
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                openAssignModal(pos.id);
            }
        });
        
        grid.appendChild(card);
    });
}

// ===== TERRITORY TAB =====
function renderTerritoryTab() {
    const container = document.getElementById('territory-content');
    if (!container) return;
    
    const bonusPercent = (gameState.baseLevel - 1) * 60;
    const descriptions = ['Small Operation', 'Expanding Empire', 'Criminal Syndicate'];
    
    container.innerHTML = `
        <div class="territory-view" id="territory-view-canvas">
            <div style="position: absolute; bottom: 0; width: 100%; height: 40%; background: repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 60px, #2a2a2a 60px, #2a2a2a 120px); border-top: 2px solid var(--se-acid); box-shadow: 0 -5px 20px rgba(200, 255, 58, 0.2);"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;">
            <div style="background: rgba(200, 255, 58, 0.05); border: 1px solid rgba(200, 255, 58, 0.2); padding: 20px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 8px; letter-spacing: 0.1em;">TERRITORY LEVEL</div>
                <div style="font-family: var(--font-display); font-size: 48px; color: var(--se-acid); line-height: 1;">${gameState.baseLevel}</div>
                <div style="font-family: var(--font-ui); font-size: 13px; color: #666; margin-top: 6px;">${descriptions[gameState.baseLevel - 1]}</div>
            </div>
            
            <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 8px; letter-spacing: 0.1em;">INCOME BONUS</div>
                <div style="font-family: var(--font-display); font-size: 48px; color: #fff; line-height: 1;">+${bonusPercent}%</div>
                <div style="font-family: var(--font-ui); font-size: 13px; color: var(--se-acid); margin-top: 6px;">ALL INCOME MULTIPLIED</div>
            </div>
            
            <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 8px; letter-spacing: 0.1em;">CREW CAPACITY</div>
                <div style="font-family: var(--font-display); font-size: 48px; color: #fff; line-height: 1;">7</div>
                <div style="font-family: var(--font-ui); font-size: 13px; color: #666; margin-top: 6px;">MAX POSITIONS</div>
            </div>
        </div>
        
        <button class="btn" id="upgrade-territory-btn" onclick="upgradeTerritory()" ${gameState.baseLevel >= 3 ? 'disabled' : ''}>
            ${gameState.baseLevel >= 3 ? 'MAX LEVEL REACHED' : 'UPGRADE TERRITORY — $' + gameState.upgradeCost.toLocaleString()}
        </button>
    `;
    
    renderTerritoryBuildings();
}

function renderTerritoryBuildings() {
    const view = document.getElementById('territory-view-canvas');
    if (!view) return;
    
    const existingBuildings = view.querySelectorAll('.territory-building');
    existingBuildings.forEach(b => b.remove());
    
    if (gameState.baseLevel >= 1) {
        const b1 = createBuilding('building-level-1', 2, 2);
        b1.style.bottom = '40%';
        b1.style.left = '50%';
        b1.style.transform = 'translateX(-50%)';
        b1.style.width = '150px';
        b1.style.height = '120px';
        view.appendChild(b1);
    }
    
    if (gameState.baseLevel >= 2) {
        const b2 = createBuilding('building-level-2', 3, 3);
        b2.style.bottom = '40%';
        b2.style.left = '30%';
        b2.style.transform = 'translateX(-50%)';
        b2.style.width = '250px';
        b2.style.height = '160px';
        view.appendChild(b2);
    }
    
    if (gameState.baseLevel >= 3) {
        const b3 = createBuilding('building-level-3', 5, 4);
        b3.style.bottom = '40%';
        b3.style.left = '50%';
        b3.style.transform = 'translateX(-50%)';
        b3.style.width = '400px';
        b3.style.height = '220px';
        view.appendChild(b3);
    }
}

function createBuilding(className, cols, rows) {
    const building = document.createElement('div');
    building.className = `territory-building ${className}`;
    
    setTimeout(() => {
        const w = building.offsetWidth;
        const h = building.offsetHeight;
        const sx = w / (cols + 1);
        const sy = h / (rows + 1);
        
        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                const light = document.createElement('div');
                light.className = 'building-light';
                light.style.left = (c * sx - 6) + 'px';
                light.style.top = (r * sy - 7.5) + 'px';
                light.style.animationDelay = (Math.random() * 3) + 's';
                building.appendChild(light);
            }
        }
    }, 100);
    
    return building;
}

// ===== COLLECTION TAB =====
function renderCollectionTab() {
    const container = document.getElementById('collection-content');
    if (!container) return;
    
    const collected = new Set([
        ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
        ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
    ]);
    
    const percentage = Math.floor((collected.size / TOTAL_CHARACTERS) * 100);
    
    let characters = ALL_CHARACTERS;
    if (gameState.currentFilter !== 'all') {
        characters = characters.filter(c => c.rarity === gameState.currentFilter);
    }
    
    container.innerHTML = `
        <div style="display: flex; gap: 24px; margin-bottom: 20px; padding: 16px; background: rgba(200, 255, 58, 0.05); border: 1px solid rgba(200, 255, 58, 0.2); border-radius: 4px;">
            <div style="font-family: var(--font-ui); font-size: 14px;">
                <span style="color: #888;">COLLECTED:</span>
                <span style="color: var(--se-acid); font-weight: 700; margin-left: 8px;">${collected.size}/${TOTAL_CHARACTERS}</span>
            </div>
            <div style="font-family: var(--font-ui); font-size: 14px;">
                <span style="color: #888;">COMPLETION:</span>
                <span style="color: var(--se-acid); font-weight: 700; margin-left: 8px;">${percentage}%</span>
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <button class="filter-btn ${gameState.currentFilter === 'all' ? 'active' : ''}" onclick="filterCollection('all')" style="background: ${gameState.currentFilter === 'all' ? 'var(--se-acid)' : 'rgba(0,0,0,0.4)'}; color: ${gameState.currentFilter === 'all' ? '#0a0c0e' : '#fff'}; border: 1px solid ${gameState.currentFilter === 'all' ? 'var(--se-acid)' : 'rgba(255,255,255,0.2)'}; padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">ALL</button>
            <button class="filter-btn ${gameState.currentFilter === 'legendary' ? 'active' : ''}" onclick="filterCollection('legendary')" style="background: ${gameState.currentFilter === 'legendary' ? 'var(--se-r-legendary)' : 'rgba(0,0,0,0.4)'}; color: ${gameState.currentFilter === 'legendary' ? '#0a0c0e' : '#e8b948'}; border: 1px solid var(--se-r-legendary); padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">LEGENDARY</button>
            <button class="filter-btn ${gameState.currentFilter === 'epic' ? 'active' : ''}" onclick="filterCollection('epic')" style="background: ${gameState.currentFilter === 'epic' ? 'var(--se-r-epic)' : 'rgba(0,0,0,0.4)'}; color: ${gameState.currentFilter === 'epic' ? '#fff' : '#b15bff'}; border: 1px solid var(--se-r-epic); padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">EPIC</button>
            <button class="filter-btn ${gameState.currentFilter === 'rare' ? 'active' : ''}" onclick="filterCollection('rare')" style="background: ${gameState.currentFilter === 'rare' ? 'var(--se-r-rare)' : 'rgba(0,0,0,0.4)'}; color: ${gameState.currentFilter === 'rare' ? '#0a0c0e' : '#34d6e8'}; border: 1px solid var(--se-r-rare); padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">RARE</button>
            <button class="filter-btn ${gameState.currentFilter === 'uncommon' ? 'active' : ''}" onclick="filterCollection('uncommon')" style="background: ${gameState.currentFilter === 'uncommon' ? 'var(--se-r-uncommon)' : 'rgba(0,0,0,0.4)'}; color: ${gameState.currentFilter === 'uncommon' ? '#0a0c0e' : '#c8ff3a'}; border: 1px solid var(--se-r-uncommon); padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">UNCOMMON</button>
            <button class="filter-btn ${gameState.currentFilter === 'common' ? 'active' : ''}" onclick="filterCollection('common')" style="background: ${gameState.currentFilter === 'common' ? 'var(--se-r-common)' : 'rgba(0,0,0,0.4)'}; color: #fff; border: 1px solid var(--se-r-common); padding: 10px 20px; border-radius: 3px; cursor: pointer; font-family: var(--font-ui); font-weight: 700; font-size: 12px; letter-spacing: 0.08em;">COMMON</button>
        </div>
        
        <div id="collection-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;"></div>
    `;
    
    const grid = document.getElementById('collection-grid');
    
    characters.forEach(char => {
        const card = document.createElement('div');
        const isCollected = collected.has(char.id);
        const rarity = RARITIES.find(r => r.name === char.rarity);
        
        card.style.cssText = `
            background: ${isCollected ? 'rgba(200, 255, 58, 0.03)' : 'rgba(0, 0, 0, 0.4)'};
            border: 2px solid ${isCollected ? rarity.color : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 4px;
            padding: 16px;
            text-align: center;
            cursor: ${isCollected ? 'pointer' : 'not-allowed'};
            opacity: ${isCollected ? '1' : '0.4'};
            transition: all 0.3s ease;
        `;
        
        const charDisplay = isCollected && char.image 
            ? `<img src="characters/images/${char.image}" alt="${char.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : (isCollected ? char.emoji : '🔒');
        
        card.innerHTML = `
            <div style="width: 100px; height: 100px; margin: 0 auto 12px; background: linear-gradient(135deg, #333 0%, #555 100%); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 3em; border: 3px solid ${rarity.color}; overflow: hidden;">
                ${charDisplay}
            </div>
            <div style="font-family: var(--font-ui); font-weight: 700; font-size: 14px; color: #fff; margin-bottom: 6px;">${isCollected ? char.name : '???'}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: ${rarity.color}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">${isCollected ? char.rarity : 'LOCKED'}</div>
            ${isCollected ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 6px; border-radius: 3px;">
                        <div style="font-family: var(--font-mono); font-size: 9px; color: #888;">STR</div>
                        <div style="font-family: var(--font-display); font-size: 18px; color: var(--se-acid);">${char.strength}</div>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 6px; border-radius: 3px;">
                        <div style="font-family: var(--font-mono); font-size: 9px; color: #888;">INT</div>
                        <div style="font-family: var(--font-display); font-size: 18px; color: var(--se-acid);">${char.intelligence}</div>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 6px; border-radius: 3px;">
                        <div style="font-family: var(--font-mono); font-size: 9px; color: #888;">AGI</div>
                        <div style="font-family: var(--font-display); font-size: 18px; color: var(--se-acid);">${char.agility}</div>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 6px; border-radius: 3px;">
                        <div style="font-family: var(--font-mono); font-size: 9px; color: #888;">LEAD</div>
                        <div style="font-family: var(--font-display); font-size: 18px; color: var(--se-acid);">${char.leadership}</div>
                    </div>
                </div>
            ` : ''}
        `;
        
        if (isCollected) {
            card.addEventListener('click', () => showCharacterDetail(char));
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = `0 8px 25px ${rarity.color}80`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        }
        
        grid.appendChild(card);
    });
}

function filterCollection(rarity) {
    gameState.currentFilter = rarity;
    renderCollectionTab();
}

// ===== ACHIEVEMENTS TAB =====
function renderAchievementsTab() {
    const container = document.getElementById('achievements-content');
    if (!container) return;
    
    container.innerHTML = `
        <div id="achievements-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px;"></div>
    `;
    
    const grid = document.getElementById('achievements-grid');
    
    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = gameState.unlockedAchievements.includes(achievement.id);
        const progress = getAchievementProgress(achievement);
        const progressPercent = Math.min(100, (progress / achievement.requirement.value) * 100);
        
        const card = document.createElement('div');
        card.style.cssText = `
            background: ${isUnlocked ? 'rgba(200, 255, 58, 0.05)' : 'rgba(0, 0, 0, 0.3)'};
            border: 2px solid ${isUnlocked ? 'var(--se-acid)' : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 4px;
            padding: 20px;
            display: flex;
            gap: 18px;
            transition: all 0.3s ease;
        `;
        
        card.innerHTML = `
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #333 0%, #555 100%); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 2.5em; border: 2px solid ${isUnlocked ? 'var(--se-acid)' : 'rgba(255, 255, 255, 0.2)'}; flex-shrink: 0; ${isUnlocked ? 'box-shadow: 0 0 20px rgba(200, 255, 58, 0.4);' : ''}">
                ${achievement.icon}
            </div>
            <div style="flex: 1;">
                <div style="font-family: var(--font-display); font-size: 16px; color: #fff; margin-bottom: 6px; letter-spacing: 0.05em;">${achievement.name}</div>
                <div style="font-family: var(--font-ui); font-size: 13px; color: #aaa; line-height: 1.4; margin-bottom: 10px;">${achievement.desc}</div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--se-acid); margin-bottom: 8px;">
                    Reward: ${Object.entries(achievement.reward).map(([k, v]) => `${k}: +${v}`).join(', ')}
                </div>
                ${!isUnlocked ? `
                    <div style="background: rgba(255, 255, 255, 0.05); height: 20px; border-radius: 3px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="height: 100%; background: linear-gradient(90deg, var(--se-acid) 0%, var(--se-acid-deep) 100%); width: ${progressPercent}%; transition: width 0.5s ease; display: flex; align-items: center; padding-left: 8px; font-family: var(--font-mono); font-size: 10px; font-weight: bold; color: #0a0c0e;">
                            ${progress}/${achievement.requirement.value}
                        </div>
                    </div>
                ` : '<div style="color: var(--se-acid); font-weight: bold; font-family: var(--font-display); margin-top: 6px; letter-spacing: 0.08em;">✓ UNLOCKED</div>'}
            </div>
        `;
        
        if (isUnlocked) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 8px 25px rgba(200, 255, 58, 0.3)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        }
        
        grid.appendChild(card);
    });
}

function getAchievementProgress(achievement) {
    const type = achievement.requirement.type;

    if (type === 'recruits') {
        return gameState.totalRecruits;
    } else if (type === 'collection') {
        const collected = new Set([
            ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
            ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
        ]);
        return collected.size;
    } else if (type === 'missions') {
        return gameState.completedMissions.length;
    } else if (type === 'easy_missions') {
        return gameState.completedEasyMissions || 0;
    } else if (type === 'hard_missions') {
        return gameState.completedHardMissions || 0;
    } else if (type === 'speed_mission') {
        return gameState.speedMissionCompleted || 0;
    } else if (type === 'money') {
        return gameState.money;
    } else if (type === 'respect') {
        return gameState.respect;
    } else if (type === 'prestige') {
        return gameState.prestige;
    } else if (type === 'weapons') {
        return gameState.weapons;
    } else if (type === 'territory') {
        return gameState.baseLevel;
    } else if (type === 'legendary') {
        const collected = [
            ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
            ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
        ];
        return collected.filter(id => {
            const char = ALL_CHARACTERS.find(c => c.id === id);
            return char && char.rarity === 'legendary';
        }).length;
    } else if (type === 'empire_income') {
        const { income } = calculateIncome();
        return Math.floor(income);
    } else if (type === 'perfect_crew') {
        const assignedIds = Object.values(gameState.assignedPositions).filter(id => id !== undefined);
        if (assignedIds.length < POSITIONS.length) return 0;
        const eliteRarities = ['epic', 'legendary', 'mythic', 'ancient', 'divine', 'cosmic', 'transcendent'];
        const allElite = assignedIds.every(id => {
            const char = ALL_CHARACTERS.find(c => c.id === id);
            return char && eliteRarities.includes(char.rarity);
        });
        return allElite ? 1 : 0;
    } else if (type === 'ultimate') {
        if (gameState.money >= 1000000 && gameState.respect >= 100000 &&
            gameState.weapons >= 10000 && gameState.prestige >= 100) return 1;
        return 0;
    }

    return 0;
}

// ===== MODALS =====
function openAssignModal(posId) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    const pos = POSITIONS.find(p => p.id === posId);
    
    const available = Object.entries(gameState.characterInventory)
        .filter(([charId, count]) => count > 0)
        .map(([charId]) => ALL_CHARACTERS.find(c => c.id === parseInt(charId)));
    
    body.innerHTML = `
        <h2 style="font-family: var(--font-display); color: #fff; margin-bottom: 15px; font-size: 22px; letter-spacing: 0.08em;">ASSIGN TO ${pos.name.toUpperCase()}</h2>
        <div style="margin-bottom: 15px; color: var(--se-acid); font-size: 14px; font-family: var(--font-ui); font-weight: 700;">${pos.bonus}</div>
        <div style="margin-bottom: 25px; color: #999; font-family: var(--font-mono); font-size: 12px;">Preferred Stat: ${pos.preferredStat.toUpperCase()}</div>
        
        ${available.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; max-height: 400px; overflow-y: auto;">
                ${available.map(char => {
                    const rarity = RARITIES.find(r => r.name === char.rarity);
                    const charDisplay = char.image 
                        ? `<img src="characters/images/${char.image}" alt="${char.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                        : char.emoji;
                    return `
                        <div class="char-card-small" onclick="assignPosition('${posId}', ${char.id})" style="cursor: pointer;">
                            <div class="char-portrait-small rarity-${char.rarity}">${charDisplay}</div>
                            <div class="char-card-name">${char.name}</div>
                            <div class="char-card-rarity" style="color: ${rarity.color}">${char.rarity}</div>
                            <div style="margin-top: 8px; font-size: 11px; color: var(--se-acid); font-family: var(--font-mono);">
                                ${pos.preferredStat.toUpperCase()}: ${char[pos.preferredStat]}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '<div style="text-align: center; padding: 40px; color: #666; font-family: var(--font-ui);">No characters in inventory. Recruit some first!</div>'}
    `;
    
    modal.classList.add('active');
}

function showCharacterDetail(char) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    
    const rarity = RARITIES.find(r => r.name === char.rarity);
    const assigned = Object.entries(gameState.assignedPositions).find(([k, v]) => v === char.id);
    const charDisplay = char.image 
        ? `<img src="characters/images/${char.image}" alt="${char.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
        : char.emoji;
    
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <div style="width: 120px; height: 120px; margin: 0 auto 20px; background: linear-gradient(135deg, #333 0%, #555 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 4em; border: 3px solid ${rarity.color}; overflow: hidden; ${char.rarity === 'legendary' ? 'box-shadow: 0 0 30px ' + rarity.color + ';' : ''}">
                ${charDisplay}
            </div>
            <h2 style="font-family: var(--font-display); color: #fff; margin-bottom: 8px; font-size: 24px; letter-spacing: 0.08em;">${char.name}</h2>
            <div style="color: ${rarity.color}; text-transform: uppercase; font-weight: bold; font-size: 14px; letter-spacing: 0.12em; font-family: var(--font-mono);">
                ${char.rarity}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 10px; color: #888; margin-bottom: 4px; letter-spacing: 0.1em;">STRENGTH</div>
                <div style="font-family: var(--font-display); font-size: 28px; color: var(--se-acid);">${char.strength}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 10px; color: #888; margin-bottom: 4px; letter-spacing: 0.1em;">INTELLIGENCE</div>
                <div style="font-family: var(--font-display); font-size: 28px; color: var(--se-acid);">${char.intelligence}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 10px; color: #888; margin-bottom: 4px; letter-spacing: 0.1em;">AGILITY</div>
                <div style="font-family: var(--font-display); font-size: 28px; color: var(--se-acid);">${char.agility}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 4px;">
                <div style="font-family: var(--font-mono); font-size: 10px; color: #888; margin-bottom: 4px; letter-spacing: 0.1em;">LEADERSHIP</div>
                <div style="font-family: var(--font-display); font-size: 28px; color: var(--se-acid);">${char.leadership}</div>
            </div>
        </div>
        
        ${assigned ? `
            <div style="padding: 15px; background: rgba(200, 255, 58, 0.1); border: 1px solid rgba(200, 255, 58, 0.3); border-radius: 4px; font-family: var(--font-ui); font-size: 13px;">
                Currently assigned: <strong style="color: var(--se-acid);">${POSITIONS.find(p => p.id === assigned[0]).name}</strong>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

console.log('✅ game-ui.js loaded!');
