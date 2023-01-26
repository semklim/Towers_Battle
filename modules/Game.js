import Player from "./Player.js";
import { Watermelon, Watermelon2 } from "./Enemy.js";
import UI from "./UI.js";

class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(this, 0, 0);
		this.player2 = new Player(this, this.width - 100, 0);
		// this.input = new InputHandler(this);
		this.ui = new UI(this);
		this.enemiesP1 = [];
		this.enemiesP2 = [];
		// this.keys = [];
		this.ammo = 10;
		this.maxAmmo = 50;
		this.enemy1Timer = 0;
		this.enemy2Timer = 0;
		this.enemyInterval = 1000;
		this.ammoTimer = 0;
		this.ammoInterval = 1500;
		this.score = 0;
		this.winningScore = 10;
	}
	update(deltaTime) {
		// logic of restoring projectiles
		if (this.ammoTimer > this.ammoInterval){
			if (this.ammo < this.maxAmmo) this.ammo += 1;
			this.ammoTimer = 0;
		} else{
			this.ammoTimer += deltaTime;
		}
		// Check if enemy is dead
		this.enemiesP1 = this.enemiesP1.filter(enemy => !enemy.markedForDeletion);
		this.enemiesP2 = this.enemiesP2.filter(enemy2 => !enemy2.markedForDeletion);
		// Creating new enemy and update positions of each
		this.enemiesP1.forEach(enemy => {
			enemy.update();
			if (this.checkCollision(this.player2, enemy)){
				enemy.markedForDeletion = true;
			}
		});
		this.enemiesP2.forEach(enemy2 => {
			enemy2.update();
			if (this.checkCollision(this.player1, enemy2)){
				enemy2.markedForDeletion = true;
			}
			this.enemiesP1.forEach(enemy => {
				if (this.checkCollision(enemy, enemy2)){
					enemy.markedForDeletion = true;
					enemy2.markedForDeletion = true;
				}
			});
		});
		// logic of pause in creating enemies
		// For player 1
			this.addEnemyP1(deltaTime);

		// For player 2
			this.addEnemyP2(deltaTime);

	}
	draw(context) {
		this.enemiesP1.forEach(enemy => {
			enemy.draw(context);
		});
		this.enemiesP2.forEach(enemy => {
			enemy.draw(context);
		});
		this.player1.draw(context);
		this.player2.draw(context);
		this.ui.draw(context);
	}
	addEnemyP1(deltaTime) {
		if (this.enemy1Timer >= this.enemyInterval){
			this.enemy1Timer = 0;
			this.enemiesP1.push(new Watermelon(this));
			this.enemyInterval = Math.random() * (1000 - 500) + 500;
		} else{
			this.enemy1Timer += deltaTime;
		}
	   }
	addEnemyP2(deltaTime) {
		if (this.enemy2Timer >= this.enemyInterval){
			this.enemy2Timer = 0;
			this.enemiesP2.push(new Watermelon2(this));
			this.enemyInterval = Math.random() * (1000 - 500) + 500;
		} else{
			this.enemy2Timer += deltaTime;
		}
	}
	   checkCollision(rect1, rect2) {
		return ( rect1.x < rect2.x + rect2.width &&
				 rect1.x + rect1.width > rect2.x &&
				 rect1.y < rect2.y + rect2.height &&
				 rect1.y + rect1.height > rect2.y )
	   }
}

export default Game;