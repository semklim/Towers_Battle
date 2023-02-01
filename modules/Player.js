
class Player {
	constructor(game, x = 0){
		this.game = game;
		this.width = 90;
		this.height = 155;
		this.x = x >= this.game.width || 
				 x > this.game.width - this.width ? 
				 this.game.width - this.width : 
				 x;
		this.y = this.game.height - this.height - 19;
		this.life = 200;
		this.frameX = 0;
		this.frameY = 0;
		this.status = 'Draw';
		this.damageDone = 0;
		this.countDeadUnits = 0;
		this.countCreatedUnits = 0;
		this.img = document.querySelector('#castle');
		this.score = 0;
	}

	draw(context) {
		if(this.life <= 0){
			this.frameX = 3;
		} else if (this.life < 60){
			this.frameX = 2;
		}else if (this.life < 120){
			this.frameX = 1;
		}
		context.drawImage(this.img, this.frameX  * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
	}
	
}
export default Player;