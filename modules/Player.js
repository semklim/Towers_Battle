
class Player {
	constructor(game, x = 0){
		this.game = game;
		this.width = 90;
		this.height = 155;
		this.x = x === this.game.width ? x - this.width : x;
		this.y = this.game.height - this.height - 19;
		this.life = 200;
		this.frameX = 0;
		this.frameY = 0;
		this.isDead = false;
		this.img = document.querySelector('#castle');
		this.score = 0;
	}

	draw(context) {
		if(this.life <= 0){
			this.frameX = 9;
		} else if (this.life < 60){
			this.frameX = 6;
		}else if (this.life < 120){
			this.frameX = 3;
		}
		context.drawImage(this.img, this.frameX  * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
	}
	
}
export default Player;