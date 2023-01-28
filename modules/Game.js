import Player from "./Player.js";
import { Daemon, Watermelon2 } from "./Enemy.js";
import UI from "./UI.js";


const setOfUnits = new Map([
	[1, (game, direction) => new Daemon(game, direction)],
	[2, (game, direction) => new Watermelon2(game, direction)],
  ]);

class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(this, 0);
		this.player2 = new Player(this, this.width - 100);
		this.ui = new UI(this);
		this.setOfUnits = setOfUnits;
		this.enemiesP1 = [];
		this.enemiesP2 = [];
		this.enemy1Timer = 0;
		this.enemy2Timer = 0;
		this.enemyInterval = 1000;
		this.score = 0;
		this.winningScore = 10;
	}
	update(deltaTime) {
		// logic of restoring projectiles
		if (this.ammoTimer > this.ammoInterval) {
			if (this.ammo < this.maxAmmo) this.ammo += 1;
			this.ammoTimer = 0;
		} else {
			this.ammoTimer += deltaTime;
		}
		// Check if enemy is dead
		this.enemiesP1 = this.enemiesP1.filter(enemy => !enemy.markedForDeletion);
		this.enemiesP2 = this.enemiesP2.filter(enemy2 => !enemy2.markedForDeletion);
		// Creating new enemy and update positions of each
		this.enemiesP1.forEach(enemy => {
			enemy.update(deltaTime);
			// if (this.checkCollision(this.player2, enemy)) {
			// 	enemy.markedForDeletion = true;
			// }
		});
		this.enemiesP2.forEach((enemy2) => {
			enemy2.update(deltaTime);
			// if (this.checkCollision(this.player1, enemy2)) {
			// 	enemy2.markedForDeletion = true;
			// }
			this.enemiesP1.forEach((enemy) => {
				if (this.checkCollision(enemy, enemy2)) {
					if (enemy.life <= 0) {
						enemy.markedForDeletion = true;
					} else {
							enemy2.life -= Math.floor(Math.random() * 20 + 3);
							console.log('Deamon life = ' + enemy.life);
							if(enemy === this.enemiesP1.at(-1)){
								this.enemy1Timer = 0;
						}
					};
					if (enemy2.life <= 0) {
						enemy2.markedForDeletion = true;
					} else {
							enemy.life -= Math.floor(Math.random() * 20 + 3);
							console.log('Sceleton life ' +' = '  + enemy2.life);
							if(enemy2 === this.enemiesP2.at(-1)){
								this.enemy2Timer = 0;
							// }
						}
					}
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
		if (this.enemy1Timer >= this.enemyInterval) {
			this.enemy1Timer = 0;
			this.randomUnit(this.enemiesP1, 'right');
			this.enemyInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.enemy1Timer += deltaTime;
		}
	}
	addEnemyP2(deltaTime) {
		if (this.enemy2Timer >= this.enemyInterval) {
			this.enemy2Timer = 0;
			this.randomUnit(this.enemiesP2, 'left');
			this.enemyInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.enemy2Timer += deltaTime;
		}
	}
	checkCollision(rect1, rect2) {
		return (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y)
	}
	randomUnit(arr, direction){
		const randomNum = Math.floor(Math.random() * 2 + 1);
		const unit = this.setOfUnits.get(randomNum);
			arr.push(unit(this, direction));
	}
}

export default Game;