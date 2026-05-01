# STREET EMPIRE - Gang Wars Game

## 🎮 SPIELSYSTEM ERKLÄRT

### 📊 RESSOURCEN & IHRE BEDEUTUNG

#### 💰 **MONEY (Cash)**
- **Funktion**: Haupt-Währung für Rekrutierung & Upgrades
- **Generierung**: Automatisches Einkommen durch zugewiesene Crew-Member
- **Verwendung**:
  - Charaktere rekrutieren (Startkosten: $500, steigt um 80% pro Rekrut)
  - Territory upgraden (Level 1→2: $5,000 / Level 2→3: $20,000)
  - Wird durch Missionen verdient

#### 💎 **RESPECT**
- **Funktion**: Schaltet spezielle Features & Boni frei
- **Generierung**: 
  - Driver Position: +40/sec
  - Scout Position: +30/sec
  - Missionen & Gang Wars
- **Verwendung**:
  - Requirement für schwierige Missionen
  - Prestige-Bonus ab 1,000 Respect

#### ⚡ **INFLUENCE**
- **Funktion**: Benötigt für fortgeschrittene Missionen & Features
- **Generierung**:
  - Hacker Position: +50/sec
  - Missionen
- **Verwendung**:
  - Requirement für Hard-Missionen (z.B. Bank Heist: 200 Influence)
  - Unlock für Elite-Content

#### 🔫 **WEAPONS**
- **Funktion**: ERHÖHT COMBAT-STÄRKE IM PVE!
- **Generierung**:
  - Missionen (z.B. Arms Deal: +25 Weapons)
  - Gang Wars (Siegesbeute)
- **Verwendung**:
  - **Combat Power = Gang Power + (Weapons × 2)**
  - Beispiel: 500 Gang Power + 100 Weapons = 700 Combat Power
  - **KRITISCH FÜR GANG WARS!**

#### ⭐ **PRESTIGE**
- **Funktion**: Elite-Status & permanente Boni
- **Generierung**:
  - Schwere Missionen (Bank Heist: +1, Turf War: +2)
  - Achievements
  - Gang Wars gegen starke Gegner
- **Bonuses**:
  - **Prestige 1**: +5% Gesamt-Einkommen
  - **Prestige 3**: +10% Combat Power
  - **Prestige 5**: Unlock Elite Missions
  - **Prestige 10**: +25% auf ALLE Einkommen
  - **Prestige 20**: Unlock Legendary Recruitment Boost

---

### 👥 CHARACTER STATS ERKLÄRT

Jeder Charakter hat 4 Stats:

#### 💪 **STRENGTH (Stärke)**
- **Verwendung**:
  - Enforcer Position (bevorzugt)
  - **PvE Combat Damage** (Jeder Punkt = +1 Combat Power)
  - Boss Fights & Turf Wars

#### 🧠 **INTELLIGENCE (Intelligenz)**
- **Verwendung**:
  - Dealer & Hacker Position (bevorzugt)
  - **Mission Success Rate** (höher = bessere Belohnungen möglich)
  - Strategische Missions

#### ⚡ **AGILITY (Beweglichkeit)**
- **Verwendung**:
  - Driver & Scout Position (bevorzugt)
  - **Escape Chance** bei verlorenen Gang Wars
  - Speed Missions

#### 👑 **LEADERSHIP (Führung)**
- **Verwendung**:
  - **BOSS POSITION** (bevorzugt, gibt +75% Total Income!)
  - Lieutenant Position
  - **Team Synergy Bonus** in PvE

---

### 🎯 GANG POSITIONS SYSTEM

#### 7 Positionen verfügbar:

1. **👑 BOSS**
   - Bonus: +75% Total Income Multiplier
   - Best Stat: Leadership
   - **WICHTIGSTE POSITION!**

2. **🎖️ LIEUTENANT**
   - Income: $150/sec
   - Best Stat: Leadership

3. **💪 ENFORCER**
   - Income: $120/sec
   - Best Stat: Strength
   - **Combat-fokussiert**

4. **💊 DEALER**
   - Income: $100/sec
   - Best Stat: Intelligence

5. **💻 HACKER**
   - Bonus: +50 Influence/sec
   - Best Stat: Intelligence

6. **🚗 DRIVER**
   - Bonus: +40 Respect/sec
   - Best Stat: Agility

7. **🔭 SCOUT**
   - Bonus: +30 Respect/sec
   - Best Stat: Agility

**STRATEGIE-TIPP**: 
- Boss sollte IMMER dein bester Leadership-Charakter sein!
- Enforcer mit hohem Strength = bessere Combat Power
- Balance zwischen Income (Money) und Resources (Respect/Influence)

---

### ⚔️ GANG WARS (PvE SYSTEM)

#### Wie es funktioniert:

1. **Deine Combat Power berechnen**:
   ```
   Combat Power = Σ(Assigned Character Stats) + (Weapons × 2) + Prestige Boni
   ```

2. **Gegner-Gangs**:
   - **Easy** (Combat Power: 200-400): +$1,000, +20 Weapons
   - **Medium** (Combat Power: 500-800): +$3,000, +50 Weapons, +1 Prestige
   - **Hard** (Combat Power: 900-1,500): +$7,000, +100 Weapons, +2 Prestige
   - **Boss** (Combat Power: 2,000+): +$15,000, +200 Weapons, +5 Prestige

3. **Battle-Mechanik**:
   - Turn-based Simulation
   - Strength = Damage
   - Weapons = Bonus Damage
   - Leadership = Team Coordination Bonus
   - Agility = Dodge Chance

4. **Rewards bei Sieg**:
   - Money (steigt mit Schwierigkeit)
   - Weapons (Equipment-Beute)
   - Prestige (bei härteren Gegnern)
   - XP für Level-Up

5. **Bei Niederlage**:
   - Verliere 10% deiner Weapons
   - Kein Money-Verlust
   - Win/Loss wird getrackt

---

### 🎯 MISSIONS SYSTEM

#### Freischaltung:
- **Missions werden JEDE SEKUNDE überprüft**
- Sobald Requirements erfüllt → Status ändert sich zu "Available"
- Buttons werden automatisch aktiviert

#### Mission-Typen & Requirements:

**EASY Missions** (30-45 Sekunden):
- Street Race: Gang Power 100+
- Cargo Theft: Gang Power 120+
- Arms Deal: Gang Power 150+

**MEDIUM Missions** (60-90 Sekunden):
- Territory Grab: Gang Power 300+, Weapons 10+
- Drug Shipment: Gang Power 250+
- Underground Fight: Gang Power 200+
- Nightclub Takeover: Gang Power 350+, Influence 150+

**HARD Missions** (120-180 Sekunden):
- Bank Heist: Gang Power 500+, Influence 200+
- Assassination: Gang Power 450+, Weapons 50+
- Turf War: Gang Power 600+, Weapons 75+

#### Rewards:
- Money (skaliert mit Schwierigkeit)
- Weapons (bei Combat-Missions)
- Respect & Influence
- **Prestige** (nur Hard Missions)

---

### 🏢 TERRITORY SYSTEM

#### Level 1 (Start):
- Max Crew: 7 Positionen
- Income Bonus: +0%
- Cost: Free

#### Level 2 ($5,000):
- Max Crew: bleibt 7
- Income Bonus: +60%
- Unlock: Medium Missions
- Visuell: Größeres Gebäude

#### Level 3 ($20,000):
- Max Crew: bleibt 7
- Income Bonus: +120%
- Unlock: Hard Missions
- Visuell: Großes Komplex

**WICHTIG**: Territory-Bonus multipliziert ALLES (Money, Respect, Influence Income)!

---

### 🎴 COLLECTION SYSTEM

- **52 Charaktere total** (dynamisch aus `/characters/` Ordner geladen)
- **5 Seltenheiten**:
  - Common (50%): Stats ×1.0, Recycle: $50
  - Uncommon (30%): Stats ×1.4, Recycle: $150
  - Rare (15%): Stats ×1.9, Recycle: $400
  - Epic (4%): Stats ×2.5, Recycle: $1,000
  - Legendary (1%): Stats ×3.5, Recycle: $3,000

- **Completion Bonuses**:
  - 25% gesammelt: +10% Recruit Discount
  - 50% gesammelt: +1 Prestige
  - 75% gesammelt: +20% Combat Power
  - 100% gesammelt: +5 Prestige, Unlock Secret Boss

---

### 🏆 ACHIEVEMENTS SYSTEM

**10 Achievements mit Rewards**:

1. First Blood (1 Recruit): +$500
2. Gang of Five (5 Recruits): +$2,000, +100 Respect
3. Full Crew (52 Collected): +$50,000, +5 Prestige
4. Mission Starter (1 Mission): +10 Weapons
5. Mission Veteran (10 Missions): +$10,000, +1 Prestige
6. Money Maker ($100,000): +2 Prestige
7. Respected (1,000 Respect): +500 Influence
8. Lucky Draw (1 Legendary): +$5,000
9. Empire Builder (Max Territory): +$20,000, +3 Prestige
10. Armed & Dangerous (500 Weapons): +1 Prestige

---

### 📁 DYNAMISCHES CHARACTER-SYSTEM

#### Character-Ordner Struktur:
```
/characters/
  ├── character_0.json
  ├── character_1.json
  ├── ...
  └── character_51.json
```

#### JSON-Format:
```json
{
  "id": 0,
  "name": "Marcus 'Ghost'",
  "rarity": "legendary",
  "image": "marcus_ghost.png",
  "strength": 95,
  "intelligence": 88,
  "agility": 92,
  "leadership": 98
}
```

#### Fallback:
- Falls kein `/characters/` Ordner: Nutzt default 52 generierte Charaktere
- Falls einzelne Characters fehlen: Generiert diese automatisch
- Bilder können fehlen (zeigt dann Emoji-Fallback)

---

### 🖼️ BILDER-SYSTEM

#### Ressourcen-Icons:
Lege folgende PNGs in `/images/`:
- `money.png` ✅ (bereits vorhanden)
- `respect.png` (z.B. goldene Krone oder Stern)
- `influence.png` (z.B. Netzwerk oder Megafon)
- `weapons.png` (z.B. gekreuzte Waffen)
- `prestige.png` (z.B. Diamant oder Trophäe)

#### Character-Bilder:
- Werden aus JSON geladen (`image` field)
- Liegen in `/characters/images/`
- Fallback: Emoji wenn Bild fehlt

---

### 🎮 OPTIMALE SPIEL-STRATEGIE

#### Early Game (Level 1-5):
1. Rekrutiere 7 Charaktere für alle Positionen
2. Boss = bester Leadership
3. Fokus auf Easy Missions für schnelles Money
4. Territory auf Level 2 upgraden sobald möglich

#### Mid Game (Level 5-15):
1. Sammle Weapons durch Missionen
2. Starte Gang Wars (Easy Gegner)
3. Upgrade Territory auf Level 3
4. Sammle 10+ verschiedene Charaktere

#### Late Game (Level 15+):
1. Optimize Crew (beste Stats für jede Position)
2. Hard Missions & Hard Gang Wars
3. Sammle Prestige für Boni
4. Komplette Collection (52/52)

---

### 💾 SAVE-SYSTEM

- **Auto-Save**: Alle 5 Sekunden
- **LocalStorage**: Persistent im Browser
- **Gespeichert**:
  - Alle Ressourcen
  - Character Inventory
  - Assigned Positions
  - Mission Progress
  - Achievements
  - Territory Level
  - Win/Loss Stats

---

## 🚀 INSTALLATION

1. Alle 3 Dateien in einen Ordner:
   - `index.html`
   - `styles.css`
   - `game.js`

2. Erstelle Unterordner:
   - `/images/` → money.png, etc.
   - `/characters/` → Optional für custom Characters

3. Öffne `index.html` im Browser

**FERTIG!** 🎉

---

## 📈 PROGRESSION-SYSTEM

### Level-Up:
- XP durch: Missions, Gang Wars, Achievements
- Jedes Level: +2% auf alle Einkommen
- Level 10: Unlock Elite Recruitment
- Level 20: Unlock Boss Gang Wars
- Level 50: Max Level, +100% auf alles

### Prestige-Path:
```
Prestige 0 → Prestige 1 (1,000 Respect)
Prestige 1 → Prestige 5 (Hard Missions)
Prestige 5 → Prestige 10 (Hard Gang Wars)
Prestige 10 → Prestige 20 (Full Collection + Boss Gang Wars)
Prestige 20 → Prestige 50 (ENDGAME)
```

---

Made with 💚 for the Streets