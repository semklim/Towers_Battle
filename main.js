import Game from "./modules/Game.js";

const C_Width = 600;
const C_Height = 480;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const game = new Game(C_Width, C_Height);

window.addEventListener('load', function onLoadPage(){
	// canvas setup
	canvas.width = C_Width;
	canvas.height = C_Height;
	canvas.style.border = '2px solid black';
	animate(0);
});

// animation loop
let lastTime = 0;
let stop;
let isPaused = false;
// animation loop
function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, C_Width, C_Height);
		game.update(deltaTime);
		game.draw(ctx);
		stop = requestAnimationFrame(animate);
}

function stopAnime(){
	cancelAnimationFrame(stop);
	isPaused = true;
}

const play = document.querySelector('.play');
const pause = document.querySelector('.stop');

play.addEventListener('click', () => {
	if(isPaused){
		animate(lastTime);
		isPaused = false;
	}
});

pause.addEventListener('click', stopAnime);