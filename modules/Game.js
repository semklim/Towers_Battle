import Player from "./Player.js";
import { Demon, Skeleton, Zombie, Lizard, Dragon } from "./Units.js";
import UI from "./UI.js";


const setOfUnits = new Map([
	[1, (game, direction) => new Demon(game, direction)],
	[2, (game, direction) => new Skeleton(game, direction)],
	[3, (game, direction) => new Zombie(game, direction)],
	[4, (game, direction) => new Lizard(game, direction)],
	[5, (game, direction) => new Dragon(game, direction)],
  ]);

class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(this, 0);
		this.player2 = new Player(this, this.width - 100);
		this.ui = new UI(this);
		this.setOfUnits = setOfUnits;
		this.unitsP1 = [];
		this.unitsP2 = [];
		this.units1Timer = 0;
		this.units2Timer = 0;
		this.unitInterval = 1000;
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
		// Check if unit is dead
		this.unitsP1 = this.unitsP1.filter(unit => !unit.markedForDeletion);
		this.unitsP2 = this.unitsP2.filter(unit2 => !unit2.markedForDeletion);
		// Creating new unit and update positions of each
		this.unitsP1.forEach(unit => {
			unit.update(deltaTime);
			if (this.checkCollision(this.player2, unit)) {
				unit.markedForDeletion = true;
				this.score += 1;
			}
		});
		this.unitsP2.forEach((unit2) => {
			unit2.update(deltaTime);
			if (this.checkCollision(this.player1, unit2)) {
				unit2.markedForDeletion = true;
			}
			this.unitsP1.forEach((unit) => {
				if (this.checkCollision(unit, unit2)) {
					if (unit.life <= 0) {
						unit.markedForDeletion = true;
					} else {
							unit.direction === 'right' ? unit.x -= unit.speedX : unit.x += unit.speedX;
							unit2.life -= Math.floor(Math.random() * 20 + 3);
							console.log('Demon life = ' + unit.life);
					};
					if (unit2.life <= 0) {
						unit2.markedForDeletion = true;
					} else {
						unit2.direction === 'right' ? unit2.x -= unit2.speedX : unit2.x += unit2.speedX;
							unit.life -= Math.floor(Math.random() * 20 + 3);
							console.log('Skeletonon life ' +' = '  + unit2.life);
					}
				}
			});
		});
		// logic of pause in creating units
		// For player 1
		this.addUnitP1(deltaTime);

		// For player 2
		this.addUnitP2(deltaTime);

	}
	draw(context) {
		this.unitsP1.forEach(unit => {
			unit.draw(context);
		});
		this.unitsP2.forEach(unit => {
			unit.draw(context);
		});
		this.player1.draw(context);
		this.player2.draw(context);
		this.ui.draw(context);
	}
	addUnitP1(deltaTime) {
		if (this.units1Timer >= this.unitInterval) {
			this.units1Timer = 0;
			this.randomUnit(this.unitsP1, 'right');
			this.unitInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.units1Timer += deltaTime;
		}
	}
	addUnitP2(deltaTime) {
		if (this.units2Timer >= this.unitInterval) {
			this.units2Timer = 0;
			this.randomUnit(this.unitsP2, 'left');
			this.unitInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.units2Timer += deltaTime;
		}
	}
	checkCollision(rect1, rect2) {
		return (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width >= rect2.x)
	}
	randomUnit(arr, direction){
		const randomNum = Math.floor(Math.random() * this.setOfUnits.size + 1);
		const unit = this.setOfUnits.get(randomNum);
			arr.push(unit(this, direction));
	}
}

export default Game;