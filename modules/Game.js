//t1Wolk - ходячий  : атакует === только ходячих  = (Skeleton) 
//t2Wolk - ходячий  : атакует === летающих        = (Zombie)
//t3Wolk - ходячий  : атакует === всех            = (Lizard)
//t4Fly  - летающий : атакует === только летающих = (Gragon)
//t5Fly  - летающий : атакует === только ходячих  = (Demon)


import Player from "./Player.js";
import { Demon, Skeleton, Zombie, Lizard, Dragon } from "./Units.js";
import UI from "./UI.js";


const setOfUnits = new Map([
	[1, (game, direction) => new Demon(game, direction)],
	[2, (game, direction) => new Dragon(game, direction)],
	[3, (game, direction) => new Zombie(game, direction)],
	[4, (game, direction) => new Lizard(game, direction)],
	[5, (game, direction) => new Skeleton(game, direction)],
  ]);

class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(this, 5);
		this.player2 = new Player(this, this.width);
		this.ui = new UI(this);
		this.setOfUnits = setOfUnits;
		this.unitsP1 = [];
		this.unitsP2 = [];
		this.units1Timer = 0;
		this.units2Timer = 0;
		this.unitInterval = 1000;
	}
	update(deltaTime) {

		// Check if unit is dead
		this.unitsP1 = this.unitsP1.filter(unit => !unit.markedForDeletion);
		this.unitsP2 = this.unitsP2.filter(unit2 => !unit2.markedForDeletion);
		// Creating new unit and update positions of each
		this.unitsP1.forEach(unit => {
			unit.update(deltaTime);
			if (this.checkCollision(this.player2, unit)) {
				this.player2.life -= this.unitsDamage();
				if(this.player2.life <= 0) this.player2.isDead = true;
				// unit.markedForDeletion = true;
			}
		});
		this.unitsP2.forEach((unit2) => {
			unit2.update(deltaTime);
			if (this.checkCollision(this.player1, unit2)) {
				this.player1.life -= this.unitsDamage();
				if(this.player1.life <= 0) this.player1.isDead = true;
				// unit2.markedForDeletion = true;
			}
			this.unitsP1.forEach((unit) => {
				if (this.checkCollision(unit, unit2)) {
					if (unit.life <= 0) {
						unit.markedForDeletion = true;
						this.player2.score += 1;
					} else {
							unit.x -= unit.speedX;
							//
              if (unit.tier === `t1Wolk` && (unit2.tier === `t1Wolk` || unit2.tier === `t2Wolk` || unit2.tier === `t3Wolk`)){
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage();
              }
              if (unit.tier === `t2Wolk` && (unit2.tier === `t4Fly` || unit2.tier === `t5Fly`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage();
              }
              if (unit.tier === `t3Wolk` && unit2.tier !== false) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage();
              }
              if (unit.tier === `t4Fly` && (unit2.tier === `t4Fly` || unit2.tier === `t5Fly`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage();
              }
              if (unit.tier === `t5Fly` && (unit2.tier === `t1Wolk` || unit2.tier === `t2Wolk`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage();
              }
							//
              // старый вариант
              // unit.x -= unit.speedX;
							// unit.currentState = 'isAttack';
							// unit2.life -= this.unitsDamage();
					};
					if (unit2.life <= 0) {
						unit2.markedForDeletion = true;
						this.player2.score += 1;
					} else {
							unit2.x += unit2.speedX;
              //
              if (unit2.tier === `t1Wolk` && (unit.tier === `t1Wolk` || unit.tier === `t2Wolk` || unit.tier === `t3Wolk`)){
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage();
              }
              if (unit2.tier === `t2Wolk` && (unit.tier === `t4Fly` || unit.tier === `t5Fly`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage();
              }
              if (unit2.tier === `t3Wolk` && unit.tier !== false) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage();
              }
              if (unit2.tier === `t4Fly` && (unit.tier === `t4Fly` || unit.tier === `t5Fly`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage();
              }
              if (unit2.tier === `t5Fly` && (unit.tier === `t1Wolk` || unit.tier === `t2Wolk`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage();
              }
							//
              // старый вариант
              // unit2.x += unit2.speedX;
							// unit2.currentState = 'isAttackLeft';
							// unit.life -= this.unitsDamage();
					}
				}
			});
		});
		// logic of creating units
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
		if (this.units1Timer >= this.unitInterval && this.unitsP1.length < 5) {
			this.units1Timer = 0;
			this.randomUnit(this.unitsP1, 'right');
			this.unitInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.units1Timer += deltaTime;
		}
	}
	addUnitP2(deltaTime) {
		if (this.units2Timer >= this.unitInterval && this.unitsP2.length < 5) {
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
	unitsDamage() {
		return Math.floor(Math.random() * 20 + 3)
	}
}

export default Game;