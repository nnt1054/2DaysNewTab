var
/**
 * Constants
 */
pi = Math.PI,
directioncounter = 0,
UpArrow   = 38,
DownArrow = 40,
LeftArrow = 37,
RightArrow = 39,
SpaceBar = 32,
score = 0,
/**
 * Game elements
 */
canvas,
ctx,
keystate,
WIDTH = document.body.clientWidth;
HEIGHT = document.body.clientHeight;
/**
 * The player paddle
 *
 * @type {Object}
 */
player = {
	x: WIDTH/2,
	y: HEIGHT-50,
	width:  15,
	height: 15,
	reload: 0,
	reload_time: 10,
	enemy_timer: 0,
	enemy_reset: 30,
	dead: 0,
	/**
	 * Update the position depending on pressed keys
	 */
	update: function() {

        for (i = enemies.length-1; i >= 0; i--) {
            if (Math.sqrt(Math.pow(enemies[i].info.x - this.x, 2) + Math.pow(enemies[i].info.y - this.y, 2)) <= enemies[i].info.height-10) {
                this.dead = 1;
                };
            }
		if (keystate[UpArrow]) this.y -= 7;
		if (keystate[DownArrow]) this.y += 7;
		// keep the paddle inside of the canvas
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);


		if (keystate[LeftArrow]) this.x -= 7;
		if (keystate[RightArrow]) this.x += 7;
		// keep the paddle inside of the canvas
		this.x = Math.max(Math.min(this.x, WIDTH - this.height), 0);

	if (this.enemy_timer <= 0) {
		enemies.push(new makeEnemy());
		enemies.push(new makeEnemy2());
		this.enemy_timer = this.enemy_reset - (15 * (score/(score + 5)));
		};


		if (keystate[SpaceBar]) {
		    if (this.reload === 0) {
		        bullets.push(new bullet(this.x, this.y));
		        this.reload = this.reload_time;
		        };
		    };

	if (this.reload > 0) {this.reload -= 1};
	if (this.enemy_timer > 0) {this.enemy_timer -= 1};

	},
	/**
	 * Draw the player paddle to the canvas
	 */
	draw: function() {
	    ctx.beginPath();
	    ctx.fillStyle = "blue";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fill();
	}
},
bullet = function (xpos,ypos) {
    this.info = {
    x: xpos + 5,
	y: ypos,
	width:  8,
	height: 8,
	velocity: 30,
	collision: 0,
	oobounds: 0,

    update: function() {
             this.y -= this.velocity;
             for (i = enemies.length-1; i >= 0; i--) {
                if (Math.sqrt(Math.pow(enemies[i].info.x - this.x, 2) + Math.pow(enemies[i].info.y - this.y, 2)) <= enemies[i].info.height) {
                    enemies[i].info.collision = 1;
                    this.collision = 1;
                    score += 1;
                    };
                }
        },

    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(this.x, this.y, this.width/2, 0, 2*pi);
        ctx.fill();
        }
   };
},
bullets = [new bullet(player.x, player.y)];
enemies = [new makeEnemy()];

function randY() {
    if (Math.random() < 0.5) {
        return 1;
    } else {
        return HEIGHT;
    }
}

function updatelist(list) {
    for (j = 0; j < list.length; j++) {
        list[j].info.update();
    };
    for (i = list.length-1; i >= 0; i--) {
        if (list[i].info.y < 0 || list[i].info.collision == 1 || list[i].info.oobounds == 1) {list.splice(i, 1)};
    };
}
function drawlist(list) {
    for (i = list.length-1; i > -1; i--) {
        list[i].info.draw();
    };
}
function makeEnemy() {
  this.info = {
	x: Math.random() * WIDTH,
	y: 1,
	width:  50,
	height: 50,
	collision: 0,
	xvel: Math.random()*1-(1/2),
	yvel: 3,
	oobounds: 0,

    update: function() {
            this.x += this.xvel;
            this.y += this.yvel;
            if (this.y > HEIGHT + (this.height * 2)) {this.oobounds = 1};
        },

    draw: function() {
						ctx.beginPath();
						ctx.arc(this.x, this.y, this.width/2, 0, 2*pi);
						ctx.lineWidth = 5
						ctx.strokeStyle = 'gray';
						ctx.shadowColor = 'rgba(0,0,0,0.7)';
						ctx.shadowBlur = 2;
						ctx.shadowOffsetX = -6;
						ctx.shadowOffsetY = 6;
						ctx.stroke();
        }
   };
}
function makeEnemy2() {
  this.info = {
  x: Math.random() * WIDTH,
	y: HEIGHT,
	width:  50,
	height: 50,
	collision: 0,
	xvel: Math.random()*1-(1/2),
	yvel: -3,
	oobounds: 0,

    update: function() {
            this.x += this.xvel;
            this.y += this.yvel;
            if (this.y < -this.height*2) {this.oobounds = 1};
        },

    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, 2*pi);
				ctx.lineWidth = 5
				ctx.strokeStyle = 'gray';
				ctx.shadowColor = 'rgba(0,0,0,0.7)';
				ctx.shadowBlur = 2;
	      ctx.shadowOffsetX = -6;
	      ctx.shadowOffsetY = 6;
				ctx.stroke();
        }
   };
}
function main() {
	// create, initiate and append game canvas
	canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.appendChild(document.getElementById("game"))
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	keystate = {};
	// keep track of keyboard presses
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	init(); // initiate game objects
	// game loop function
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}
/**
 * Initatite game objects and set start positions
 */
function init() {
	player.x = WIDTH/2;
	player.y = (HEIGHT*1.5 - player.height)/2;
	enemies = [];
	bullets = [];
	score = 0;
}
/**
 * Update all game objects
 */
function update() {
    if (player.dead){
        if (keystate[82]) {
            player.dead = 0;
            init();
        }
        } else {
	player.update();
	updatelist(bullets);
	updatelist(enemies);
        }

}
/**
 * Clear canvas and draw all game objects and net
 */
function draw() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "rgba(0,0,0,0)";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.save();
	ctx.fillStyle = "#fff";
	player.draw();
	drawlist(bullets);
	drawlist(enemies);
	ctx.fillStyle = "blue";
	ctx.font = "25px Helvetica";
	ctx.fillText("SCORE: " + score, 10, 30);
	if (player.dead) {
	              ctx.fillStyle = "red";
                ctx.font = "35px Helvetica";
                ctx.fillText("Game Over!", WIDTH/2 - ctx.measureText("Game Over!").width/2, (HEIGHT)/1.35);
                ctx.font = "30px Helvetica";
                ctx.fillText("press 'R' to play again", WIDTH/2 - ctx.measureText("press 'R' to play again").width/2, (HEIGHT)/1.25);
                };
	ctx.restore();
}
// start and run the game
main();
