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
		this.unitsP1 = this.unitsP1.filter(unit => {
			if(unit.markedForDeletion) {
				this.player1.countDeadUnits += 1;
				this.player2.score += unit.score;
			}
			return !unit.markedForDeletion
		});
		this.unitsP2 = this.unitsP2.filter(unit2 => {
			if(unit2.markedForDeletion) {
				this.player2.countDeadUnits += 1;
				this.player1.score += unit2.score;
			}
			return !unit2.markedForDeletion
		});
		// Creating new unit and update positions of each
		this.unitsP1.forEach(unit => {
			unit.update(deltaTime);
			if (this.checkCollision(this.player2, unit)) {
				this.player2.life -= this.unitsDamage(this.player1);
				if(this.player2.life <= 0){ 
					this.player1.status = 'Winner';
					this.player2.status = 'Loser';
				}
			}
		});
		this.unitsP2.forEach((unit2) => {
			unit2.update(deltaTime);
			if (this.checkCollision(this.player1, unit2)) {
				this.player1.life -= this.unitsDamage(this.player2);
				if(this.player1.life <= 0){
					this.player2.status = 'Winner';
					this.player1.status = 'Loser';
				} 
			}
			this.unitsP1.forEach((unit) => {
				if (this.checkCollision(unit, unit2)) {
					if (unit.life <= 0) {
						unit.markedForDeletion = true;
					} else {
							unit.x -= unit.speedX;
							//
              if (unit.tier === `t1Wolk` && (unit2.tier === `t1Wolk` || unit2.tier === `t2Wolk` || unit2.tier === `t3Wolk`)){
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage(this.player1);
              }
              if (unit.tier === `t2Wolk` && (unit2.tier === `t4Fly` || unit2.tier === `t5Fly`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage(this.player1);
              }
              if (unit.tier === `t3Wolk` && unit2.tier !== false) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage(this.player1);
              }
              if (unit.tier === `t4Fly` && (unit2.tier === `t4Fly` || unit2.tier === `t5Fly`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage(this.player1);
              }
              if (unit.tier === `t5Fly` && (unit2.tier === `t1Wolk` || unit2.tier === `t2Wolk`)) {
                unit.currentState = 'isAttack';
                unit2.life -= this.unitsDamage(this.player1);
              }

					};
				if (unit2.life <= 0) {
					unit2.markedForDeletion = true;
				} else {
						unit2.x += unit2.speedX;

              if (unit2.tier === `t1Wolk` && (unit.tier === `t1Wolk` || unit.tier === `t2Wolk` || unit.tier === `t3Wolk`)){
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage(this.player2);
              }
              if (unit2.tier === `t2Wolk` && (unit.tier === `t4Fly` || unit.tier === `t5Fly`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage(this.player2);
              }
              if (unit2.tier === `t3Wolk` && unit.tier !== false) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage(this.player2);
              }
              if (unit2.tier === `t4Fly` && (unit.tier === `t4Fly` || unit.tier === `t5Fly`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage(this.player2);
              }
              if (unit2.tier === `t5Fly` && (unit.tier === `t1Wolk` || unit.tier === `t2Wolk`)) {
                unit2.currentState = 'isAttackLeft';
                unit.life -= this.unitsDamage(this.player2);
              }
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
		if (this.units1Timer >= this.unitInterval) {
			this.units1Timer = 0;
			this.randomUnit(this.unitsP1, 'right');
			this.player1.countCreatedUnits += 1;
			this.unitInterval = Math.random() * (1000 - 500) + 500;
		} else {
			this.units1Timer += deltaTime;
		}
	}
	addUnitP2(deltaTime) {
		if (this.units2Timer >= this.unitInterval) {
			this.units2Timer = 0;
			this.randomUnit(this.unitsP2, 'left');
			this.player2.countCreatedUnits += 1;
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
	unitsDamage(player) {
		const damage = Math.floor(Math.random() * 20 + 3);
		player.damageDone += damage;
		return damage;
	}
}

export default Game;