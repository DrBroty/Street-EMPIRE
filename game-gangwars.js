// ===== STREET EMPIRE - GANG WARS SYSTEM =====
// Part 4/4: PvE Gang Wars with Battle System
console.log('📦 Loading game-gangwars.js...');

// ===== GANG WARS RENDERING =====
function renderGangWarsTab() {
    const container = document.getElementById('tab-wars');
    if (!container) return;
    
    const gangPower = calculateGangPower();
    const combatStr = calculateCombatStrength();
    
    // Generate enemy gangs if not exists
    if (gameState.currentEnemyGangs.length === 0) {
        generateEnemyGangs();
    }
    
    container.innerHTML = `
        <div class="v2-header">
            <div class="v2-breadcrumb">
                <span>GANG WARS</span>
                <span>›</span>
                <span>PVE BATTLES</span>
            </div>
            <h1 class="v2-h1">RIVAL GANGS</h1>
        </div>
        
        <!-- War Stats -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; padding: 20px; background: rgba(200, 255, 58, 0.05); border: 1px solid rgba(200, 255, 58, 0.2); border-radius: 4px;">
            <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 6px; letter-spacing: 0.1em;">YOUR GANG POWER</div>
                <div style="font-family: var(--font-display); font-size: 32px; color: var(--se-acid);">${gangPower.toLocaleString()}</div>
            </div>
            <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 6px; letter-spacing: 0.1em;">COMBAT STRENGTH</div>
                <div style="font-family: var(--font-display); font-size: 32px; color: #fff;">${combatStr.toLocaleString()}</div>
            </div>
            <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 6px; letter-spacing: 0.1em;">WINS</div>
                <div style="font-family: var(--font-display); font-size: 32px; color: var(--se-acid);">${gameState.gangWarWins}</div>
            </div>
            <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: #888; margin-bottom: 6px; letter-spacing: 0.1em;">LOSSES</div>
                <div style="font-family: var(--font-display); font-size: 32px; color: var(--se-blood);">${gameState.gangWarLosses}</div>
            </div>
        </div>
        
        <!-- Enemy Gangs Grid -->
        <div id="enemy-gangs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px;"></div>
    `;
    
    renderEnemyGangs();
}

function generateEnemyGangs() {
    gameState.currentEnemyGangs = ENEMY_GANG_TEMPLATES.map(template => {
        const power = Math.floor(Math.random() * (template.maxPower - template.minPower + 1)) + template.minPower;
        return {
            ...template,
            id: Math.random(),
            power: power
        };
    });
}

function renderEnemyGangs() {
    const grid = document.getElementById('enemy-gangs-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    gameState.currentEnemyGangs.forEach(gang => {
        const card = document.createElement('div');
        
        let tierClass = 'tier-easy';
        let tierColor = 'var(--se-acid)';
        if (gang.tier === 'medium') {
            tierClass = 'tier-medium';
            tierColor = '#ffaa00';
        } else if (gang.tier === 'hard') {
            tierClass = 'tier-hard';
            tierColor = 'var(--se-blood)';
        } else if (gang.tier === 'boss') {
            tierClass = 'tier-boss';
            tierColor = 'var(--se-purple)';
        }
        
        card.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid ${tierColor};
            border-radius: 4px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="font-family: var(--font-display); font-size: 18px; color: #fff; letter-spacing: 0.05em;">${gang.name}</div>
                <div style="font-family: var(--font-mono); font-size: 11px; padding: 4px 10px; border-radius: 3px; background: ${tierColor}20; color: ${tierColor}; border: 1px solid ${tierColor}; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">
                    ${gang.tier}
                </div>
            </div>
            
            <div style="font-family: var(--font-ui); font-size: 14px; color: var(--se-blood); margin-bottom: 15px;">
                <span style="color: #888;">Enemy Power:</span> <strong>${gang.power.toLocaleString()}</strong>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                ${Object.entries(gang.rewards).map(([key, value]) => `
                    <div style="background: rgba(200, 255, 58, 0.1); border: 1px solid rgba(200, 255, 58, 0.3); padding: 4px 10px; border-radius: 3px; font-family: var(--font-mono); font-size: 11px; color: var(--se-acid);">
                        ${key}: +${value}
                    </div>
                `).join('')}
            </div>
            
            <button class="btn" style="width: 100%;" onclick="startGangWar(${gang.id})">
                ATTACK GANG
            </button>
        `;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = `0 8px 25px ${tierColor}40`;
            card.style.borderColor = tierColor;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        grid.appendChild(card);
    });
}

// ===== BATTLE SYSTEM =====
function startGangWar(gangId) {
    const gang = gameState.currentEnemyGangs.find(g => g.id === gangId);
    if (!gang) return;
    
    const playerCombat = calculateCombatStrength();
    
    // Show battle overlay
    showBattleOverlay(gang, playerCombat);
    
    // Simulate battle
    setTimeout(() => {
        simulateBattle(gang, playerCombat);
    }, 1000);
}

function showBattleOverlay(gang, playerCombat) {
    let overlay = document.getElementById('battle-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'battle-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
        <div style="width: 90%; max-width: 900px; background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%); border: 3px solid var(--se-blood); border-radius: 8px; padding: 30px; box-shadow: 0 15px 50px rgba(210, 58, 44, 0.4);">
            <div style="font-family: var(--font-display); font-size: 32px; color: var(--se-blood); text-align: center; margin-bottom: 30px; letter-spacing: 0.1em;">
                GANG WAR!
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 30px; align-items: center; margin-bottom: 30px;">
                <!-- Your Gang -->
                <div style="background: rgba(0, 0, 0, 0.4); padding: 20px; border-radius: 8px; border: 2px solid var(--se-acid);">
                    <div style="font-family: var(--font-display); font-size: 16px; text-align: center; margin-bottom: 10px; color: var(--se-acid); letter-spacing: 0.08em;">YOUR GANG</div>
                    <div style="font-family: var(--font-display); font-size: 36px; font-weight: bold; text-align: center; color: var(--se-acid); margin-bottom: 15px;">${playerCombat.toLocaleString()}</div>
                    <div style="width: 100%; height: 30px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2);">
                        <div id="player-hp" style="height: 100%; background: linear-gradient(90deg, var(--se-acid) 0%, var(--se-acid-deep) 100%); width: 100%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; font-family: var(--font-mono); font-size: 12px;">
                            100%
                        </div>
                    </div>
                </div>
                
                <!-- VS -->
                <div style="font-family: var(--font-display); font-size: 48px; font-weight: bold; color: var(--se-blood); text-shadow: 0 0 20px rgba(210, 58, 44, 0.6);">
                    VS
                </div>
                
                <!-- Enemy Gang -->
                <div style="background: rgba(0, 0, 0, 0.4); padding: 20px; border-radius: 8px; border: 2px solid var(--se-blood);">
                    <div style="font-family: var(--font-display); font-size: 16px; text-align: center; margin-bottom: 10px; color: var(--se-blood); letter-spacing: 0.08em;">${gang.name.toUpperCase()}</div>
                    <div style="font-family: var(--font-display); font-size: 36px; font-weight: bold; text-align: center; color: var(--se-blood); margin-bottom: 15px;">${gang.power.toLocaleString()}</div>
                    <div style="width: 100%; height: 30px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2);">
                        <div id="enemy-hp" style="height: 100%; background: linear-gradient(90deg, var(--se-blood) 0%, var(--se-blood-deep) 100%); width: 100%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-family: var(--font-mono); font-size: 12px;">
                            100%
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Battle Log -->
            <div id="battle-log" style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 15px; max-height: 200px; overflow-y: auto; margin-bottom: 20px; font-family: 'Courier New', monospace; font-size: 12px;">
                <div style="color: var(--se-acid);">⚔️ Battle starting...</div>
            </div>
            
            <!-- Result (hidden initially) -->
            <div id="battle-result" style="display: none; text-align: center; font-size: 24px; font-weight: bold; padding: 20px; border-radius: 8px; font-family: var(--font-display); letter-spacing: 0.08em;"></div>
            
            <button id="close-battle-btn" class="btn btn-secondary" style="width: 100%; display: none;" onclick="closeBattle()">
                CLOSE
            </button>
        </div>
    `;
}

function simulateBattle(gang, playerCombat) {
    const battleLog = document.getElementById('battle-log');
    const playerHPBar = document.getElementById('player-hp');
    const enemyHPBar = document.getElementById('enemy-hp');
    const resultDiv = document.getElementById('battle-result');
    const closeBtn = document.getElementById('close-battle-btn');
    
    let playerHP = 100;
    let enemyHP = 100;
    let round = 1;
    
    const battleInterval = setInterval(() => {
        // Player attacks
        const playerDamage = Math.floor((playerCombat / gang.power) * 20 + Math.random() * 10);
        enemyHP = Math.max(0, enemyHP - playerDamage);
        
        addBattleLog(`<div style="color: var(--se-acid);">⚔️ Round ${round}: You deal ${playerDamage} damage!</div>`);
        
        enemyHPBar.style.width = enemyHP + '%';
        enemyHPBar.textContent = Math.floor(enemyHP) + '%';
        
        if (enemyHP <= 0) {
            clearInterval(battleInterval);
            winBattle(gang, resultDiv, closeBtn);
            return;
        }
        
        // Enemy attacks
        setTimeout(() => {
            const enemyDamage = Math.floor((gang.power / playerCombat) * 20 + Math.random() * 10);
            playerHP = Math.max(0, playerHP - enemyDamage);
            
            addBattleLog(`<div style="color: var(--se-blood);">💥 ${gang.name} deals ${enemyDamage} damage!</div>`);
            
            playerHPBar.style.width = playerHP + '%';
            playerHPBar.textContent = Math.floor(playerHP) + '%';
            
            if (playerHP <= 0) {
                clearInterval(battleInterval);
                loseBattle(gang, resultDiv, closeBtn);
                return;
            }
        }, 500);
        
        round++;
    }, 1500);
}

function addBattleLog(html) {
    const battleLog = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.innerHTML = html;
    entry.style.cssText = 'margin-bottom: 5px; padding: 5px; border-left: 2px solid var(--se-acid); padding-left: 10px;';
    battleLog.appendChild(entry);
    battleLog.scrollTop = battleLog.scrollHeight;
}

function winBattle(gang, resultDiv, closeBtn) {
    addBattleLog(`<div style="color: var(--se-acid); font-weight: bold;">🏆 VICTORY! ${gang.name} defeated!</div>`);
    
    // Award rewards
    Object.entries(gang.rewards).forEach(([key, value]) => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += value;
        }
    });
    
    gameState.gangWarWins++;
    
    // Remove defeated gang and generate new one
    gameState.currentEnemyGangs = gameState.currentEnemyGangs.filter(g => g.id !== gang.id);
    const newGang = ENEMY_GANG_TEMPLATES[Math.floor(Math.random() * ENEMY_GANG_TEMPLATES.length)];
    const power = Math.floor(Math.random() * (newGang.maxPower - newGang.minPower + 1)) + newGang.minPower;
    gameState.currentEnemyGangs.push({
        ...newGang,
        id: Math.random(),
        power: power
    });
    
    resultDiv.innerHTML = `
        🏆 VICTORY!<br>
        <div style="font-size: 16px; margin-top: 10px; color: var(--se-acid);">
            ${Object.entries(gang.rewards).map(([k, v]) => `+${v} ${k}`).join(' · ')}
        </div>
    `;
    resultDiv.style.cssText = 'display: block; background: rgba(200, 255, 58, 0.2); border: 2px solid var(--se-acid); color: var(--se-acid); text-align: center; font-size: 24px; font-weight: bold; padding: 20px; border-radius: 8px; font-family: var(--font-display); letter-spacing: 0.08em;';
    closeBtn.style.display = 'block';
    
    notify('Gang War Victory!');
    
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
}

function loseBattle(gang, resultDiv, closeBtn) {
    addBattleLog(`<div style="color: var(--se-blood); font-weight: bold;">💀 DEFEAT! You were crushed by ${gang.name}!</div>`);
    
    gameState.gangWarLosses++;
    
    resultDiv.innerHTML = '💀 DEFEAT!<br><div style="font-size: 16px; margin-top: 10px;">Your gang was defeated. Train harder!</div>';
    resultDiv.style.cssText = 'display: block; background: rgba(210, 58, 44, 0.2); border: 2px solid var(--se-blood); color: var(--se-blood); text-align: center; font-size: 24px; font-weight: bold; padding: 20px; border-radius: 8px; font-family: var(--font-display); letter-spacing: 0.08em;';
    closeBtn.style.display = 'block';
    
    notify('Gang War Lost!', 'error');
}

function closeBattle() {
    const overlay = document.getElementById('battle-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    if (typeof renderGangWarsTab === 'function') {
        renderGangWarsTab();
    }
}

console.log('✅ game-gangwars.js loaded!');
