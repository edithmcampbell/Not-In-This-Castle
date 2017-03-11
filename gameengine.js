window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function scoreDisplay(game) {
	game.ctx.font = "28px myfont";
	game.ctx.fillText("Score: " + game.score ,30, 70);
}
function levelDisplay(game) {
	game.ctx.font = "28px myfont";
	game.ctx.fillText("LEVEL: " + game.levelScore ,600, 70);
}

function gameOverDisplay(game) {
	game.ctx.font = "bold 72px myfont";
        txt = "GAME   OVER";
//        txt.fontcolor("white");
//        game.ctx.fillStyle("#FFFFFF");
        game.ctx.fillStyle = "white";
	game.ctx.fillText("GAME", 120, 400);//should display in precise middle of screen
        game.ctx.fillText("OVER", 445, 400);
}

function winDisplay(game) {
	game.ctx.font = "bold 72px myfont";
        game.ctx.fillStyle = "white";
	game.ctx.fillText("YOU", 190, 400);
        game.ctx.fillText("WIN!", 445, 400);
        setTimeout(function(){
////                winscreen.visible = false;
//                game.ctx.clearRect(0, 0, 700, 800);
////                bgm.play();
//                game.ctx.fillText("        ",190,400);
                game.win = false;
                game.gameOver = false;
            }, 10000);
}

function levelClearDisplay(game) {
	game.ctx.font = "bold 72px myfont";
        game.ctx.fillStyle = "white";
	game.ctx.fillText("LEVEL", 270, 250);
        game.ctx.fillText("CLEARED!", 190, 400);
        setTimeout(function(){
////                winscreen.visible = false;
//                game.ctx.clearRect(0, 0, 700, 800);
////                bgm.play();
//                game.ctx.fillText("        ",190,400);
                game.win = false;
            }, 10000);
}

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.score = null;
    this.gameOver = false;
    this.win = false;
	this.levelScore = null;
	
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
	this.score = 0;
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("keydown", function (e) {
        console.log(e)
	if (e.code === "KeyW") {
            that.w = true;                   //jumping
        }
        else if (e.code === "KeyS") {
            that.s = true;                  
        }
        else if (e.code === "KeyA") {
            that.a = true;
            that.walking = true;
            that.d = false;
        } else if (e.code === "KeyD") {
            that.d = true;
            that.walking = true;
            that.a = false;
        } else if (e.code === "Space") {
            that.throw = true;
        }
		 else if (e.code === "KeyF") {
            that.movingFireball = true;
        }
		
        console.log("Key down event - Char " + e.code + " Code " + e.keyCode);
    }, false);


    this.ctx.canvas.addEventListener("keyup", function (e) {
        console.log(e)
	if (e.code === "KeyW") {
		that.w = false; 
        }
        else if (e.code === "KeyS") that.s = false;
        else if (e.code === "KeyA") that.walking = false;
	else if (e.code === "KeyD") that.walking = false;
        else if (e.code === "Space") that.throw = false;
		else if (e.code === "KeyF") that.movingFireball = false;
		
        console.log("Key up event - Char " + e.code + " Code " + e.keyCode);
    }, false);
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
};

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var j = 1; j <= 5; j++) {
        for (var i = 0; i < this.entities.length; i++) {
//            console.log(this.entities[i].drawPriority);
            if (!this.entities[i].removeFromWorld && this.entities[i].drawPriority === j) {
                this.entities[i].draw(this.ctx);
            }
        }
    }
    levelDisplay(this);
    scoreDisplay(this);
    if (this.gameOver && !this.win) {
        gameOverDisplay(this);
    } else if (!this.gameOver && this.win) {
	levelClearDisplay(this);
    } else if (this.gameOver && this.win) {
        winDisplay(this);
    }
	
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y,width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.removeFromWorld = false;
    this.drawPriority = 1;
}

Entity.prototype.update = function () {
}


Entity.prototype.draw = function (ctx) {
    
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.lineWidth = 5;
        this.game.ctx.rect(this.x, this.y, this.width, this.height);
//        this.game.ctx.
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}