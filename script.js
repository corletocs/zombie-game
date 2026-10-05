// User object
const user = {
    name: "Player 1",
    life: 100,
    attack: 10,
    heal: 20,
    potions: 3,
    xp: 0,
    level: 1,
    userAttack: function() {
        // Logic for attacking the zombie
        const damage = this.attack;
        zombie.life -= damage;
        flashDamage("zombieBox");
        // user.gainXP(10);
        logAction(`${this.name} attacks for ${damage} damage!`);
        updateUI();
        checkZombieLife();
    },
    userHeal: function() {
        // Logic for healing the user
        if (this.life >= 100) {
            logAction("You're already at full health.");
            return;
        }
        const healAmount = Math.min(this.heal, 100 - this.life);
        this.life += healAmount;
        logAction(`${this.name} heals for ${healAmount} HP.`);
        updateUI();
    },
    usePotion: function() {
        // Logic for using a potion
        if (this.potions > 0) {
            this.life = Math.min(100, this.life + 30);
            this.potions--;
            logAction(`${this.name} uses a potion and heals 30 HP.`);
        } else {
            logAction("No potions left!");
        }
        updateUI();
    },
    specialAttack: function() {
      // Logic for a special attack (deals 30 damage to the zombie)
        const damage = 30;
        zombie.life -= damage;
        // user.gainXP(15);
        logAction(`${this.name} uses a Special Attack for ${damage} damage!`);
        updateUI();
        checkZombieLife();
    },
    comboAttack: function() {
      // Logic for using a combo attack (attacks 3 times dealing random damage each time)
        let totalDamage = 0;
        logAction(`${this.name} starts a Combo Attack!`);
        for (let i = 0; i < 3; i++) {
            const damage = Math.floor(Math.random() * 10) + 5; // 5 to 14 damage
            totalDamage += damage;
            zombie.life -= damage;
            logAction(`Hit ${i + 1}: ${damage} damage.`);
        }
        // user.gainXP(20);
        updateUI();
        checkZombieLife();
    }
};

let poisonInterval = null;

// Zombie object
const zombie = {
    name: "Zombie",
    life: 150,
    attack: 8,
    zombieAttack: function() {
        // Logic for attacking the user
        const damage = this.attack;
        user.life -= damage;
        flashDamage("userBox");
        logAction(`${this.name} attacks for ${damage} damage!`);
        updateUI();
        checkUserLife();

        // Optional: Zombie poisons the user occasionally
        const shouldPoison = Math.random() < 0.3; // 30% chance
        if (shouldPoison && !this.isPoisoning) {
            this.poison();
        }
    },
    poison: function() {
        // Logic for poisoning the user each turn
        this.isPoisoning = true;
        logAction(`${this.name} poisoned the user!`);

        poisonInterval = setInterval(() => {
            this.applyPoisonEffect();
        }, 2000); // every 2 seconds
    },
    applyPoisonEffect: function() {
      // Logic for applying the poison
      if (user.life <= 0) {
            clearInterval(poisonInterval);
            return;
        }
        
        const poisonDamage = 5;
        user.life -= poisonDamage;
        flashDamage("userBox");
        logAction(`Poison deals ${poisonDamage} damage to ${user.name}.`);
        updateUI();
        checkUserLife();
    }
};

// Function to update the UI
function updateUI() {
    // Logic to update the user and zombie stats on the page
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userLife").textContent = user.life;
    document.getElementById("userLevel").textContent = user.level;
    document.getElementById("userXP").textContent = user.xp;
    document.getElementById("userPotions").textContent = user.potions;
    document.getElementById("zombieLife").textContent = zombie.life;
}

// Function to log actions
function logAction(action) {
    // Logic to log actions in the game
    const log = document.getElementById("log");
    const entry = document.createElement("p");
    entry.textContent = action;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Life checkers 
function checkZombieLife() {
    if (zombie.life <= 0) {
        zombie.life = 0;
        logAction("You defeated the zombie! 🎉");
        disableZombie();
    }
}

function checkUserLife() {
    if (user.life <= 0) {
        user.life = 0;
        logAction("You were defeated by the zombie! ☠️");
        disableUser();
    }
}

// Disable buttons
function disableUser() {
    document.querySelectorAll("#userBox button").forEach(btn => btn.disabled = true);
}

function disableZombie() {
    document.querySelector("#zombieBox button").disabled = true;
}

function flashDamage(elementId) {
    const el = document.getElementById(elementId);
    el.classList.add("damaged");

    setTimeout(() => {
        el.classList.remove("damaged");
    }, 300);
}

// Hook up to global scope
function userAttack() { user.userAttack(); }
function userHeal() { user.userHeal(); }
function usePotion() { user.usePotion(); }
function specialAttack() { user.specialAttack(); }
function comboAttack() { user.comboAttack(); }
function zombieAttack() { zombie.zombieAttack(); }