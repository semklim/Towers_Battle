class Enemy {
	constructor(game) {
		this.game = game;
		this.speedX = Math.random() * (1.5 - 0.5) + 0.5;
	}
	update() {
		if (this.direction === 'right') {
			this.x += this.speedX;
			if(this.x > this.game.width - this.game.player1.width) this.markedForDeletion = true;
		} else if(this.direction === 'left'){
			this.x += this.speedX * -1;
			if(this.x < this.game.player2.width) this.markedForDeletion = true;
		}
	}
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	} 
}
class Watermelon extends Enemy {
	constructor(game) {
		super(game);
		this.width = 50;
		this.height = 50;
		this.y = this.game.height - this.width;
		this.x = 0;
		this.direction = 'right';
		this.color = 'green';
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
	}
}

export {Watermelon, Watermelon2};