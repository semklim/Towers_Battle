
class Player {
	constructor(game, x = 0){
		this.game = game;
		this.width = 200 / 2;
		this.height = 176 / 2;
		this.x = x;
		this.y = this.game.height - this.height;
		this.isDead = false;
	}

	draw(context) {
		context.fillStyle = 'black';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
}
export default Player;