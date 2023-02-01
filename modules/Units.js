//t1Wolk - ходячий  : атакует === только ходячих  = (Skeleton) 
//t2Wolk - ходячий  : атакует === летающих        = (Zombie)
//t3Wolk - ходячий  : атакует === всех            = (Lizard)
//t4Fly  - летающий : атакует === только летающих = (Gragon)
//t5Fly  - летающий : атакует === только ходячих  = (Demon)

class Unit {
	constructor(game) {
		this.game = game;
		this.frameX = 0;
		this.life = 200;
		this.fps = 18;
		this.frameInterval = 1000/this.fps;
		this.frameTimer = 0;
		this.fontSize = 25;
		this.fontFamily = 'Helvetica';
		this.speedX = Math.round(Math.random() * (3 - 1) + 1);
	}
	update(deltaTime) {
		if (this.direction === 'right') {
			this.currentState = 'isMove';
			this.x += this.speedX;
			if(this.x > this.game.width) {
				this.markedForDeletion = true;
			}
		} else if(this.direction === 'left'){
			this.currentState = 'isMoveLeft';
			this.x -= this.speedX;
			if(this.x < 0) {
				this.markedForDeletion = true;
			}
		}
		
		this.unitAnimationLogic(this.states[this.currentState], deltaTime);
	}
	draw(context) {
		context.fillStyle = this.color;
		context.font = `${this.fontSize} 30px ${this.fontFamily}`;
		context.fillText(this.life, this.x, this.y - this.height - 20);

        context.drawImage(this.img, this.frameX  * this.width, this.states[this.currentState].frameY * this.height, this.width, this.height, this.x, this.y - 18, this.width, this.height);
	}
	unitAnimationLogic(state, deltaTime){
		if(this.frameTimer > this.frameInterval){
			if(this.frameX >= state.maxFrame){
				this.frameX = 0;
			}else{
				this.frameX += 1;
			}
			this.frameTimer = 0;
		} else{
			this.frameTimer += deltaTime
		}
	}
}

const states = {
	demon: {
		isMove: {
			frameY: 0,
			maxFrame: 5,
		},
		isMoveLeft: {
			frameY: 1,
			maxFrame: 5,
		},
		isAttack: {
			frameY: 0,
			maxFrame: 5,
		},
		isAttackLeft: {
			frameY: 1,
			maxFrame: 5,
		},
	},
	dragon: {
		isMove: {
			frameY: 0,
			maxFrame: 3,
		},
		isMoveLeft: {
			frameY: 1,
			maxFrame: 3,
		},
		isAttack: {
			frameY: 0,
			maxFrame: 3,
		},
		isAttackLeft: {
			frameY: 1,
			maxFrame: 3,
		},
	},
	groundTroops: {
		isMove: {
			frameY: 11,
			maxFrame: 8,
		},
		isMoveLeft: {
			frameY: 9,
			maxFrame: 8,
		},
		isAttack: {
			frameY: 7,
			maxFrame: 7,
		},
		isAttackLeft: {
			frameY: 5,
			maxFrame: 7,
		},
	}
}
class Demon extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 128;
		this.height = 128;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.currentState = direction === 'right' ? 'isMove' : 'isMoveLeft';
		this.states = states.demon;
		this.direction = direction;
		this.color = 'darkred';
		this.img = document.querySelector('#demon');
		this.isAttack = false;
		this.markedForDeletion = false;
    	this.tier = `t5Fly`;
		this.score = 4;
	}
}
class Skeleton extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.currentState = direction === 'right' ? 'isMove' : 'isMoveLeft';
		this.states = states.groundTroops;
		this.direction = direction;
		this.color = 'red';
		this.markedForDeletion = false;
		this.isAttack = false;
		this.img = document.querySelector('#skeleton');
    	this.tier = `t1Wolk`;
		this.score = 2;
	}
}
class Zombie extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.currentState = direction === 'right' ? 'isMove' : 'isMoveLeft';
		this.states = states.groundTroops;
		this.direction = direction;
		this.color = 'aqua';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#zombie');
    this.tier = `t2Wolk`;
	this.score = 5;
	}
}

class Lizard extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.currentState = direction === 'right' ? 'isMove' : 'isMoveLeft';
		this.states = states.groundTroops;
		this.direction = direction;
		this.color = 'violet';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#lizard');
    this.tier = `t3Wolk`;
	this.score = 1;
	}
}
class Dragon extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 128;
		this.height = 128;
		this.fps = 12;
		this.frameInterval = 1000/this.fps;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.currentState = direction === 'right' ? 'isMove' : 'isMoveLeft';
		this.states = states.dragon;
		this.direction = direction;
		this.color = 'yellow';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#dragon');
    	this.tier = `t4Fly`;
		this.score = 3;
	}
}
export { Demon, Skeleton, Zombie, Lizard, Dragon };