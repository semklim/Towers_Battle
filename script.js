'use strict'
const C_Width = 600;
const C_Height = 480;
// const logo = document.querySelector('#logo');
// const logo2 = document.querySelector('#logo2');
// const boom = document.querySelector('#boom');
// const player1 = document.querySelector('#player1');
// const watermelonFruit = document.querySelector('#watermelon');
// const imgGameOver = document.querySelector('#game_over');
// const gameOver = new Audio('./sound/over.mp3');
// 	  gameOver.volume = 0.2;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('load', function onLoadPage(){
	// canvas setup
	canvas.width = C_Width;
	canvas.height = C_Height;
	canvas.style.border = '2px solid black';
	animate(0);
});

// class InputHandler {
// 	constructor(game) {
// 		this.game = game;
// 		window.addEventListener('keydown', this.onPressBtn);
// 		window.addEventListener('keyup', this.onUnPressBtn);
// 	}
// 	onPressBtn = (e) => {
// 		if((	(e.code === 'ArrowLeft')	||
// 				(e.code === 'ArrowRight')
// 		) && this.game.keys.indexOf(e.code) === -1){
// 			this.game.keys.push(e.code);
// 		}else if(e.code === 'Space' && this.game.keys.indexOf(e.code) === -1) {
// 			this.game.player1.shootTop();
// 		}

// 	}
// 	onUnPressBtn = (e) => {
// 		if(this.game.keys.indexOf(e.code) > -1){
// 			this.game.keys.splice(this.game.keys.indexOf(e.code), 1);
// 		}
// 	}
// }
class Projectile {
	constructor(game, x, y) {
		this.game = game;
		this.width = 40;
		this.height = 40;
		this.x = x + (this.game.player1.width / 2) - this.width / 2;
		this.y = y - this.height;
		this.speed = 3;
		this.markedForDeletion = false;
	}
	update() {
		this.y -= this.speed;
		if(this.y < 0) this.markedForDeletion = true;
	}
	draw(context){
		context.fillStyle = 'yellow';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

}
class Player {
	constructor(game, x = 0, y= 0){
		this.game = game;
		this.width = 200 / 2;
		this.height = 176 / 2;
		this.x = x;
		this.y = C_Height - this.height;
		this.speedX = 0;
		this.maxSpeed = 5;
		this.projectile = [];
		this.isDead = false;
	}

	draw(context) {
		context.fillStyle = 'black';
		ctx.fillRect(this.x, this.y, this.width, this.height);
		// drawing each projectile
		this.projectile.forEach((projectile) => {
			projectile.draw(context);
		});
	}
	
}
class Enemy {
	constructor(game) {
		this.game = game;
		this.speedX = Math.random() * (1.5 - 0.5) + 0.5;
	}
	update() {
		if (this.direction === 'right') {
			this.x += this.speedX;
			if(this.x > C_Width - this.game.player1.width) this.markedForDeletion = true;
		} else if(this.direction === 'left'){
			this.x += this.speedX * -1;
			if(this.x < this.game.player2.width) this.markedForDeletion = true;
		}
	}
	draw(context) {
		context.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	} 
}
class Watermelon extends Enemy {
	constructor(game) {
		super(game);
		this.width = 50;
		this.height = 50;
		this.y = C_Height - this.width;
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
		this.y = C_Height - this.width;
		this.x = C_Width - this.width;
		this.direction = 'left';
		this.color = 'red';
		this.markedForDeletion = false;
	}
}
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
		for (let i = 0; i < this.game.ammo; i++) {
			context.fillRect(10 + 5 * i, 50, 3, 20);
		}

		context.restore();
	}

}
class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(this, 0, 0);
		this.player2 = new Player(this, C_Width - 100, 0);
		// this.input = new InputHandler(this);
		this.ui = new UI(this);
		this.enemiesP1 = [];
		this.enemiesP2 = [];
		// this.keys = [];
		this.ammo = 10;
		this.maxAmmo = 50;
		this.enemyTimer = 0;
		this.enemyInterval = 1000;
		this.ammoTimer = 0;
		this.ammoInterval = 1500;
		this.score = 0;
		this.winningScore = 10;
	}
	update(deltaTime) {
		// logic of restoring projectiles
		if (this.ammoTimer > this.ammoInterval){
			if (this.ammo < this.maxAmmo) this.ammo += 1;
			this.ammoTimer = 0;
		} else{
			this.ammoTimer += deltaTime;
		}
		// Check if enemy is dead
		this.enemiesP1 = this.enemiesP1.filter(enemy => !enemy.markedForDeletion);
		this.enemiesP2 = this.enemiesP2.filter(enemy2 => !enemy2.markedForDeletion);
		// Creating new enemy and update positions of each
		this.enemiesP1.forEach(enemy => {
			enemy.update();
			if (this.checkCollision(this.player2, enemy)){
				enemy.markedForDeletion = true;
			}
		});
		this.enemiesP2.forEach(enemy2 => {
			enemy2.update();
			if (this.checkCollision(this.player1, enemy2)){
				enemy2.markedForDeletion = true;
			}
			this.enemiesP1.forEach(enemy => {
				if (this.checkCollision(enemy, enemy2)){
					enemy.markedForDeletion = true;
					enemy2.markedForDeletion = true;
				}
			});
		});
		// logic of pause in creating enemies
		if (this.enemyTimer > this.enemyInterval){
			this.addEnemy();
			this.enemyTimer = 0;
		} else{
			this.enemyTimer += deltaTime;
		}
	}
	draw(context) {
		this.enemiesP1.forEach(enemy => {
			enemy.draw(context);
		});
		this.enemiesP2.forEach(enemy => {
			enemy.draw(context);
		});
		this.player1.draw(context);
		this.player2.draw(context);
		this.ui.draw(context);
	}
	addEnemy() {
			this.enemiesP1.push(new Watermelon(this));
			this.enemiesP2.push(new Watermelon2(this));
	   }
	   checkCollision(rect1, rect2) {
		return ( rect1.x < rect2.x + rect2.width &&
				 rect1.x + rect1.width > rect2.x &&
				 rect1.y < rect2.y + rect2.height &&
				 rect1.y + rect1.height > rect2.y )
	   }
}
const game = new Game(C_Width, C_Height);
let lastTime = 0;
// animation loop
function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, C_Width, C_Height);
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(animate);
}
