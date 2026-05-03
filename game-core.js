// ===== STREET EMPIRE - CORE LOGIC =====
// Part 1/3: State Management, Constants, Core Functions
console.log('📦 Loading game-core.js...');

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
    characterInventory: {},
    lastUpdate: Date.now(),
    activeMissions: [],
    completedMissions: [],
    completedEasyMissions: 0,
    completedHardMissions: 0,
    speedMissionCompleted: 0,
    unlockedAchievements: [],
    currentFilter: 'all',
    totalRecruits: 0,
    gangWarWins: 0,
    gangWarLosses: 0,
    currentEnemyGangs: []
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

const DEFAULT_CHARACTER_NAMES = [
    // Original 52
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
    
    // +36 New Characters
    'Diego "El Diablo"', 'Viktor Kozlov', 'Alejandro Cruz', 'Dimitri Volkov', 'Hassan "The Lion"',
    'Kenji Yamamoto', 'Chen "Dragon" Li', 'Jamal "Streets" Washington', 'Andre Baptiste', 'Marco Valentino',
    'Sergei Petrov', 'Pablo Escobar Jr', 'Boris "The Butcher"', 'Rashid Al-Mansour', 'Takeshi Tanaka',
    'Wong "Tiger" Lee', 'Tyrone "T-Bone" Jackson', 'Antoine Dubois', 'Luca Moretti', 'Ivan Dragovich',
    'Carlos "Scarface" Rodriguez', 'Yuri Morozov', 'Malik "Kingpin" Johnson', 'Jean-Pierre Laurent', 'Giuseppe Ricci',
    'Maxim Sokolov', 'Fernando "El Jefe" Garcia', 'Dmitri Orlov', 'Jamal "Shadow" Williams', 'Pierre Beaumont',
    'Enzo Ferrari', 'Aleksandr Volkov', 'Ricardo "Rico" Sanchez', 'Nikolai Ivanov', 'Darius "Ice" Coleman',
    'François Moreau', 'Salvatore Benedetto', 'Andrei Kuznetsov', 'Marcus "Reaper" Davis', 'Luis "Loco" Hernandez',
    'Viktor "Viper" Kozlov', 'Jamal "Bullet" Brown', 'Antonio "The Don" Russo', 'Sergei "Steel" Volkov',
    'Carlos "Muerte" Lopez', 'Dimitri "Dagger" Sokolov', 'Rashid "Shark" Hassan', 'Chen "Cobra" Wong',
    'Pablo "Patron" Rivera', 'Boris "Blade" Petrov', 'Andre "Ace" Martin', 'Marco "Mafia" Silva',
    'Yuri "Yeti" Morozov', 'Hassan "Havoc" Khan', 'Diego "Death" Ramirez', 'Viktor "Venom" Dragov',
    'Alejandro "Axe" Morales', 'Kenji "Katana" Sato',

];

const MISSION_TEMPLATES = [
    // Easy Missions (1-10)
    { title: 'Street Race', desc: 'Win an illegal street race through Downtown. High speed, high stakes.', difficulty: 'easy', requirements: { gangPower: 100 }, duration: 30, rewards: { money: 2000, respect: 50, weapons: 10 } },
    { title: 'Arms Deal', desc: 'Complete a major weapons transaction with an underground dealer.', difficulty: 'easy', requirements: { gangPower: 150 }, duration: 45, rewards: { money: 3000, weapons: 40 } },
    { title: 'Cargo Theft', desc: 'Steal a high-value cargo shipment from the docks.', difficulty: 'easy', requirements: { gangPower: 120 }, duration: 40, rewards: { money: 2500, weapons: 30 } },
    { title: 'Car Boost', desc: 'Steal luxury vehicles from the rich district.', difficulty: 'easy', requirements: { gangPower: 80 }, duration: 25, rewards: { money: 1800, respect: 40, weapons: 8 } },
    { title: 'Protection Racket', desc: 'Collect protection money from local businesses.', difficulty: 'easy', requirements: { gangPower: 90 }, duration: 35, rewards: { money: 2200, respect: 55, weapons: 12 } },
    { title: 'Drug Pickup', desc: 'Pick up a small drug package from the supplier.', difficulty: 'easy', requirements: { gangPower: 110 }, duration: 30, rewards: { money: 1900, influence: 30, weapons: 15 } },
    { title: 'Street Fight', desc: 'Settle a dispute with fists in a back alley.', difficulty: 'easy', requirements: { gangPower: 100 }, duration: 20, rewards: { money: 1500, respect: 60, weapons: 5 } },
    { title: 'Warehouse Raid', desc: 'Raid an abandoned warehouse for supplies.', difficulty: 'easy', requirements: { gangPower: 130 }, duration: 40, rewards: { money: 2400, weapons: 35 } },
    { title: 'Graffiti Tag', desc: 'Tag rival gang territory to send a message.', difficulty: 'easy', requirements: { gangPower: 70 }, duration: 15, rewards: { money: 1200, respect: 70, weapons: 3 } },
    { title: 'Lookout Duty', desc: 'Keep watch during another crew\'s operation.', difficulty: 'easy', requirements: { gangPower: 60 }, duration: 50, rewards: { money: 1600, influence: 40, weapons: 10 } },
    
    // Medium Missions (11-20)
    { title: 'Territory Grab', desc: 'Take over a rival gang\'s territory. Show them who runs these streets.', difficulty: 'medium', requirements: { gangPower: 300, weapons: 10 }, duration: 60, rewards: { money: 5000, respect: 150, influence: 50, weapons: 25 } },
    { title: 'Drug Shipment', desc: 'Secure and deliver a major drug shipment across the city.', difficulty: 'medium', requirements: { gangPower: 250 }, duration: 90, rewards: { money: 8000, influence: 100, weapons: 30 } },
    { title: 'Underground Fight', desc: 'Win an underground fighting tournament. Brutal, no rules.', difficulty: 'medium', requirements: { gangPower: 200 }, duration: 60, rewards: { money: 4500, respect: 120, weapons: 20 } },
    { title: 'Nightclub Takeover', desc: 'Take control of the hottest nightclub in the city.', difficulty: 'medium', requirements: { gangPower: 350, influence: 150 }, duration: 75, rewards: { money: 7000, respect: 180, influence: 80, weapons: 35 } },
    { title: 'Armored Truck Heist', desc: 'Rob an armored truck carrying cash.', difficulty: 'medium', requirements: { gangPower: 280, weapons: 20 }, duration: 70, rewards: { money: 9500, weapons: 45 } },
    { title: 'Casino Robbery', desc: 'Hit the casino vault during peak hours.', difficulty: 'medium', requirements: { gangPower: 320, influence: 100 }, duration: 85, rewards: { money: 11000, respect: 200, weapons: 40 } },
    { title: 'Rival Boss Hit', desc: 'Eliminate a rival gang\'s lieutenant.', difficulty: 'medium', requirements: { gangPower: 290, weapons: 25 }, duration: 65, rewards: { money: 6500, respect: 170, influence: 90, weapons: 30 } },
    { title: 'Port Smuggling', desc: 'Smuggle contraband through the port.', difficulty: 'medium', requirements: { gangPower: 260 }, duration: 80, rewards: { money: 7500, influence: 120, weapons: 50 } },
    { title: 'Gang Summit', desc: 'Negotiate with other gangs at a secret meeting.', difficulty: 'medium', requirements: { gangPower: 240, influence: 80 }, duration: 55, rewards: { money: 5500, respect: 140, influence: 100 } },
    { title: 'Street Takeover', desc: 'Shut down a major street and claim it as yours.', difficulty: 'medium', requirements: { gangPower: 310, weapons: 15 }, duration: 75, rewards: { money: 8500, respect: 190, weapons: 35 } },
    
    // Hard Missions (21-30)
    { title: 'Bank Heist', desc: 'Rob the Pacific Standard Bank. Plan carefully, execute perfectly.', difficulty: 'hard', requirements: { gangPower: 500, influence: 200 }, duration: 120, rewards: { money: 15000, respect: 300, prestige: 1, weapons: 50 } },
    { title: 'Assassination Contract', desc: 'Eliminate a high-value target. Clean, professional, no witnesses.', difficulty: 'hard', requirements: { gangPower: 450, weapons: 50 }, duration: 120, rewards: { money: 12000, respect: 250, prestige: 1, weapons: 75 } },
    { title: 'Turf War', desc: 'Defend your territory from a massive rival gang attack.', difficulty: 'hard', requirements: { gangPower: 600, weapons: 75 }, duration: 180, rewards: { money: 20000, respect: 500, influence: 200, prestige: 2, weapons: 100 } },
    { title: 'Federal Reserve Job', desc: 'The big one. Hit the Federal Reserve.', difficulty: 'hard', requirements: { gangPower: 700, weapons: 100, influence: 300 }, duration: 200, rewards: { money: 35000, respect: 600, prestige: 3, weapons: 150 } },
    { title: 'Cartel Deal', desc: 'Negotiate a massive deal with the Mexican Cartel.', difficulty: 'hard', requirements: { gangPower: 550, influence: 250 }, duration: 150, rewards: { money: 18000, influence: 250, prestige: 2, weapons: 120 } },
    { title: 'Mayor Blackmail', desc: 'Obtain compromising material on the mayor.', difficulty: 'hard', requirements: { gangPower: 480, weapons: 60 }, duration: 135, rewards: { money: 14000, influence: 300, prestige: 1, weapons: 80 } },
    { title: 'Prison Break', desc: 'Break your top enforcer out of maximum security.', difficulty: 'hard', requirements: { gangPower: 650, weapons: 90 }, duration: 170, rewards: { money: 22000, respect: 550, prestige: 2, weapons: 110 } },
    { title: 'District Lockdown', desc: 'Take control of an entire city district.', difficulty: 'hard', requirements: { gangPower: 750, weapons: 120, influence: 350 }, duration: 220, rewards: { money: 40000, respect: 700, influence: 400, prestige: 4, weapons: 180 } },
    { title: 'Rival Empire Fall', desc: 'Completely destroy a rival gang\'s operations.', difficulty: 'hard', requirements: { gangPower: 800, weapons: 150 }, duration: 240, rewards: { money: 50000, respect: 800, influence: 500, prestige: 5, weapons: 200 } },
    { title: 'The Big Score', desc: 'The ultimate heist. Rob the Diamond Exchange.', difficulty: 'hard', requirements: { gangPower: 900, weapons: 200, influence: 400 }, duration: 300, rewards: { money: 75000, respect: 1000, influence: 600, prestige: 10, weapons: 300 } }
];

const ACHIEVEMENTS = [
    // Recruitment (1-8)
    { id: 'first_recruit', name: 'First Blood', desc: 'Recruit your first crew member', icon: '👤', requirement: { type: 'recruits', value: 1 }, reward: { money: 500 } },
    { id: 'gang_of_five', name: 'Gang of Five', desc: 'Recruit 5 crew members', icon: '👥', requirement: { type: 'recruits', value: 5 }, reward: { money: 2000, respect: 100 } },
    { id: 'small_army', name: 'Small Army', desc: 'Recruit 10 crew members', icon: '⚔️', requirement: { type: 'recruits', value: 10 }, reward: { money: 5000, respect: 200 } },
    { id: 'recruitment_drive', name: 'Recruitment Drive', desc: 'Recruit 25 crew members', icon: '📢', requirement: { type: 'recruits', value: 25 }, reward: { money: 10000, prestige: 1 } },
    { id: 'mass_recruitment', name: 'Mass Recruitment', desc: 'Recruit 50 crew members', icon: '🎖️', requirement: { type: 'recruits', value: 50 }, reward: { money: 25000, prestige: 2 } },
    { id: 'hiring_spree', name: 'Hiring Spree', desc: 'Recruit 100 crew members', icon: '🏆', requirement: { type: 'recruits', value: 100 }, reward: { money: 50000, prestige: 5 } },
    { id: 'recruitment_master', name: 'Recruitment Master', desc: 'Recruit 250 crew members', icon: '👑', requirement: { type: 'recruits', value: 250 }, reward: { money: 100000, prestige: 10 } },
    { id: 'legendary_recruiter', name: 'Legendary Recruiter', desc: 'Recruit 500 crew members', icon: '🌟', requirement: { type: 'recruits', value: 500 }, reward: { money: 250000, prestige: 20 } },
    
    // Collection (9-14)
    { id: 'collector_start', name: 'Collector', desc: 'Collect 10 unique characters', icon: '📚', requirement: { type: 'collection', value: 10 }, reward: { money: 3000 } },
    { id: 'halfway_there', name: 'Halfway There', desc: 'Collect 26 unique characters', icon: '📖', requirement: { type: 'collection', value: 26 }, reward: { money: 15000, prestige: 2 } },
    { id: 'almost_complete', name: 'Almost Complete', desc: 'Collect 45 unique characters', icon: '📕', requirement: { type: 'collection', value: 45 }, reward: { money: 30000, prestige: 3 } },
    { id: 'full_crew', name: 'Full Crew', desc: 'Collect all 52 characters', icon: '🎖️', requirement: { type: 'collection', value: 52 }, reward: { money: 50000, prestige: 5 } },
    { id: 'legendary_pull', name: 'Lucky Draw', desc: 'Recruit a Legendary character', icon: '🌟', requirement: { type: 'legendary', value: 1 }, reward: { money: 5000 } },
    { id: 'legendary_collector', name: 'Legendary Collector', desc: 'Collect 3 Legendary characters', icon: '💫', requirement: { type: 'legendary', value: 3 }, reward: { money: 20000, prestige: 3 } },
    
    // Missions (15-24)
    { id: 'first_mission', name: 'Mission Starter', desc: 'Complete your first mission', icon: '🎯', requirement: { type: 'missions', value: 1 }, reward: { weapons: 10 } },
    { id: 'mission_runner', name: 'Mission Runner', desc: 'Complete 5 missions', icon: '🏃', requirement: { type: 'missions', value: 5 }, reward: { money: 5000, weapons: 25 } },
    { id: 'mission_veteran', name: 'Mission Veteran', desc: 'Complete 10 missions', icon: '⭐', requirement: { type: 'missions', value: 10 }, reward: { money: 10000, prestige: 1 } },
    { id: 'mission_expert', name: 'Mission Expert', desc: 'Complete 25 missions', icon: '💪', requirement: { type: 'missions', value: 25 }, reward: { money: 25000, prestige: 2, weapons: 50 } },
    { id: 'mission_master', name: 'Mission Master', desc: 'Complete 50 missions', icon: '🎖️', requirement: { type: 'missions', value: 50 }, reward: { money: 50000, prestige: 5, weapons: 100 } },
    { id: 'mission_legend', name: 'Mission Legend', desc: 'Complete 100 missions', icon: '👑', requirement: { type: 'missions', value: 100 }, reward: { money: 100000, prestige: 10, weapons: 200 } },
    { id: 'mission_god', name: 'Mission God', desc: 'Complete 250 missions', icon: '⚡', requirement: { type: 'missions', value: 250 }, reward: { money: 250000, prestige: 20, weapons: 500 } },
    { id: 'mission_immortal', name: 'Mission Immortal', desc: 'Complete 500 missions', icon: '🌟', requirement: { type: 'missions', value: 500 }, reward: { money: 500000, prestige: 50, weapons: 1000 } },
    { id: 'easy_rider', name: 'Easy Rider', desc: 'Complete 10 easy missions', icon: '🚗', requirement: { type: 'easy_missions', value: 10 }, reward: { money: 5000 } },
    { id: 'hard_worker', name: 'Hard Worker', desc: 'Complete 5 hard missions', icon: '💎', requirement: { type: 'hard_missions', value: 5 }, reward: { money: 15000, prestige: 2 } },
    
    // Money (25-30)
    { id: 'first_grand', name: 'First Grand', desc: 'Accumulate $1,000', icon: '💵', requirement: { type: 'money', value: 1000 }, reward: { respect: 50 } },
    { id: 'ten_grand', name: 'Ten Grand', desc: 'Accumulate $10,000', icon: '💰', requirement: { type: 'money', value: 10000 }, reward: { respect: 100 } },
    { id: 'money_maker', name: 'Money Maker', desc: 'Accumulate $100,000', icon: '💸', requirement: { type: 'money', value: 100000 }, reward: { prestige: 2 } },
    { id: 'millionaire', name: 'Millionaire', desc: 'Accumulate $1,000,000', icon: '💎', requirement: { type: 'money', value: 1000000 }, reward: { prestige: 10 } },
    { id: 'multi_millionaire', name: 'Multi-Millionaire', desc: 'Accumulate $5,000,000', icon: '👑', requirement: { type: 'money', value: 5000000 }, reward: { prestige: 25 } },
    { id: 'tycoon', name: 'Tycoon', desc: 'Accumulate $10,000,000', icon: '🌟', requirement: { type: 'money', value: 10000000 }, reward: { prestige: 50 } },
    
    // Respect (31-35)
    { id: 'getting_respect', name: 'Getting Respect', desc: 'Gain 100 Respect', icon: '👊', requirement: { type: 'respect', value: 100 }, reward: { influence: 50 } },
    { id: 'respected', name: 'Respected', desc: 'Gain 1,000 Respect', icon: '💎', requirement: { type: 'respect', value: 1000 }, reward: { influence: 500 } },
    { id: 'highly_respected', name: 'Highly Respected', desc: 'Gain 10,000 Respect', icon: '⭐', requirement: { type: 'respect', value: 10000 }, reward: { influence: 2000, prestige: 2 } },
    { id: 'legendary_respect', name: 'Legendary Respect', desc: 'Gain 100,000 Respect', icon: '👑', requirement: { type: 'respect', value: 100000 }, reward: { influence: 10000, prestige: 10 } },
    { id: 'respect_god', name: 'Respect God', desc: 'Gain 1,000,000 Respect', icon: '🌟', requirement: { type: 'respect', value: 1000000 }, reward: { prestige: 50 } },
    
    // Territory (36-38)
    { id: 'territory_upgrade', name: 'Territory Upgrade', desc: 'Upgrade territory to level 2', icon: '🏠', requirement: { type: 'territory', value: 2 }, reward: { money: 5000, prestige: 1 } },
    { id: 'empire_builder', name: 'Empire Builder', desc: 'Upgrade territory to max level', icon: '🏢', requirement: { type: 'territory', value: 3 }, reward: { money: 20000, prestige: 3 } },
    { id: 'empire_master', name: 'Empire Master', desc: 'Max territory with 100k+ income', icon: '🏰', requirement: { type: 'empire_income', value: 100000 }, reward: { prestige: 10 } },
    
    // Weapons (39-43)
    { id: 'armed', name: 'Armed', desc: 'Accumulate 100 weapons', icon: '🔫', requirement: { type: 'weapons', value: 100 }, reward: { money: 2000 } },
    { id: 'arsenal', name: 'Armed & Dangerous', desc: 'Accumulate 500 weapons', icon: '💣', requirement: { type: 'weapons', value: 500 }, reward: { prestige: 1 } },
    { id: 'weapons_dealer', name: 'Weapons Dealer', desc: 'Accumulate 1,000 weapons', icon: '⚔️', requirement: { type: 'weapons', value: 1000 }, reward: { prestige: 2 } },
    { id: 'armory', name: 'Walking Armory', desc: 'Accumulate 5,000 weapons', icon: '🎖️', requirement: { type: 'weapons', value: 5000 }, reward: { prestige: 5 } },
    { id: 'weapons_god', name: 'Weapons God', desc: 'Accumulate 10,000 weapons', icon: '💥', requirement: { type: 'weapons', value: 10000 }, reward: { prestige: 10 } },
    
    // Prestige (44-47)
    { id: 'prestige_start', name: 'Prestigious', desc: 'Gain 5 Prestige', icon: '⭐', requirement: { type: 'prestige', value: 5 }, reward: { money: 10000 } },
    { id: 'prestige_elite', name: 'Elite Status', desc: 'Gain 25 Prestige', icon: '💎', requirement: { type: 'prestige', value: 25 }, reward: { money: 50000 } },
    { id: 'prestige_legend', name: 'Legendary Status', desc: 'Gain 100 Prestige', icon: '👑', requirement: { type: 'prestige', value: 100 }, reward: { money: 250000 } },
    { id: 'prestige_god', name: 'God Status', desc: 'Gain 500 Prestige', icon: '🌟', requirement: { type: 'prestige', value: 500 }, reward: { money: 1000000 } },
    
    // Special (48-50)
    { id: 'speed_runner', name: 'Speed Runner', desc: 'Complete a mission in under 20 seconds', icon: '⚡', requirement: { type: 'speed_mission', value: 1 }, reward: { money: 10000, prestige: 2 } },
    { id: 'perfect_crew', name: 'Perfect Crew', desc: 'Fill all 7 positions with Epic or Legendary characters', icon: '💫', requirement: { type: 'perfect_crew', value: 1 }, reward: { money: 50000, prestige: 10 } },
    { id: 'ultimate_empire', name: 'Ultimate Empire', desc: 'Reach 1M money, 100k respect, 10k weapons, 100 prestige', icon: '🏆', requirement: { type: 'ultimate', value: 1 }, reward: { prestige: 100 } }
];

let ALL_CHARACTERS = [];
let TOTAL_CHARACTERS = 88;

// ===== ENEMY GANGS =====
const ENEMY_GANG_TEMPLATES = [
    // Easy Tier
    { name: 'Street Punks', minPower: 150, maxPower: 300, tier: 'easy', rewards: { money: 1000, weapons: 20, respect: 50 } },
    { name: 'East Side Crew', minPower: 200, maxPower: 400, tier: 'easy', rewards: { money: 1500, weapons: 25, respect: 75 } },
    { name: 'Downtown Hustlers', minPower: 250, maxPower: 450, tier: 'easy', rewards: { money: 2000, weapons: 30, respect: 100 } },
    { name: 'Alley Runners', minPower: 180, maxPower: 320, tier: 'easy', rewards: { money: 1200, weapons: 22, respect: 60 } },
    { name: 'Neon Taggers', minPower: 220, maxPower: 380, tier: 'easy', rewards: { money: 1600, weapons: 28, respect: 80 } },
    { name: 'Backstreet Dealers', minPower: 260, maxPower: 420, tier: 'easy', rewards: { money: 2100, weapons: 32, respect: 110 } },

    // Medium Tier
    { name: 'Westside Mafia', minPower: 400, maxPower: 700, tier: 'medium', rewards: { money: 4000, weapons: 50, respect: 150, influence: 50 } },
    { name: 'North District Lords', minPower: 500, maxPower: 900, tier: 'medium', rewards: { money: 6000, weapons: 75, respect: 200, influence: 100 } },
    { name: 'South Side Killers', minPower: 700, maxPower: 1100, tier: 'medium', rewards: { money: 8000, weapons: 100, respect: 250, influence: 150, prestige: 1 } },
    { name: 'Iron Alley Crew', minPower: 550, maxPower: 850, tier: 'medium', rewards: { money: 5500, weapons: 70, respect: 190, influence: 90 } },
    { name: 'Crimson Vultures', minPower: 650, maxPower: 1000, tier: 'medium', rewards: { money: 7500, weapons: 95, respect: 240, influence: 130 } },
    { name: 'Black Market Union', minPower: 800, maxPower: 1200, tier: 'medium', rewards: { money: 9000, weapons: 120, respect: 280, influence: 180, prestige: 1 } },

    // Hard Tier
    { name: 'The Syndicate', minPower: 1000, maxPower: 1500, tier: 'hard', rewards: { money: 12000, weapons: 150, respect: 400, influence: 200, prestige: 2 } },
    { name: 'The Brotherhood', minPower: 1200, maxPower: 1800, tier: 'hard', rewards: { money: 15000, weapons: 200, respect: 500, influence: 300, prestige: 3 } },
    { name: 'Obsidian Circle', minPower: 1400, maxPower: 2000, tier: 'hard', rewards: { money: 18000, weapons: 240, respect: 550, influence: 350, prestige: 3 } },
    { name: 'Phantom Collective', minPower: 1600, maxPower: 2200, tier: 'hard', rewards: { money: 22000, weapons: 280, respect: 650, influence: 420, prestige: 4 } },

    // Boss Tier
    { name: 'The Cartel', minPower: 1800, maxPower: 2500, tier: 'boss', rewards: { money: 25000, weapons: 300, respect: 800, influence: 500, prestige: 5 } },
    { name: 'The Organization', minPower: 2500, maxPower: 3500, tier: 'boss', rewards: { money: 40000, weapons: 500, respect: 1200, influence: 800, prestige: 10 } },
    { name: 'Golden Serpents', minPower: 2800, maxPower: 3800, tier: 'boss', rewards: { money: 50000, weapons: 650, respect: 1400, influence: 900, prestige: 12 } },
    { name: 'Shadow Consortium', minPower: 3200, maxPower: 4500, tier: 'boss', rewards: { money: 65000, weapons: 800, respect: 1800, influence: 1200, prestige: 15 } },

    // Ultra / Endgame Tier (NEU)
    { name: 'The Dominion', minPower: 4500, maxPower: 6000, tier: 'endgame', rewards: { money: 100000, weapons: 1200, respect: 2500, influence: 1800, prestige: 25 } },
    { name: 'Eclipse Syndicate', minPower: 6000, maxPower: 8000, tier: 'endgame', rewards: { money: 150000, weapons: 1600, respect: 3200, influence: 2500, prestige: 40 } }
];

// ===== CHARACTER INITIALIZATION =====
function initializeCharacters() {
    const seed = 12345;
    let rng = seed;
    
    function seededRandom() {
        rng = (rng * 9301 + 49297) % 233280;
        return rng / 233280;
    }
    
    loadCharactersFromFolder().then(loadedChars => {
        if (loadedChars.length > 0) {
            ALL_CHARACTERS = loadedChars;
            TOTAL_CHARACTERS = ALL_CHARACTERS.length;
            console.log(`✅ Loaded ${TOTAL_CHARACTERS} characters from /characters/`);
        } else {
            console.log('📁 Generating default characters...');
            ALL_CHARACTERS = DEFAULT_CHARACTER_NAMES.map((name, index) => {
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
                    image: '',
                    emoji: emoji,
                    strength: Math.floor(baseStats.strength * rarity.statMultiplier),
                    intelligence: Math.floor(baseStats.intelligence * rarity.statMultiplier),
                    agility: Math.floor(baseStats.agility * rarity.statMultiplier),
                    leadership: Math.floor(baseStats.leadership * rarity.statMultiplier)
                };
            });
        }
        
        continueGameInit();
    });
}

async function loadCharactersFromFolder() {
    const characters = [];
    try {
        for (let i = 0; i < 100; i++) {
            try {
                const response = await fetch(`characters/character_${i}.json`);
                if (response.ok) {
                    const char = await response.json();
                    if (!char.emoji) {
                        const emojis = ['👤', '🎭', '💀', '👁️', '🔪', '🎯', '⚡', '💣', '🔫', '🎲'];
                        char.emoji = emojis[i % emojis.length];
                    }
                    characters.push(char);
                } else {
                    break;
                }
            } catch (e) {
                break;
            }
        }
    } catch (error) {
        console.log('No /characters/ folder found');
    }
    return characters;
}

// ===== CORE GAME LOGIC =====
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

function calculateCombatStrength() {
    const gangPower = calculateGangPower();
    const weaponBonus = gameState.weapons * 2;
    return gangPower + weaponBonus;
}

function calculateIncome() {
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
    
    if (gameState.assignedPositions.boss !== undefined) {
        income *= 1.75;
    }
    
    const baseMult = 1 + (gameState.baseLevel - 1) * 0.6;
    income *= baseMult;
    respectIncome *= baseMult;
    influenceIncome *= baseMult;
    
    return { income, respectIncome, influenceIncome };
}

function recruitCharacter() {
    if (gameState.money < gameState.recruitCost) {
        notify('Not enough cash!', 'error');
        return;
    }
    
    const newChar = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
    
    gameState.money -= gameState.recruitCost;
    gameState.recruitCost = Math.floor(gameState.recruitCost * 1.8);
    gameState.totalRecruits++;
    
    if (!gameState.characterInventory[newChar.id]) {
        gameState.characterInventory[newChar.id] = 0;
    }
    gameState.characterInventory[newChar.id]++;
    
    notify(`${newChar.name} (${newChar.rarity}) recruited!`);
    
    // Update UI will be called by game-ui.js
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
    
    // Show character detail will be called by game-ui.js
    if (typeof showCharacterDetail === 'function') {
        showCharacterDetail(newChar);
    }
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
    
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
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
    
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
}

function assignPosition(posId, charId) {
    if (gameState.characterInventory[charId]) {
        gameState.characterInventory[charId]--;
        if (gameState.characterInventory[charId] === 0) {
            delete gameState.characterInventory[charId];
        }
    }
    
    const oldCharId = gameState.assignedPositions[posId];
    if (oldCharId !== undefined) {
        if (!gameState.characterInventory[oldCharId]) {
            gameState.characterInventory[oldCharId] = 0;
        }
        gameState.characterInventory[oldCharId]++;
    }
    
    gameState.assignedPositions[posId] = charId;
    
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
    
    if (typeof closeModal === 'function') {
        closeModal();
    }
    
    notify('Character assigned!');
}

function unassignPosition(posId) {
    const charId = gameState.assignedPositions[posId];
    if (charId === undefined) return;
    
    if (!gameState.characterInventory[charId]) {
        gameState.characterInventory[charId] = 0;
    }
    gameState.characterInventory[charId]++;
    
    delete gameState.assignedPositions[posId];
    
    if (typeof updateAllUI === 'function') {
        updateAllUI();
    }
    
    notify('Character unassigned!');
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

console.log('✅ game-core.js loaded!');