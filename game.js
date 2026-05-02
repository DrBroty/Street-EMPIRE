// ===== GAME STATE =====
const gameState = {
    money: 1000,
    respect: 0,
    influence: 0,
    weapons: 0,
    prestige: 0,
    baseLevel: 1,
    recruitCost: 500,
    upgradeCost: 5000,
    assignedPositions: {},
    characterInventory: {}, // charId: count
    lastUpdate: Date.now(),
    activeMissions: [],
    completedMissions: [],
    unlockedAchievements: [],
    currentFilter: 'all',
    playerLevel: 1
};

// ===== CONSTANTS =====
const POSITIONS = [
    { id: 'boss', name: 'Boss', income: 0, bonus: '+75% Total Income', preferredStat: 'leadership', multiplier: 1.75 },
    { id: 'lieutenant', name: 'Lieutenant', income: 150, bonus: '$150/sec', preferredStat: 'leadership', multiplier: 1 },
    { id: 'enforcer', name: 'Enforcer', income: 120, bonus: '$120/sec', preferredStat: 'strength', multiplier: 1 },
    { id: 'dealer', name: 'Dealer', income: 100, bonus: '$100/sec', preferredStat: 'intelligence', multiplier: 1 },
    { id: 'hacker', name: 'Hacker', income: 80, bonus: '+50 Influence/sec', preferredStat: 'intelligence', multiplier: 1 },
    { id: 'driver', name: 'Driver', income: 70, bonus: '+40 Respect/sec', preferredStat: 'agility', multiplier: 1 },
    { id: 'scout', name: 'Scout', income: 60, bonus: '+30 Respect/sec', preferredStat: 'agility', multiplier: 1 }
];

const RARITIES = [
    { name: 'common', chance: 0.50, statMultiplier: 1.0, color: '#888', recycleValue: 50 },
    { name: 'uncommon', chance: 0.30, statMultiplier: 1.4, color: '#00ff41', recycleValue: 150 },
    { name: 'rare', chance: 0.15, statMultiplier: 1.9, color: '#00bfff', recycleValue: 400 },
    { name: 'epic', chance: 0.04, statMultiplier: 2.5, color: '#9d00ff', recycleValue: 1000 },
    { name: 'legendary', chance: 0.009, statMultiplier: 3.5, color: '#ff9800', recycleValue: 3000 },

    // Erweiterung
    { name: 'mythic', chance: 0.0009, statMultiplier: 5.0, color: '#ff0055', recycleValue: 8000 },
    { name: 'ancient', chance: 0.00008, statMultiplier: 7.0, color: '#ffd700', recycleValue: 20000 },
    { name: 'divine', chance: 0.000009, statMultiplier: 10.0, color: '#00ffff', recycleValue: 50000 },
    { name: 'cosmic', chance: 0.0000009, statMultiplier: 14.0, color: '#4b00ff', recycleValue: 120000 },
    { name: 'transcendent', chance: 0.0000001, statMultiplier: 20.0, color: '#ffffff', recycleValue: 300000 }
];

const CHARACTER_NAMES = [
    'Marcus "Ghost"', 'Tony Rossi', 'Big Mike', 'Johnny Blaze', 'Vincent Cruz',
    'Paulie Romano', 'Sammy Black', 'Joey Marino', 'Tommy Vega', 'Frankie Bones',
    'Carlo Santos', 'Lucky Luke', 'Al Stone', 'Bugsy Miller', 'Meyer Gold',
    'Mad Dog Danny', 'Crazy Joe', 'Mickey Steel', 'Jimmy Stone', 'Henry Cross',
    'Nicky Raven', 'Carmine Viper', 'Anthony Blaze', 'John Frost', 'Sal Wolf',
    'Michael Knight', 'Peter Hawk', 'Larry Blade', 'Danny Count', 'Richie Dash',
    'Eddie Thunder', 'Bobby Ace', 'Stevie Rifle', 'Angelo King', 'Ralph Flash',
    'Matty Iron', 'Benny Quick', 'Jackie Blade', 'Philly Phantom', 'Dom Shadow',
    'Vito Titan', 'Gus Hammer', 'Lefty Trigger', 'Ricky Smoke', 'Chris Venom',
    'Eugene Beast', 'Nino Razor', 'Georgie Gunner', 'Ray Numbers', 'Sal Ice',
    'Lou Fist', 'Freddy Scar',

    // 🔥 Erweiterung (neue Charaktere)
    'Dario "Silk"', 'Marco Leone', 'Elijah Cross', 'Noah Vance', 'Leo Marconi',
    'Santino Vale', 'Rocco DeLuca', 'Enzo Ferraro', 'Luca Moretti', 'Gianni Russo',
    'Antonio Sable', 'Diego Cortez', 'Carlos Vega', 'Miguel Santos', 'Javier Cruz',
    'Andre Laurent', 'Pierre Dubois', 'Julien Noir', 'Victor Sokolov', 'Ivan Volkov',
    'Dmitri Petrov', 'Alexei Morozov', 'Sergei Ivanov', 'Boris Karpov',
    'Kenji Takahashi', 'Hiroshi Sato', 'Takeshi Nakamura', 'Ryo Tanaka',
    'Hassan Malik', 'Omar Farouk', 'Youssef Nadir', 'Khalid Rahman',
    'Zane Carter', 'Derek Mason', 'Tyler Briggs', 'Cole Harrison', 'Blake Mercer',
    'Reese Donovan', 'Shawn Mitchell', 'Logan Pierce', 'Hunter Blake',
    'Jax Monroe', 'Zack Ryder', 'Mason Drake', 'Cody Steele', 'Ethan Viper',
    'Noel Frost', 'Aiden Storm', 'Roman Knight', 'Atlas Grimm', 'Dex Carter',
    'Kane Bishop', 'Miles Vandal', 'Travis Lockwood', 'Silas Crow',
    'Damien Knox', 'Victor Hale', 'Grayson Wolfe', 'Lincoln Shade',
    'Ryder Steel', 'Phoenix Ward', 'Axel Stone', 'Jett Falcon'
];

const MISSION_TEMPLATES = [
    {
        title: 'Street Race',
        desc: 'Win an illegal street race through Downtown. High speed, high stakes.',
        difficulty: 'easy',
        requirements: { gangPower: 100 },
        duration: 30,
        rewards: { money: 2000, respect: 50 }
    },
    {
        title: 'Territory Grab',
        desc: 'Take over a rival gang\'s territory. Show them who runs these streets.',
        difficulty: 'medium',
        requirements: { gangPower: 300, weapons: 10 },
        duration: 60,
        rewards: { money: 5000, respect: 150, influence: 50 }
    },
    {
        title: 'Arms Deal',
        desc: 'Complete a major weapons transaction with an underground dealer.',
        difficulty: 'easy',
        requirements: { gangPower: 150 },
        duration: 45,
        rewards: { money: 3000, weapons: 55 }
    },
    {
        title: 'Bank Heist',
        desc: 'Rob the Pacific Standard Bank. Plan carefully, execute perfectly.',
        difficulty: 'hard',
        requirements: { gangPower: 500, influence: 200 },
        duration: 120,
        rewards: { money: 15000, respect: 300, prestige: 1, weapons: 25 }
    },
    {
        title: 'Drug Shipment',
        desc: 'Secure and deliver a major drug shipment across the city.',
        difficulty: 'medium',
        requirements: { gangPower: 250 },
        duration: 90,
        rewards: { money: 8000, influence: 100, weapons: 10 }
    },
    {
        title: 'Assassination Contract',
        desc: 'Eliminate a high-value target. Clean, professional, no witnesses.',
        difficulty: 'hard',
        requirements: { gangPower: 450, weapons: 50 },
        duration: 120,
        rewards: { money: 12000, respect: 250, prestige: 1, weapons: 100 }
    },
    {
        title: 'Underground Fight',
        desc: 'Win an underground fighting tournament. Brutal, no rules.',
        difficulty: 'medium',
        requirements: { gangPower: 200 },
        duration: 60,
        rewards: { money: 4500, respect: 120 }
    },
    {
        title: 'Cargo Theft',
        desc: 'Steal a high-value cargo shipment from the docks.',
        difficulty: 'easy',
        requirements: { gangPower: 120 },
        duration: 40,
        rewards: { money: 2500, weapons: 15 }
    },
    {
        title: 'Turf War',
        desc: 'Defend your territory from a massive rival gang attack.',
        difficulty: 'hard',
        requirements: { gangPower: 600, weapons: 75 },
        duration: 180,
        rewards: { money: 20000, respect: 500, influence: 200, prestige: 2 }
    },
    {
        title: 'Nightclub Takeover',
        desc: 'Take control of the hottest nightclub in the city.',
        difficulty: 'medium',
        requirements: { gangPower: 350, influence: 150 },
        duration: 75,
        rewards: { money: 7000, respect: 180, influence: 80 }
    },

    // 🔥 NEUE MISSIONEN (Endgame / High Tier)

    {
        title: 'Cartel Alliance',
        desc: 'Negotiate and secure an alliance with a powerful cartel. High risk diplomacy.',
        difficulty: 'very_hard',
        requirements: { gangPower: 800, influence: 400, prestige: 2 },
        duration: 180,
        rewards: { money: 30000, respect: 700, influence: 400, prestige: 2 }
    },
    {
        title: 'Citywide Blackout',
        desc: 'Shut down the entire city grid to create chaos and opportunity.',
        difficulty: 'very_hard',
        requirements: { gangPower: 900, weapons: 150, influence: 300 },
        duration: 150,
        rewards: { money: 28000, respect: 600, influence: 300 }
    },
    {
        title: 'Federal Convoy Ambush',
        desc: 'Ambush a heavily guarded federal convoy transporting classified cargo.',
        difficulty: 'extreme',
        requirements: { gangPower: 1200, weapons: 250, prestige: 3 },
        duration: 210,
        rewards: { money: 50000, weapons: 300, respect: 1000, prestige: 3 }
    },
    {
        title: 'Prison Break',
        desc: 'Break out a high-profile inmate from a maximum security prison.',
        difficulty: 'extreme',
        requirements: { gangPower: 1100, influence: 500, weapons: 200 },
        duration: 240,
        rewards: { money: 45000, respect: 900, influence: 400, prestige: 2 }
    },
    {
        title: 'Corporate Infiltration',
        desc: 'Infiltrate a major corporation and extract sensitive data.',
        difficulty: 'very_hard',
        requirements: { gangPower: 850, influence: 600 },
        duration: 160,
        rewards: { money: 35000, influence: 500, respect: 500 }
    },
    {
        title: 'Global Smuggling Network',
        desc: 'Establish a global smuggling network across multiple countries.',
        difficulty: 'legendary',
        requirements: { gangPower: 1500, influence: 800, prestige: 4 },
        duration: 300,
        rewards: { money: 100000, influence: 800, respect: 1500, prestige: 5 }
    },
    {
        title: 'Shadow Government Deal',
        desc: 'Strike a deal with corrupt officials controlling the city behind the scenes.',
        difficulty: 'legendary',
        requirements: { gangPower: 1400, influence: 1000, prestige: 5 },
        duration: 280,
        rewards: { money: 120000, influence: 1000, respect: 1200, prestige: 6 }
    },
    {
        title: 'Kingpin Ascension',
        desc: 'Eliminate all major rivals and claim absolute control over the city.',
        difficulty: 'legendary',
        requirements: { gangPower: 2000, weapons: 500, influence: 1200, prestige: 6 },
        duration: 360,
        rewards: { money: 250000, respect: 3000, influence: 2000, prestige: 10 }
    }
];

const ACHIEVEMENTS = [
    { id: 'first_recruit', name: 'First Blood', desc: 'Recruit your first crew member', icon: '👤', requirement: { type: 'recruits', value: 1 }, reward: { money: 5000 } },
    { id: 'gang_of_five', name: 'Gang of Five', desc: 'Have 5 crew members', icon: '👥', requirement: { type: 'recruits', value: 5 }, reward: { money: 20000, respect: 100 } },
    { id: 'crew_master', name: 'Crew Master', desc: 'Have 25 crew members', icon: '🧠', requirement: { type: 'recruits', value: 25 }, reward: { money: 50000, respect: 300 } },
    { id: 'crew_legend', name: 'Crew Legend', desc: 'Have 50 crew members', icon: '👑', requirement: { type: 'recruits', value: 50 }, reward: { prestige: 2, influence: 300 } },

    { id: 'full_crew', name: 'Full Crew', desc: 'Collect all 52 characters', icon: '🎖️', requirement: { type: 'collection', value: 52 }, reward: { money: 50000, prestige: 5 } },

    { id: 'first_mission', name: 'Mission Starter', desc: 'Complete your first mission', icon: '🎯', requirement: { type: 'missions', value: 1 }, reward: { weapons: 10 } },
    { id: 'mission_veteran', name: 'Mission Veteran', desc: 'Complete 10 missions', icon: '⭐', requirement: { type: 'missions', value: 10 }, reward: { money: 10000, prestige: 1 } },
    { id: 'mission_expert', name: 'Mission Expert', desc: 'Complete 50 missions', icon: '🔥', requirement: { type: 'missions', value: 50 }, reward: { money: 50000, respect: 500 } },
    { id: 'mission_overlord', name: 'Mission Overlord', desc: 'Complete 200 missions', icon: '💀', requirement: { type: 'missions', value: 200 }, reward: { prestige: 3, influence: 500 } },

    { id: 'rich', name: 'Money Maker', desc: 'Accumulate $100,000', icon: '💰', requirement: { type: 'money', value: 100000 }, reward: { prestige: 2 } },
    { id: 'millionaire', name: 'Millionaire', desc: 'Accumulate $1,000,000', icon: '🤑', requirement: { type: 'money', value: 1000000 }, reward: { prestige: 3 } },
    { id: 'billionaire', name: 'Underworld Tycoon', desc: 'Accumulate $10,000,000', icon: '🏦', requirement: { type: 'money', value: 10000000 }, reward: { prestige: 5, influence: 1000 } },

    { id: 'respected', name: 'Respected', desc: 'Gain 1,000 Respect', icon: '💎', requirement: { type: 'respect', value: 1000 }, reward: { influence: 500 } },
    { id: 'feared', name: 'Feared', desc: 'Gain 5,000 Respect', icon: '😈', requirement: { type: 'respect', value: 5000 }, reward: { prestige: 2 } },
    { id: 'legend_status', name: 'Living Legend', desc: 'Gain 20,000 Respect', icon: '👑', requirement: { type: 'respect', value: 20000 }, reward: { prestige: 5, influence: 2000 } },

    { id: 'legendary_pull', name: 'Lucky Draw', desc: 'Recruit a Legendary character', icon: '🌟', requirement: { type: 'legendary', value: 1 }, reward: { money: 500000 } },
    { id: 'mythic_pull', name: 'Myth Hunter', desc: 'Recruit a Mythic character', icon: '🔥', requirement: { type: 'mythic', value: 1 }, reward: { prestige: 2, money: 200000 } },
    { id: 'divine_pull', name: 'Divine Intervention', desc: 'Recruit a Divine character', icon: '⚡', requirement: { type: 'divine', value: 1 }, reward: { prestige: 4, influence: 1000 } },
    { id: 'transcendent_pull', name: 'Beyond Reality', desc: 'Recruit a Transcendent character', icon: '🌌', requirement: { type: 'transcendent', value: 1 }, reward: { prestige: 10 } },

    { id: 'empire_builder', name: 'Empire Builder', desc: 'Upgrade territory to max level', icon: '🏢', requirement: { type: 'territory', value: 3 }, reward: { money: 20000, prestige: 3 } },
    { id: 'world_domination', name: 'World Domination', desc: 'Max all territories', icon: '🌍', requirement: { type: 'territory_max_all', value: 1 }, reward: { prestige: 5, influence: 1500 } },

    { id: 'arsenal', name: 'Armed & Dangerous', desc: 'Accumulate 500 weapons', icon: '🔫', requirement: { type: 'weapons', value: 500 }, reward: { prestige: 1 } },
    { id: 'war_machine', name: 'War Machine', desc: 'Accumulate 2000 weapons', icon: '💣', requirement: { type: 'weapons', value: 2000 }, reward: { prestige: 3 } },
    { id: 'arsenal_god', name: 'Arsenal God', desc: 'Accumulate 10000 weapons', icon: '☢️', requirement: { type: 'weapons', value: 10000 }, reward: { prestige: 6 } },

    // 🔥 ENDGAME / FLEX ACHIEVEMENTS

    { id: 'prestige_1', name: 'New Beginning', desc: 'Reach Prestige Level 1', icon: '🔁', requirement: { type: 'prestige', value: 1 }, reward: { money: 50000 } },
    { id: 'prestige_5', name: 'Rising Power', desc: 'Reach Prestige Level 5', icon: '🚀', requirement: { type: 'prestige', value: 5 }, reward: { influence: 2000 } },
    { id: 'prestige_10', name: 'Untouchable', desc: 'Reach Prestige Level 10', icon: '⚜️', requirement: { type: 'prestige', value: 10 }, reward: { money: 200000, influence: 5000 } },

    { id: 'completionist', name: 'Completionist', desc: 'Unlock 50 achievements', icon: '📜', requirement: { type: 'achievements', value: 50 }, reward: { prestige: 5 } },

    { id: 'godfather', name: 'The Godfather', desc: 'Reach endgame dominance across all systems', icon: '🕴️', requirement: { type: 'meta', value: 1 }, reward: { prestige: 20, money: 1000000, influence: 10000 } }
];

// Generate Characters (persistent stats)
let ALL_CHARACTERS = [];

function initializeCharacters() {
    const seed = 12345; // Fixed seed for consistent generation
    let rng = seed;
    
    function seededRandom() {
        rng = (rng * 9301 + 49297) % 233280;
        return rng / 233280;
    }
    
    ALL_CHARACTERS = CHARACTER_NAMES.map((name, index) => {
        // Determine rarity based on seeded random
        const roll = seededRandom();
        let cumulative = 0;
        let rarity = RARITIES[0];
        
        for (const r of RARITIES) {
            cumulative += r.chance;
            if (roll <= cumulative) {
                rarity = r;
                break;
            }
        }
        
        const baseStats = {
            strength: Math.floor(seededRandom() * 40) + 30,
            intelligence: Math.floor(seededRandom() * 40) + 30,
            agility: Math.floor(seededRandom() * 40) + 30,
            leadership: Math.floor(seededRandom() * 40) + 30
        };
        
        const emojis = ['👤', '🎭', '💀', '👁️', '🔪', '🎯', '⚡', '💣', '🔫', '🎲'];
        const emoji = emojis[Math.floor(seededRandom() * emojis.length)];
        
        return {
            id: index,
            name: name,
            rarity: rarity.name,
            emoji: emoji,
            strength: Math.floor(baseStats.strength * rarity.statMultiplier),
            intelligence: Math.floor(baseStats.intelligence * rarity.statMultiplier),
            agility: Math.floor(baseStats.agility * rarity.statMultiplier),
            leadership: Math.floor(baseStats.leadership * rarity.statMultiplier)
        };
    });
}

// ===== INITIALIZATION =====
function initGame() {
    initializeCharacters();
    loadGame();
    
    renderPositions();
    renderCharacters();
    renderTerritory();
    renderMissions();
    renderCollection();
    renderAchievements();
    updateUI();
    
    if (gameState.activeMissions.length === 0) {
        generateInitialMissions();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Start game loops
    setInterval(update, 1000); // Main update loop
    setInterval(saveGame, 5000); // Auto-save
}

function setupEventListeners() {
    // Main tabs
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.addEventListener('click', () => switchMainTab(tab.dataset.tab));
    });
    
    // Character tabs
    document.querySelectorAll('.char-tab').forEach(tab => {
        tab.addEventListener('click', () => switchCharTab(tab.dataset.tab));
    });
    
    // Rarity filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.currentFilter = btn.dataset.rarity;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCollection();
        });
    });
    
    // Buttons
    document.getElementById('recruit-btn').addEventListener('click', recruitCharacter);
    document.getElementById('upgrade-base-btn').addEventListener('click', upgradeTerritory);
    
    // Modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) closeModal();
    });
}

// ===== MAIN TAB SWITCHING =====
function switchMainTab(tab) {
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

function switchCharTab(tab) {
    document.querySelectorAll('.char-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.char-tab[data-tab="${tab}"]`).classList.add('active');
    
    if (tab === 'owned') {
        document.getElementById('owned-chars-grid').style.display = 'grid';
        document.getElementById('inventory-chars-grid').style.display = 'none';
    } else {
        document.getElementById('owned-chars-grid').style.display = 'none';
        document.getElementById('inventory-chars-grid').style.display = 'grid';
    }
}

// ===== RENDER FUNCTIONS =====
function renderPositions() {
    const grid = document.getElementById('positions-grid');
    grid.innerHTML = '';
    
    POSITIONS.forEach(pos => {
        const card = document.createElement('div');
        card.className = 'position-card';
        
        const assignedCharId = gameState.assignedPositions[pos.id];
        
        if (assignedCharId !== undefined) {
            card.classList.add('filled');
            const char = ALL_CHARACTERS.find(c => c.id === assignedCharId);
            
            if (char) {
                card.innerHTML = `
                    <div class="position-name">${pos.name}</div>
                    <div class="position-income">${pos.bonus}</div>
                    <div class="assigned-char">
                        <div class="char-avatar rarity-${char.rarity}">${char.emoji}</div>
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
                <div class="position-income">${pos.bonus}</div>
                <div style="text-align: center; padding: 20px; color: #555;">Empty Slot</div>
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

function renderCharacters() {
    const ownedGrid = document.getElementById('owned-chars-grid');
    const inventoryGrid = document.getElementById('inventory-chars-grid');
    
    ownedGrid.innerHTML = '';
    inventoryGrid.innerHTML = '';
    
    // Get assigned character IDs
    const assignedIds = Object.values(gameState.assignedPositions);
    
    // Owned characters (assigned to positions)
    assignedIds.forEach(charId => {
        if (charId !== undefined) {
            const char = ALL_CHARACTERS.find(c => c.id === charId);
            if (char) {
                const card = createCharacterCard(char, true);
                ownedGrid.appendChild(card);
            }
        }
    });
    
    // Inventory characters (in storage)
    Object.entries(gameState.characterInventory).forEach(([charId, count]) => {
        const char = ALL_CHARACTERS.find(c => c.id === parseInt(charId));
        if (char && count > 0) {
            for (let i = 0; i < count; i++) {
                const card = createCharacterCard(char, false);
                inventoryGrid.appendChild(card);
            }
        }
    });
    
    document.getElementById('owned-count').textContent = assignedIds.filter(id => id !== undefined).length;
    document.getElementById('inventory-count').textContent = Object.values(gameState.characterInventory).reduce((a, b) => a + b, 0);
}

function createCharacterCard(char, isAssigned) {
    const card = document.createElement('div');
    card.className = 'char-card-small';
    
    const rarity = RARITIES.find(r => r.name === char.rarity);
    
    card.innerHTML = `
        <div class="char-portrait-small rarity-${char.rarity}">${char.emoji}</div>
        <div class="char-card-name">${char.name}</div>
        <div class="char-card-rarity" style="color: ${rarity.color}">${char.rarity}</div>
        ${!isAssigned ? `
            <div class="char-card-actions">
                <button class="btn-recycle" onclick="recycleCharacter(${char.id})">
                    Recycle $${rarity.recycleValue}
                </button>
            </div>
        ` : ''}
    `;
    
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            showCharacterDetail(char);
        }
    });
    
    return card;
}

function renderTerritory() {
    const view = document.getElementById('territory-view');
    const existingBuildings = view.querySelectorAll('.territory-building');
    existingBuildings.forEach(b => b.remove());
    
    if (gameState.baseLevel >= 1) {
        const b1 = createBuilding('building-level-1', 2, 2);
        view.appendChild(b1);
    }
    
    if (gameState.baseLevel >= 2) {
        const b2 = createBuilding('building-level-2', 3, 3);
        view.appendChild(b2);
    }
    
    if (gameState.baseLevel >= 3) {
        const b3 = createBuilding('building-level-3', 5, 4);
        view.appendChild(b3);
    }
    
    document.getElementById('base-level').textContent = gameState.baseLevel;
    updateUpgradeButton();
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
                light.style.left = (c * sx - 7.5) + 'px';
                light.style.top = (r * sy - 9) + 'px';
                light.style.animationDelay = (Math.random() * 3) + 's';
                building.appendChild(light);
            }
        }
    }, 100);
    
    return building;
}

function renderMissions() {
    const grid = document.getElementById('missions-grid');
    grid.innerHTML = '';
    
    gameState.activeMissions.forEach(mission => {
        const card = document.createElement('div');
        card.className = `mission-card ${mission.status}`;
        
        const canStart = checkMissionRequirements(mission);
        const progress = mission.status === 'active' && mission.startTime
            ? Math.min(100, ((Date.now() - mission.startTime) / (mission.duration * 1000)) * 100)
            : 0;
        
        const timeRemaining = mission.status === 'active' && mission.startTime
            ? Math.max(0, mission.duration - Math.floor((Date.now() - mission.startTime) / 1000))
            : 0;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
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
                <div class="mission-timer">Time: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
                <div class="mission-progress">
                    <div class="mission-progress-bar" style="width: ${progress}%">${Math.floor(progress)}%</div>
                </div>
            ` : ''}
            ${mission.status === 'available' ? `
                <button class="btn btn-full" onclick="startMission(${mission.id})" ${!canStart ? 'disabled' : ''}>
                    ${canStart ? 'START MISSION' : 'REQUIREMENTS NOT MET'}
                </button>
            ` : ''}
        `;
        
        grid.appendChild(card);
    });
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
    
    // Get all collected character IDs
    const collected = new Set([
        ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
        ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
    ]);
    
    // Filter by rarity
    let characters = ALL_CHARACTERS;
    if (gameState.currentFilter !== 'all') {
        characters = characters.filter(c => c.rarity === gameState.currentFilter);
    }
    
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        
        const isCollected = collected.has(char.id);
        if (!isCollected) card.classList.add('locked');
        
        const rarity = RARITIES.find(r => r.name === char.rarity);
        
        card.innerHTML = `
            <div class="char-portrait-large rarity-${char.rarity}">${isCollected ? char.emoji : '🔒'}</div>
            <div class="collection-card-name">${isCollected ? char.name : '???'}</div>
            <div class="collection-card-rarity" style="color: ${rarity.color}">${isCollected ? char.rarity : 'LOCKED'}</div>
            ${isCollected ? `
                <div class="collection-card-stats">
                    <div class="collection-stat-item">
                        <div class="collection-stat-label">STR</div>
                        <div class="collection-stat-value">${char.strength}</div>
                    </div>
                    <div class="collection-stat-item">
                        <div class="collection-stat-label">INT</div>
                        <div class="collection-stat-value">${char.intelligence}</div>
                    </div>
                    <div class="collection-stat-item">
                        <div class="collection-stat-label">AGI</div>
                        <div class="collection-stat-value">${char.agility}</div>
                    </div>
                    <div class="collection-stat-item">
                        <div class="collection-stat-label">LEAD</div>
                        <div class="collection-stat-value">${char.leadership}</div>
                    </div>
                </div>
            ` : ''}
        `;
        
        if (isCollected) {
            card.addEventListener('click', () => showCharacterDetail(char));
        }
        
        grid.appendChild(card);
    });
    
    // Update stats
    document.getElementById('collection-progress').textContent = `${collected.size}/52`;
    document.getElementById('collection-percentage').textContent = `${Math.floor((collected.size / 52) * 100)}%`;
}

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    ACHIEVEMENTS.forEach(achievement => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        
        const isUnlocked = gameState.unlockedAchievements.includes(achievement.id);
        if (isUnlocked) card.classList.add('unlocked');
        
        const progress = getAchievementProgress(achievement);
        const progressPercent = Math.min(100, (progress / achievement.requirement.value) * 100);
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
                <div class="achievement-reward">
                    Reward: ${Object.entries(achievement.reward).map(([k, v]) => `${k}: +${v}`).join(', ')}
                </div>
                ${!isUnlocked ? `
                    <div class="achievement-progress-bar">
                        <div class="achievement-progress-fill" style="width: ${progressPercent}%">
                            ${progress}/${achievement.requirement.value}
                        </div>
                    </div>
                ` : '<div style="color: #00ff41; font-weight: bold; margin-top: 10px;">✓ UNLOCKED</div>'}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ===== GAME LOGIC =====
function update() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
    
    // Calculate income
    let income = 0;
    let respectIncome = 0;
    let influenceIncome = 0;
    
    POSITIONS.forEach(pos => {
        const charId = gameState.assignedPositions[pos.id];
        if (charId !== undefined) {
            if (pos.id === 'hacker') {
                influenceIncome += 50;
            } else if (pos.id === 'driver') {
                respectIncome += 40;
            } else if (pos.id === 'scout') {
                respectIncome += 30;
            } else {
                income += pos.income;
            }
        }
    });
    
    // Boss multiplier
    if (gameState.assignedPositions.boss !== undefined) {
        income *= 1.75;
    }
    
    // Base multiplier
    const baseMult = 1 + (gameState.baseLevel - 1) * 0.6;
    income *= baseMult;
    respectIncome *= baseMult;
    influenceIncome *= baseMult;
    
    gameState.money += Math.floor(income * delta);
    gameState.respect += Math.floor(respectIncome * delta);
    gameState.influence += Math.floor(influenceIncome * delta);
    
    // Update missions
    updateMissions();
    
    // Check achievements
    checkAchievements();
    
    // Update UI
    updateUI();
}

function updateMissions() {
    let needsRender = false;
    
    gameState.activeMissions.forEach((mission, index) => {
        if (mission.status === 'active' && mission.startTime) {
            const elapsed = Date.now() - mission.startTime;
            if (elapsed >= mission.duration * 1000) {
                completeMission(mission);
                needsRender = true;
            }
        }
    });
    
    if (needsRender) {
        renderMissions();
    } else {
        // Just update progress bars
        gameState.activeMissions.forEach((mission) => {
            if (mission.status === 'active' && mission.startTime) {
                const elapsed = Date.now() - mission.startTime;
                const progress = Math.min(100, (elapsed / (mission.duration * 1000)) * 100);
                const timeRemaining = Math.max(0, mission.duration - Math.floor(elapsed / 1000));
                
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                
                // Find and update the mission card
                const cards = document.querySelectorAll('.mission-card.active');
                cards.forEach(card => {
                    if (card.querySelector('.mission-title').textContent === mission.title) {
                        const bar = card.querySelector('.mission-progress-bar');
                        const timer = card.querySelector('.mission-timer');
                        if (bar) bar.style.width = progress + '%';
                        if (bar) bar.textContent = Math.floor(progress) + '%';
                        if (timer) timer.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                });
            }
        });
    }
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
    renderMissions();
}

function completeMission(mission) {
    // Award rewards
    Object.entries(mission.rewards).forEach(([key, value]) => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += value;
        }
    });
    
    // Track completion
    gameState.activeMissions = gameState.activeMissions.filter(m => m.id !== mission.id);
    gameState.completedMissions.push(mission.id);
    
    // Generate new mission
    generateNewMission();
    
    notify(`Mission "${mission.title}" completed!`);
    updateUI();
}

function generateInitialMissions() {
    for (let i = 0; i < 3; i++) {
        generateNewMission();
    }
    renderMissions();
}

function generateNewMission() {
    const template = MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
    gameState.activeMissions.push({
        ...template,
        id: Date.now() + Math.random(),
        startTime: null,
        status: 'available'
    });
}

function calculateGangPower() {
    let power = 0;
    POSITIONS.forEach(pos => {
        const charId = gameState.assignedPositions[pos.id];
        if (charId !== undefined) {
            const char = ALL_CHARACTERS.find(c => c.id === charId);
            if (char) {
                power += char[pos.preferredStat];
            }
        }
    });
    return power;
}

function recruitCharacter() {
    if (gameState.money < gameState.recruitCost) {
        notify('Not enough cash!', 'error');
        return;
    }
    
    // Pick random character
    const newChar = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
    
    gameState.money -= gameState.recruitCost;
    gameState.recruitCost = Math.floor(gameState.recruitCost * 1.8);
    
    // Add to inventory
    if (!gameState.characterInventory[newChar.id]) {
        gameState.characterInventory[newChar.id] = 0;
    }
    gameState.characterInventory[newChar.id]++;
    
    notify(`${newChar.name} (${newChar.rarity}) recruited!`);
    updateUI();
    renderCharacters();
    showCharacterDetail(newChar);
}

function recycleCharacter(charId) {
    if (!gameState.characterInventory[charId] || gameState.characterInventory[charId] <= 0) {
        return;
    }
    
    const char = ALL_CHARACTERS.find(c => c.id === charId);
    const rarity = RARITIES.find(r => r.name === char.rarity);
    
    gameState.characterInventory[charId]--;
    if (gameState.characterInventory[charId] === 0) {
        delete gameState.characterInventory[charId];
    }
    
    gameState.money += rarity.recycleValue;
    
    notify(`Recycled ${char.name} for $${rarity.recycleValue}`);
    updateUI();
    renderCharacters();
}

function upgradeTerritory() {
    if (gameState.baseLevel >= 3) {
        notify('Territory already maxed out!');
        return;
    }
    
    if (gameState.money < gameState.upgradeCost) {
        notify('Not enough cash!', 'error');
        return;
    }
    
    gameState.money -= gameState.upgradeCost;
    gameState.baseLevel++;
    gameState.upgradeCost = Math.floor(gameState.upgradeCost * 4);
    
    notify(`Territory upgraded to Level ${gameState.baseLevel}!`);
    renderTerritory();
    updateUI();
}

function updateUpgradeButton() {
    const btn = document.getElementById('upgrade-base-btn');
    const cost = document.getElementById('upgrade-cost');
    
    if (gameState.baseLevel >= 3) {
        btn.disabled = true;
        btn.innerHTML = 'MAX LEVEL';
    } else {
        cost.textContent = '$' + gameState.upgradeCost.toLocaleString();
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

function getAchievementProgress(achievement) {
    const type = achievement.requirement.type;
    
    if (type === 'recruits') {
        return Object.values(gameState.assignedPositions).filter(id => id !== undefined).length +
               Object.values(gameState.characterInventory).reduce((a, b) => a + b, 0);
    } else if (type === 'collection') {
        const collected = new Set([
            ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
            ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
        ]);
        return collected.size;
    } else if (type === 'missions') {
        return gameState.completedMissions.length;
    } else if (type === 'money') {
        return gameState.money;
    } else if (type === 'respect') {
        return gameState.respect;
    } else if (type === 'legendary') {
        const collected = [
            ...Object.values(gameState.assignedPositions).filter(id => id !== undefined),
            ...Object.keys(gameState.characterInventory).map(id => parseInt(id))
        ];
        return collected.filter(id => {
            const char = ALL_CHARACTERS.find(c => c.id === id);
            return char && char.rarity === 'legendary';
        }).length;
    } else if (type === 'territory') {
        return gameState.baseLevel;
    } else if (type === 'weapons') {
        return gameState.weapons;
    }
    
    return 0;
}

function unlockAchievement(achievement) {
    gameState.unlockedAchievements.push(achievement.id);
    
    // Award rewards
    Object.entries(achievement.reward).forEach(([key, value]) => {
        if (gameState.hasOwnProperty(key)) {
            gameState[key] += value;
        }
    });
    
    notify(`Achievement Unlocked: ${achievement.name}!`);
    renderAchievements();
    updateUI();
}

// ===== MODALS =====
function openAssignModal(posId) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    const pos = POSITIONS.find(p => p.id === posId);
    
    // Get available characters from inventory
    const available = Object.entries(gameState.characterInventory)
        .filter(([charId, count]) => count > 0)
        .map(([charId]) => ALL_CHARACTERS.find(c => c.id === parseInt(charId)));
    
    body.innerHTML = `
        <h2 style="color: #fff; margin-bottom: 15px;">ASSIGN TO ${pos.name.toUpperCase()}</h2>
        <div style="margin-bottom: 15px; color: #00ff41; font-size: 1.1em;">${pos.bonus}</div>
        <div style="margin-bottom: 25px; color: #999;">Preferred Stat: ${pos.preferredStat.toUpperCase()}</div>
        
        ${available.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px;">
                ${available.map(char => {
                    const rarity = RARITIES.find(r => r.name === char.rarity);
                    return `
                        <div class="char-card-small" onclick="assignPosition('${posId}', ${char.id})">
                            <div class="char-portrait-small rarity-${char.rarity}">${char.emoji}</div>
                            <div class="char-card-name">${char.name}</div>
                            <div class="char-card-rarity" style="color: ${rarity.color}">${char.rarity}</div>
                            <div style="margin-top: 8px; font-size: 0.9em; color: #00ff41;">
                                ${pos.preferredStat.toUpperCase()}: ${char[pos.preferredStat]}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '<div style="text-align: center; padding: 40px; color: #666;">No characters in inventory. Recruit some first!</div>'}
    `;
    
    modal.style.display = 'block';
}

function assignPosition(posId, charId) {
    // Remove from inventory
    if (gameState.characterInventory[charId]) {
        gameState.characterInventory[charId]--;
        if (gameState.characterInventory[charId] === 0) {
            delete gameState.characterInventory[charId];
        }
    }
    
    // If position already filled, return old char to inventory
    const oldCharId = gameState.assignedPositions[posId];
    if (oldCharId !== undefined) {
        if (!gameState.characterInventory[oldCharId]) {
            gameState.characterInventory[oldCharId] = 0;
        }
        gameState.characterInventory[oldCharId]++;
    }
    
    // Assign new character
    gameState.assignedPositions[posId] = charId;
    
    renderPositions();
    renderCharacters();
    renderCollection();
    closeModal();
    notify('Character assigned!');
}

function unassignPosition(posId) {
    const charId = gameState.assignedPositions[posId];
    if (charId === undefined) return;
    
    // Return to inventory
    if (!gameState.characterInventory[charId]) {
        gameState.characterInventory[charId] = 0;
    }
    gameState.characterInventory[charId]++;
    
    delete gameState.assignedPositions[posId];
    
    renderPositions();
    renderCharacters();
    renderCollection();
    notify('Character unassigned!');
}

function showCharacterDetail(char) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    
    const rarity = RARITIES.find(r => r.name === char.rarity);
    const assigned = Object.entries(gameState.assignedPositions).find(([k, v]) => v === char.id);
    
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <div class="char-portrait-large rarity-${char.rarity}" style="margin: 0 auto 20px;">
                ${char.emoji}
            </div>
            <h2 style="color: #fff; margin-bottom: 8px;">${char.name}</h2>
            <div style="color: ${rarity.color}; text-transform: uppercase; font-weight: bold; font-size: 1.1em; letter-spacing: 2px;">
                ${char.rarity}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div class="collection-stat-item">
                <div class="collection-stat-label">STRENGTH</div>
                <div class="collection-stat-value">${char.strength}</div>
            </div>
            <div class="collection-stat-item">
                <div class="collection-stat-label">INTELLIGENCE</div>
                <div class="collection-stat-value">${char.intelligence}</div>
            </div>
            <div class="collection-stat-item">
                <div class="collection-stat-label">AGILITY</div>
                <div class="collection-stat-value">${char.agility}</div>
            </div>
            <div class="collection-stat-item">
                <div class="collection-stat-label">LEADERSHIP</div>
                <div class="collection-stat-value">${char.leadership}</div>
            </div>
        </div>
        
        ${assigned ? `
            <div style="padding: 15px; background: rgba(0, 255, 65, 0.1); border: 1px solid rgba(0, 255, 65, 0.3); border-radius: 4px;">
                Currently assigned: <strong>${POSITIONS.find(p => p.id === assigned[0]).name}</strong>
            </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// ===== UI UPDATES =====
function updateUI() {
    document.getElementById('money').textContent = '$' + Math.floor(gameState.money).toLocaleString();
    document.getElementById('respect').textContent = Math.floor(gameState.respect).toLocaleString();
    document.getElementById('influence').textContent = Math.floor(gameState.influence).toLocaleString();
    document.getElementById('weapons').textContent = Math.floor(gameState.weapons).toLocaleString();
    document.getElementById('prestige').textContent = Math.floor(gameState.prestige).toLocaleString();
    document.getElementById('recruit-cost').textContent = '$' + gameState.recruitCost.toLocaleString();
    
    const gangPower = calculateGangPower();
    document.getElementById('gang-power').textContent = gangPower.toLocaleString();
    
    // Calculate income
    let income = 0;
    POSITIONS.forEach(pos => {
        const charId = gameState.assignedPositions[pos.id];
        if (charId !== undefined && pos.income > 0) {
            income += pos.income;
        }
    });
    if (gameState.assignedPositions.boss !== undefined) {
        income *= 1.75;
    }
    income *= (1 + (gameState.baseLevel - 1) * 0.6);
    
    document.getElementById('income-rate').textContent = '$' + Math.floor(income).toLocaleString();
}

// ===== NOTIFICATIONS =====
function notify(message, type = 'success') {
    const container = document.getElementById('notifications');
    const notif = document.createElement('div');
    notif.className = 'notification' + (type === 'error' ? ' error' : '');
    notif.textContent = message;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ===== SAVE/LOAD =====
function saveGame() {
    localStorage.setItem('streetEmpireV3', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('streetEmpireV3');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            Object.assign(gameState, loaded);
            gameState.lastUpdate = Date.now();
            notify('Game loaded!');
        } catch (e) {
            console.error('Failed to load save:', e);
        }
    }
}

// ===== START GAME =====
window.addEventListener('DOMContentLoaded', initGame);