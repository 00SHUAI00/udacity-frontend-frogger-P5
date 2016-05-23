'use strict';

/* Variables */

// create global variable of an empty object for environment variables
var env = env || {};

// array of possible Y positions for enemy to start at
env.positions = [100, 200, 300];

// array of possible winning sayings
env.winners = ["No boys for you!", "Cat lady 4 life!", "You're Commitment is to your career!"];

// array of possible losing sayings
env.losers = ["Kiss me my fool", "You're getting Married!", "Smooooooch"];

// initialize  total wins
env.totalWins = 0;

// initialize  total losses
env.totalLosses = 0;

// Setting up enemy speed and X,Y positions
var Enemy = function() {
    this.x = -100;
    this.y = 400;
    this.enemyspeed = 100;
    this.sprite = 'images/char-boy.png';
    this.reset();
};


/* Enemy Functions */

// Draws enemy on the canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update enemies position
Enemy.prototype.update = function(dt) {
    this.x += this.enemyspeed * dt;
    // reset enemy when they leave the screen
    if (this.x > 500) {
        this.reset();
    }
};

// Reset enemy after it leaves the screen
Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = env.positions[Math.floor(Math.random() * 3)];
    this.enemyspeed = Math.floor((Math.random() * 400) + 100);
};


/* Player Functions */

// Player's variables
var Player = function() {
    this.x = 200;
    this.y = 0;
    this.sprite = 'images/char-princess-girl.png';
};

// draw player to the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handles input from user to move player
Player.prototype.handleInput = function(event) {
    this.userInput = event;
    if (this.userInput === 'left') {
        this.x = this.x - 100;
    } else if (this.userInput === 'right') {
        this.x = this.x + 100;
    } else if (this.userInput === 'up') {
        this.y = this.y - 100;
    } else if (this.userInput === 'down') {
        this.y = this.y + 100;
    }
    if (this.y < 0) {
        this.reset();
    }
    if (this.y > 400) {
        this.youWin();
        this.reset();
    }
    if (this.x < 0 || this.x > 400) {
        this.reset();
    }
};

// Updates player's state, calls collide function
Player.prototype.update = function() {
    this.collide();
};

// if player collides with enemy reset and run loser function
Player.prototype.collide = function() {
    var current = this;
    allEnemies.forEach(function(enemy) {
        if (enemy.y == current.y) {
            if (enemy.x >= current.x - 20 && enemy.x <= current.x + 20) {
                current.youLose();
                current.reset();
            }
        }
    });
};

// prints loser statement and increments total losses variable
Player.prototype.youLose = function() {
    env.totalLosses++;
    var loser = "FAIL! " + env.losers[Math.floor(Math.random() * 3)] + " " + "(" + env.totalWins + "W" + "/" + env.totalLosses + "L" + ")";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "black";
    ctx.font = "15pt sans-serif";
    ctx.fillText(loser, 10, 35);
    // player loses game if total losses is greather than 10 and game resets
    if (env.totalLosses > 15) {
        alert("You Lose!");
        location.reload();
    }
};

// prints winner statement and increments total wins variable
Player.prototype.youWin = function() {
    env.totalWins++;
    var winner = "Score! " + env.winners[Math.floor(Math.random() * 3)] + " " + "(" + env.totalWins + "W" + "/" + env.totalLosses + "L" + ")";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "black";
    ctx.font = "15pt sans-serif";
    ctx.fillText(winner, 10, 35);
    // everytime player wins 2,4,6,8 rounds add another enemy
    if (env.totalWins % 2 === 0) {
        var helga = new Enemy();
        allEnemies.push(helga);
    }
    // everytime player wins 3,6,9 rounds add another enemy heart.
    if (env.totalWins % 3 === 0) {
        var hearts = new Enemy();
        hearts.sprite = 'images/Heart.png';
        allEnemies.push(hearts);
    }
    // if player wins 10 rounds they win game and it resets
    if (env.totalWins > 9) {
        alert("You Win!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        location.reload();
    }
};

// resets player back to starting position
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 0;
};

/* game environment */

// instantiates enemies and player
var helga = new Enemy();
var inga = new Enemy();
var frau = new Enemy();
var hearts = new Enemy();
hearts.sprite = 'images/Heart.png'; // changes default enemy sprite

// add enemies to the ememy array
var allEnemies = [helga, inga, frau, hearts];


// instantiate player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});