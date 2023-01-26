class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 25;
		this.fontFamily = 'Helvetica';
		this.color = 'white';
	}
	draw(context){
		// draw the score
		context.save();

		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'black';
		context.fillStyle = this.color;
		context.font = `${this.fontSize} 30px ${this.fontFamily}`;
		context.fillText(`Score: ${this.game.score}`, 10, 40);

		// draw a projectile amount
		context.restore();
	}
}
export default UI