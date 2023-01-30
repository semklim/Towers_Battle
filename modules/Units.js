class Unit {
	constructor(game) {
		this.game = game;
		this.frameX = 0;
		this.life = 40;
		this.fps = 18;
		this.frameInterval = 1000/this.fps;
		this.frameTimer = 0;
		this.fontSize = 25;
		this.fontFamily = 'Helvetica';
		this.speedX = Math.random() * (2 - 1) + 0.5;
	}
	update(deltaTime) {
		
		if(!this.isAttack){

		if (this.direction === 'right') {
			this.x += this.speedX;
		} else if(this.direction === 'left'){
			this.x += this.speedX * -1;
		}
		}

		this.isAttack ? this.chooseState(this.states.isAttack, deltaTime) : this.chooseState(this.states.isMove, deltaTime)
	}
	draw(context) {
		context.fillStyle = this.color;
		context.font = `${this.fontSize} 30px ${this.fontFamily}`;
		context.fillText(this.life, this.x, this.y - this.height - 20);


		if(this.isAttack){
			context.drawImage(this.img, this.frameX * this.width, this.states.isAttack.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}else{
      //костыль зеркальной открисовки
      if(this.direction === `left`){
        context.drawImage(this.img, this.frameX  * this.width, this.states.isMoveLeft.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
      } else {
        context.drawImage(this.img, this.frameX  * this.width, this.states.isMove.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
      }
		}
	}
	chooseState(state, deltaTime){
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
			frameY: 1,
			maxFrame: 3,
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
			frameY: 2,
			maxFrame: 2,
		},
	},
	skeleton: {
		isMove: {
			frameY: 11,
			maxFrame: 8,
		},
		isMoveLeft: {
			frameY: 9,
			maxFrame: 8,
		},
		isAttack: {
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
		this.states = states.demon;
		this.direction = direction;
		this.color = 'green';
		this.img = document.querySelector('#demon');
		this.isAttack = false;
		this.markedForDeletion = false;
	}
}
class Skeleton extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.states = states.skeleton;
		this.direction = direction;
		this.color = 'red';
		this.markedForDeletion = false;
		this.isAttack = false;
		this.img = document.querySelector('#skeleton');
	}
}
class Zombie extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.states = states.skeleton;
		this.direction = direction;
		this.color = 'aqua';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#zombie');
	}
}

class Lizard extends Unit {
	constructor(game, direction) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.y = this.game.height - this.width;
		this.x = direction === 'right' ? 0 : this.game.width - this.width;
		this.states = states.skeleton;
		this.direction = direction;
		this.color = 'aqua';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#lizard');
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
		this.states = states.dragon;
		this.direction = direction;
		this.color = 'aqua';
		this.isAttack = false;
		this.markedForDeletion = false;
		this.img = document.querySelector('#dragon');
	}
}
export { Demon, Skeleton, Zombie, Lizard, Dragon };