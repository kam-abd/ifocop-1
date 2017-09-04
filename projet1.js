/* Pour réaliser cette page en HTML5/CSS et Javascript, je me suis fait aider par un ami développeur JS confirmé qui m'a beaucoup aidé,
notamment pour coder les comportements des blocs rouges (taille, vitesse, déplacements aléatoires) et pour le mouvement de notre cube */

// Les variables du jeu
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); // on "crée" l'objet qui nous permet de dessiner des carrés
var boardSize = 500; // Nous sert à placer du texte dans notre canvas
var playerSize = 10;
var enemySize = 10;
canvas.width = canvas.height = boardSize;
var x = boardSize/2 - playerSize/2;
var y = x;
var velY = 0;
var velX = 0;
var speed = 2;
var friction = 0.98;
var keys = [];
var level = 0; // Le niveau de départ
var enemiesPerWave = 5; // Le nombre d'ennemis augmente avec les niveaux
var activeEnemies = [  ];
var frame = 0;
var is_playing = false; // permet de mettre le jeu en pause ou de redémarrer une partie en cliquant
var ended = false;

// Notre écran d'accueil.
clearBoard();
ctx.font="22px PressStart2P";
ctx.fillStyle = '#FFF';
ctx.textAlign = 'center';
ctx.fillText('Evite les trucs', boardSize/2, boardSize/2); //le boardSize/2 nous permet de centrer verticalement notre texte dans notre canvas
ctx.font="15px PressStart2P";
ctx.fillText('Clique pour commencer', boardSize/2, boardSize/2 + 30);
ctx.font="11px PressStart2P";
ctx.fillText('Utilise les flèches du clavier', boardSize/2, boardSize/2 + 140);

function update() {

	if(!is_playing) return;

	// flèche haut
    if (keys[38]) {
        if (velY > -speed) {
            velY--;
        }
    }
    // bas
    if (keys[40]) {
        if (velY < speed) {
            velY++;
        }
    }
	// droite
    if (keys[39]) {
        if (velX < speed) {
            velX++;
        }
    }
	// gauche
    if (keys[37]) {
        if (velX > -speed) {
            velX--;
        }
    }
	// les mouvements de notre cube
    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    if (x >= boardSize-playerSize) {
        x = boardSize-playerSize;
    } else if (x <= 0) {
        x = 0;
    }

    if (y > boardSize-playerSize) {
        y = boardSize-playerSize;
    } else if (y <= 0) {
        y = 0;
    }

    updateScreen()
    setTimeout(update, 10);
}
// on dessine notre cube avec les méthodes de notre canvas
function drawPlayer(){
	ctx.beginPath();
    ctx.rect(x, y, playerSize, playerSize);
    ctx.fillStyle = '#FFF';
    ctx.fill();
}
// notre compteur de niveaux
function drawLevel(){
	ctx.font="14px PressStart2P";
	ctx.fillStyle = '#FFF';
	ctx.fillText('Level ' + level, 55, 24);
}
// et nos compétences qui s'affichent à mesure qu'on monte en niveau

function skills() {
	if (level >= 3) { 
		document.getElementById("front1").removeAttribute("style");
	}
	if (level >= 6) { 
		document.getElementById("frameworks").removeAttribute("style");
	}	
	if (level >= 9) { 
		document.getElementById("back").removeAttribute("style");
	}	
}	
	
function clearBoard(){
	ctx.clearRect(0, 0, boardSize, boardSize);
}

function updateScreen(){
	skills();
	clearBoard();
	drawLevel();
    drawPlayer();
    moveWave();
    frame++;
}
// Listeners
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
// Pour jouer ou mettre le jeu en pause avec la souris
document.getElementById('canvas').addEventListener('click', toggleGame)


function toggleGame(){
	if(ended){
		return resetGame();
	}
	
	if(is_playing){
		is_playing = false;
	}else{
		is_playing = true;
	}
	update();
}
// Cette fonction nous permet de revenir à l'état du niveau 1. De recommencer, quoi.
function resetGame(){
	clearBoard();
	level = 0;
	enemiesPerWave = 5;
	activeEnemies = [  ];
	frame = 0;
	is_playing = true;
	ended = false;
	x = boardSize/2 - playerSize/2;
	y = x;
	velY = 0;
	velX = 0;
	speed = 2;
	friction = 0.98;
	keys = [];
	update();
}
// l'écran quand on perd
function printGameOver(){
	clearBoard();
	ctx.font="25px PressStart2P";
	ctx.fillStyle = '#FFF';
	ctx.textAlign = 'center';
	ctx.fillText('DESINTEGRE !', boardSize/2, boardSize/2);
	ctx.font="15px PressStart2P";
	ctx.fillText('Tu as atteint le level ' + level, boardSize/2, boardSize/2 + 30);
	// On affiche des messages différents en fonction du score réalisé
	if (level <= 5) {
		ctx.font="10px PressStart2P";
		ctx.fillText('Ce n\'est vraiment pas fameux. Recommence', boardSize/2, boardSize/2 + 80);
	} else if (level > 5 && level <= 16) {
		ctx.font="10px PressStart2P";
		ctx.fillText('10/20. Passable. Peut mieux faire.', boardSize/2, boardSize/2 + 80);
	} else {
		ctx.font="10px PressStart2P";
		ctx.fillText('Tu es doué comme Cyril Hanouna !', boardSize/2, boardSize/2 + 80);
	}		
}
// Quand le jeu se termine et qu'on cesse donc de jouer, on déclenche la fonction printGameOver
function endGame(){
	is_playing = false;
	ended = true;
	printGameOver();
}

function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
// On dessine les ennemis
function drawEnemy(item){
	ctx.beginPath(); 
    ctx.rect(item.x, item.y, item.size, item.size);
    ctx.fillStyle = '#F00';
    ctx.fill();
}

function drawWave(){
	var item = {  }
	for(var i = 0; i < enemiesPerWave; i++) {
	    item = {
	    	'x': boardSize - 5,
	    	'y': random(0, boardSize),
	    	'active': true,
	    	'size': enemySize,
	    	'direction': 0,
	    	'speed': 1
	    };
	    activeEnemies.push(item) // Cette méthode permet d'augmenter le nombre de blocs rouges dans notre objet item.
	}
}
// Quand une vague est passée, une autre arrive. Le niveau et la difficulté augmente.
function moveWave(){
	if(!checkForActives()){
		drawWave();
		level++;
		frame = 0;
		waveUp();
	}
	
	for(var i = 0, len = activeEnemies.length; i < len; i++) {
		if(activeEnemies[i].x > 0 && activeEnemies[i].active === true){
		    drawEnemy(activeEnemies[i]);
		    activeEnemies[i].x -= activeEnemies[i].speed;
			activeEnemies[i].y += activeEnemies[i].direction;
			setDifficulty(activeEnemies[i], frame);
			everyOneInside(activeEnemies[i])
			if(crash(activeEnemies[i])){
				return endGame();
			}
		}else{
			activeEnemies[i].active = false;
		}
	}
}
// Les collisions
function crash(item){
	return (
		(
			(item.x + item.size > x && item.x + item.size < x + playerSize) &&
			(item.y + item.size > y && item.y + item.size < y + playerSize)
		)
		||
		(
			(item.x > x && item.x < x + playerSize) &&
			(item.y > y && item.y < y + playerSize)
		)
	)
}

function everyOneInside(item){
	if(item.y < 0){
		item.y = 0;
	}
	if(item.y > boardSize - enemySize){
		item.y = boardSize - enemySize;
	}
}
// A partir d'un certain niveau, les blocs rouge changent de trajectoire, de taille et de vitesse
function setDifficulty(item, frame){
	if(frame % 100 === 0 && level >= 5){
		item.direction = changeDirection();
	}
	if(level >= 20){
		item.y += item.y > y ? -1 : 1;
	}
	if(frame % 20 === 0 && level >= 10){
		item.size += (item.direction * 2) * changeDirection()
		if(item.size <= 0){
			item.size = 2;
		}
	}
	if(level >= 15){
		item.x -= item.direction + 1
	}
	if(level > 25 && level % 2 === 0){
		item.speed++;
	}
}
// Tous les cinq niveaux, le nombre de blocs rouges augmente
function waveUp(){
	if(level % 5 === 0){
		enemiesPerWave += 3;
	}
}

function checkForActives(){
	for(var i = 0, len = activeEnemies.length; i < len; i++) {
	    if(activeEnemies[i].active === true) return true;
	}
	return false;
}

function changeDirection(){
	return Math.floor(Math.random() * (1 - (-1) + 1)) + (-1);
}