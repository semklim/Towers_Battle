import Game from "./modules/Game.js";

const C_Width = 1000;
const C_Height = 480;
const play = document.querySelector('.play');
const pause = document.querySelector('.stop');
const bannerBtns = document.querySelectorAll('[type="button"]');
const banner = document.querySelector('.banner');
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

	bannerBtns[0].addEventListener('click', startGame)

	bannerBtns[1].addEventListener('click', startGame)
});

// animation loop
function animate(timeStamp) {
	if(game.player1.life <= 0){
		play.removeEventListener('click', PlayAnime);
		pause.removeEventListener('click', stopAnime);
		cancelAnimationFrame(stop);
		gameOver(game.player1, 'left');
	}else if(game.player2 <= 0){
		play.removeEventListener('click', PlayAnime);
		pause.removeEventListener('click', stopAnime);
		cancelAnimationFrame(stop);
		gameOver(game.player2, 'right');
	}else{
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, C_Width, C_Height);
		game.update(deltaTime);
		game.draw(ctx);
		stop = requestAnimationFrame(animate);
	}
}

function gameOver (winner, tower) {
	ctx.clearRect(0, 0, C_Width, C_Height);
	const fontSize = 30;
	const fontFamily = 'Helvetica';
	const color = 'white';
	ctx.save();
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowColor = 'black';
	ctx.fillStyle = color;
	ctx.font = `bold ${fontSize}px ${fontFamily}`;
	ctx.fillText(`Tower from ${tower} is winner!`, (game.width - 350) / 2, (game.height - 35) / 2 - 20);
	ctx.fillText(`Score: ${winner.score}`, (game.width - 145) / 2, (game.height - 35) / 2 + 20);
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