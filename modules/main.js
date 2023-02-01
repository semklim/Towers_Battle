import Game from "./Game.js";

const C_Width = 1000;
const C_Height = 480;
const play = document.querySelector('.play');
const pause = document.querySelector('.stop');
const bannerBtns = document.querySelectorAll('[type="button"]');
const banner = document.querySelector('.banner');
const onLoadBanner = document.querySelector('.notLoad');
const audio = new Audio('./sound/music/Alexey_Anisimov_-_8-bit_Arcade_Game_Music.mp3');
	  audio.volume = 0.3;
	  audio.loop = true;
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let lastTime = 0;
let stop;
let isPaused = false;

function startGame({target:{value}}){
	if(value === 'Yes'){
		banner.remove();
	}
	if(value === 'No'){
		banner.remove();
		alert('good luck');
	}

		canvas.classList.toggle('blur');
		animate(0);
		audio.play();
}

const game = new Game(C_Width, C_Height);
window.addEventListener('load', function onLoadPage(){
	// canvas setup
	canvas.width = C_Width;
	canvas.height = C_Height;
	canvas.style.border = '2px solid black';

	bannerBtns[0].addEventListener('click', startGame);

	bannerBtns[1].addEventListener('click', startGame);
	onLoadBanner.remove();
});

// animation loop
function animate(timeStamp) {
	if(game.player1.life <= 0 || game.player2.life <= 0){
		play.removeEventListener('click', PlayAnime);
		pause.removeEventListener('click', stopAnime);
		cancelAnimationFrame(stop);
		gameOver(game.player1, game.player2);
	}else{
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, C_Width, C_Height);
		game.update(deltaTime);
		game.draw(ctx);
		stop = requestAnimationFrame(animate);
	}
}

function gameOver (player1, player2) {
	ctx.clearRect(0, 0, C_Width, C_Height);
	const fontSize = 30;
	const fontFamily = 'Helvetica';
	const color = 'white';
	const tower1 = {
		x: 55,
		y: (game.height - 35) / 2
}
	const tower2 = {
		x: game.width - 445,
		y: (game.height - 35) / 2
}
	ctx.fillStyle = '#6ab4dd';
	ctx.fillRect(tower1.x - 30, (game.height - 140) / 2, 450, 180);
	ctx.fillRect(tower2.x - 30, (game.height - 140) / 2, 450, 180);
	ctx.save();
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowColor = 'black';
	ctx.fillStyle = color;
	ctx.font = `bold ${fontSize}px ${fontFamily}`;
	ctx.fillText(`Tower from left, ${player1.status}`, tower1.x, tower1.y - 20);
	ctx.fillText(`Score: ${player1.score}`, tower1.x, tower1.y + 20);
	ctx.fillText(`Damage Done: ${player1.damageDone}`, tower1.x, tower1.y + 50);
	ctx.fillText(`Created Units: ${player1.countCreatedUnits}`, tower1.x, tower1.y + 80);
	ctx.fillText(`Dead Units: ${player1.countDeadUnits}`, tower1.x, tower1.y + 110);

	ctx.fillText(`Tower from right, ${player2.status}`, tower2.x, tower2.y - 20);
	ctx.fillText(`Score: ${player2.score}`, tower2.x, tower2.y + 20);
	ctx.fillText(`Damage Done: ${player2.damageDone}`, tower2.x, tower2.y + 50);
	ctx.fillText(`Created Units: ${player2.countCreatedUnits}`, tower2.x, tower2.y + 80);
	ctx.fillText(`Dead Units: ${player2.countDeadUnits}`, tower2.x, tower2.y + 110);
	ctx.restore();
}

function stopAnime(){
	cancelAnimationFrame(stop);
	audio.pause();
	isPaused = true;
}

function PlayAnime() {
	if(isPaused){
		animate(lastTime);
		audio.play();
		isPaused = false;
	}
}

play.addEventListener('click', PlayAnime);
pause.addEventListener('click', stopAnime);