class Enemy {
	constructor(game) {
		this.game = game;
		this.speedX = Math.random() * (1.5 - 0.5) + 0.5;
	}
	update(deltaTime) {
		if (this.direction === 'right') {
			this.x += this.speedX;
			if(this.x > this.game.width - this.game.player1.width) this.markedForDeletion = true;
		} else if(this.direction === 'left'){
			this.x += this.speedX * -1;
			if(this.x < this.game.player2.width) this.markedForDeletion = true;
		}
		if(this.frameTimer > this.frameInterval){
			if(this.frameX >= this.maxFrame){
				this.frameX = 0;
				// this.frameY += 1;
			}else{
				this.frameX += 1;
			}
			this.frameTimer = 0;
		} else{
			this.frameTimer += deltaTime
		}
	}
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.drawImage(this.img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
	} 
}
class Daemon extends Enemy {
	constructor(game) {
		super(game);
		this.width = 128;
		this.height = 128;
		this.y = this.game.height - this.width;
		this.x = 0;
		this.frameX = 0;
		this.frameY = 0;
		this.fps = 9;
		this.frameTimer = 0;
		this.frameInterval = 1000/this.fps;
		this.maxFrame = 5;
		this.direction = 'right';
		this.color = 'green';
		this.img = document.querySelector('#deamon');
		this.markedForDeletion = false;
	}
}
class Watermelon2 extends Enemy {
	constructor(game) {
		super(game);
		this.width = 50;
		this.height = 50;
		this.y = this.game.height - this.width;
		this.x = this.game.width - this.width;
		this.direction = 'left';
		this.color = 'red';
		this.markedForDeletion = false;
		this.img = document.querySelector('#deamon');
	}
}

export {Daemon, Watermelon2};