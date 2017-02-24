var AM = new AssetManager();
var dir = true;
//var isCollision = false;
var isDead = false;
var isFalling = true;
var gstmp = new Audio("./Stomp.wav");
bgm = new Audio("./Castle.mp3");

function Animation(spritesheets, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.change = function(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    //this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Entity.prototype.collisionY = function(other) {

	if(this.y <= other.y){
		if(this.y + this.height < other.y) return false;
		return true;
	}
	else{
		if(this.y  > other.y + other.height) return false;
		return true;
	}
}
Entity.prototype.collision = function(other){
	
	if(this.abs <= other.abs && !(this.isDead) && !(other.isDead))
	{
		if(this.abs + this.width < other.abs){
                    return false;
                }
                if (!(this instanceof Fireball)){
                    
		return this.collisionY(other);
            } else if(Math.abs((this.abs + this.width)- other.abs) < 2000){
                    return true;
                } else {
                    return false;
                }
	}
	else {
		if( this.abs > other.abs + other.width) return false;
                if (!(this instanceof Fireball)){
		return this.collisionY(other);
            } else if(Math.abs((this.abs)- other.abs + other.width) < 2000){
                    return true;
                } else {
                    return false;
                }
	}
        return false;
	/* 
	return (this.x + this.width < other.x + other.width
 	&& this.x + this.width > other.x 
 	&& this.y < other.y + other.height
 	&& this.height + this.y > other.y); */
 }


// no inheritance
function Background(game, spritesheets) {
    this.animation = new Animation(spritesheets, 2000, 320, 1, 0.4, 1, true, 2);
    this.x = 0;
    this.y = 0;
    //this.width = 1200;
    //this.height = 640;
    this.game = game;
    this.ctx = game.ctx;

}
 
 Background.prototype = new Entity();
 Background.prototype.constructor = Background;

Background.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

Background.prototype.update = function () {
};

function Block(game, spritesheets, background, x, y) {
    this.bg = background;
    this.spritesheet = spritesheets[0];
    this.origin = x;
    this.x = this.bg.x + x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y, 0, 0);
    this.isDead = false;
};


Block.prototype = new Entity();
Block.prototype.constructor = Block;

Block.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Block.prototype.update = function () {
    this.x = this.bg.x + this.origin;
};

function Cam(game, background, princess) {
    this.x = 350;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    bg = background;
    mc = princess;
}

Cam.prototype.update = function () {
    if(mc.x >= this.x && (mc.game.walking || mc.game.jump) && bg.x > bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale){
        bg.x = bg.x - mc.speed * mc.game.clockTick;
    } else if(mc.x < 0 && (mc.game.walking || mc.game.jump) && bg.x < 0){
        bg.x = bg.x + mc.speed * mc.game.clockTick;
    }
};

Cam.prototype.draw = function (){
    
};

function Princess(game, spritesheets) {
    this.animation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.x = 2;
    this.y = 565;
	this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 125;
    this.game = game;
    this.ctx = game.ctx;
    this.abs = this.x;
    this.dir = true;
    this.walking = false;
    this.jumpAnimation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.jumping = false;
	this.isFalling = false;
	this.ground = 565;
	Entity.call(this, game,this.x, this.y, this.width, this.height);
        this.isDead = false;
}
Princess.prototype = new Entity();
Princess.prototype.constructor = Princess;

Princess.prototype.draw = function () {
   if(isDead === false){
	   if (this.game.w) { 
			this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34);
	  
		}else {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
		Entity.prototype.draw.call(this);
   }	
}


Princess.prototype.update = function (gameEngine) {
	if(isDead === false ){
		if (this.game.d) {
			this.dir = true;
		}
		else if (this.game.a) {
			this.dir = false;
		}
		//if (this.x <= 0) {
		//	this.dir = true;
		//}
		//if (this.x >= 750 ) {
		//	this.dir = false;
		   
		//}
		
		if(this.dir) {		// facing right
			if (this.game.walking && ((this.x < 350) || (bg.x <= bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale && this.x < this.game.surfaceWidth - this.animation.frameWidth))) {
				this.x += this.game.clockTick * this.speed;
			}
			// moving/jumping to the right
			if (this.game.w) {
			
				var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
				var totalHeight = 200;

			if (jumpDistance > 0.5)
				jumpDistance = 1 - jumpDistance;

			//var height = jumpDistance * 2 * totalHeight;
				var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
				this.y = this.ground - height;
				if (this.y + this.height > this.ground){
					
					this.animation.elapsedTime = 0;
				}
				
				this.jumpAnimation.change(this.jumpAnimation.spritesheets[6],  56, 80, 7, 0.2, 7, true, 1.5);
          
			}
			if (this.game.s) {
				this.animation.change(this.animation.spritesheets[4], 67, 80, 3, 0.2, 3, true, 1.25); 	// crouch right
			} else if (this.game.walking && ((this.x > 0) || (bg.x <= bg.game.surfaceWidth - bg.animation.frameWidth * bg.animation.scale && this.x < this.game.surfaceWidth))) {
				this.animation.change(this.animation.spritesheets[2], 48, 80, 4, 0.2, 4, true, 1.25);	// walking right
			} else if (this.game.throw) {	// throw right
				this.animation.change(this.animation.spritesheets[8], 80, 80, 3, 0.2, 3, true, 1.5)
                if (this.animation.elapsedTime > this.animation.totalTime *23/24) {
                this.game.addEntity(new Fireball(this.game, fireballSprites, this, bg));
                this.animation.elapsedTime = 0;
            };	
			}else {
				this.animation.change(this.animation.spritesheets[0], 48, 80, 9, 0.2, 9, true, 1.25);	// standing right
			}
		} else {			// facing left
			if (this.game.walking && this.x > 0) {
			this.x -= this.game.clockTick * this.speed;		// walking/moving to the left
			}
			if (this.game.w) { // jumping left
			
				var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
				var totalHeight = 200;

			if (jumpDistance > 0.5)
				jumpDistance = 1 - jumpDistance;

			//var height = jumpDistance * 2 * totalHeight;
				var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
				this.y = this.ground - height;
				//this.jumping = false;
				this.jumpAnimation.change(this.jumpAnimation.spritesheets[7], 56, 80, 7, 0.2, 7, true, 1.5);
			
			}
			
			 if (this.game.s) {
				this.animation.change(this.animation.spritesheets[5], 67, 80, 3, 0.2, 3, true, 1.25);	// crouch left
			} else if (this.game.walking) {
				this.animation.change(this.animation.spritesheets[3], 48, 80, 4, 0.2, 4, true, 1.25);	// walking left
			} else if (this.game.throw) { // throw left
				this.animation.change(this.animation.spritesheets[9], 80, 80, 3, 0.2, 3, true, 1.5);
            if (this.animation.elapsedTime > this.animation.totalTime*(23/24)) {
                this.game.addEntity(new Fireball(this.game, fireballSprites, this, bg));
                this.animation.elapsedTime = 0;
            }
			}else {
				this.animation.change(this.animation.spritesheets[1], 48, 80, 9, 0.2, 9, true, 1.25);	// standing left
			}
		} 
		
		if (this.y < 565 && this.dir) {
			this.jumping = true;
			this.animation.change(this.jumpAnimation.spritesheets[6],  56, 80, 7, 0.2, 7, true, 1.5)
			this.y += 2; // After jump it drops.
			this.isFalling = true;
			if(this.isFalling && this.game.w){
				this.isFalling = false;
			}
		}
		else if (this.y < 565 && !this.dir) {
			this.jumping = true;
			this.animation.change(this.jumpAnimation.spritesheets[7],  56, 80, 7, 0.2, 7, true, 1.5)
			this.y += 2; // After jump it drops.
			this.isFalling = true;
			if(this.isFalling && this.game.w){
				this.isFalling = false;
			}
			
		}	
		if (!this.game.w && this.isFalling){
                    this.jumpAnimation.elapsedTime= 0;
//                    this.jumpAnimation.change(this.jumpAnimation.spritesheets[6],  56, 80, 7, 0.2, 7, true, 1.5);
//                    this.jumpAnimation.
                } else if (this.isFalling){
                    this.jumpAnimation.elapsedTime = 3;
                }
			
		for (var i = 0; i < this.game.entities.length; i++) {
			 var ent = this.game.entities[i];
//                         if (ent instanceof Goomba){
//                         console.log("Goomba " + i + ": " + ent.x)}
			 if (!(ent === this) && this.collision(ent) && (ent instanceof Goomba) && !this.isDead) {
				 console.log("COLLISION!");
				 if(ent.y - 35 !== this.y){
                                 var gstmp = new Audio("./Stomp.wav");
                                 gstmp.play();
				 ent.removeFromWorld = true;
                                 ent.isDead = true;
				 ent.x = -1000;
                                 ent.abs = ent.x;
				 ent.y = -1000;
                                 console.log(this.isDead);
				 }
				
				 else if ((ent instanceof Goomba) && !(ent.isDead)){
					 this.isDead = true;
					 this.x = -1000;
					 this.y = -1200;
                                         bgm.pause();
                                         bgm.currentTime = 0;
                                         var dead = new Audio("./death.mp3");
                                 dead.play();
//					 this.game.clockTick.freeze();
				 }
			 }
		 }
		 
		 for (var i = 0; i < this.game.entities.length; i++) {
			 var ent = this.game.entities[i];
			 if (ent !== this && this.collision(ent) && (ent instanceof Coin) && !this.isDead) {
				 console.log("COLLISION!");
				 ent.x = -1000;
				 ent.y = -1000;
				 ent.removeFromWorld = true;
				 this.game.score++;
                                 var coincollect = new Audio("./coin.wav");
                                 coincollect.play();
			 }
		 }
                
		this.onBlock = false;
                for (var i = 0; i < this.game.blocks.length; i++) {
                    //console.log(this.x + " " + this.game.blocks[i].x)
                    if (this.x + 24 >= this.game.blocks[i].x
				&& this.x  <= this.game.blocks[i].x + 64
				&& this.y >= this.game.blocks[i].y - 75
				&& this.y < this.game.blocks[i].y + 24) {
                        this.y = this.game.blocks[i].y - 75;
                        this.onBlock = true;
                        this.isFalling = false;
//			console.log("BLOCK");
                    }
                }
		if (!this.onBlock && !this.isDead) {
			console.log("FALL");
			this.y += 2;
		}
		
		Entity.prototype.update.call(this);
		
	} 
        this.abs = this.x;
 }


function Goomba(game, spritesheets, background, mul) {
    this.animation = new Animation(spritesheets, 60, 72, 5, .2, 5, true, 1);
    this.bg = background;
    this.x = this.bg.x + 100 * mul;
    this.origin = this.x;
    this.abs = this.x;
    this.y = 600;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
    this.isDead = false;
	
}
Goomba.prototype = new Entity();
Goomba.prototype.constructor = Goomba;

Goomba.prototype.draw = function () {
	if(!this.removeFromWorld){
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x+this.bg.x, this.y);
	    Entity.prototype.draw.call(this);
	}
}

Goomba.prototype.update = function () {
	if(!this.removeFromWorld){
		if (this.x <= this.bg.x + 0) {
		this.dir = true;
		}
		if (this.x >= this.bg.x + 750 ) {
		this.dir = false;
		}
		if (this.dir) {
                        
			this.x += this.game.clockTick * this.speed;
                        currX = this.x;
                        this.abs = currX + this.bg.x;
//                        this.x = this.abs;
                        
		} else {
			this.x -= (this.game.clockTick * this.speed);
                        currX = this.x;
                        this.abs = currX + this.bg.x;
//                        this.x = this.abs
		}
    } else {
        this.abs = this.x;
    }
//    console.log(this.abs);
}

//new code
function Fireball(game, spritesheets, princess, bg) {
    this.animation = new Animation(spritesheets, 19, 22, 3, .2, 8, true, 2);
    if (!princess.dir){
        this.x = princess.x;
    }else{
        this.x = princess.x + princess.animation.frameWidth;
    }   
    this.abs = this.x
    this.y = princess.y + 28;
    this.speed = 170;
    this.game = game;
    this.ctx = game.ctx;
    this.mc = princess;
    this.bg = bg;
    this.dir = this.mc.dir;
    this.movingFireball = true;
    this.isDead = false;
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;

Fireball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Fireball.prototype.update = function () {
	for (var i = 0; i < this.game.entities.length; i++) {
		var ent = this.game.entities[i];
		if (ent !== this && this.collision(ent) && (ent instanceof Goomba) && this.movingFireball && !(ent.isDead)) {
			console.log("HIT!");
			console.log(this.abs + " " + ent.abs);
			ent.removeFromWorld = true;
                        ent.abs = -1000;
                        ent.isDead = true;
			this.game.score++;
                        this.movingFireball = false;
                        var gburn = new Audio("./firehitg.wav");
                                 gburn.play();
		}
	}
	if(this.movingFireball){
            if(!this.dir){
		this.x = this.x - this.game.clockTick * this.speed;
                this.abs = this.x;
            } else {
                this.x = this.x + this.game.clockTick * this.speed;
                this.abs = this.x;
            }
            console.log(this.abs);
	}
	else{
	
        this.y = -700;
	}
};

function Coin(game, spritesheets, backgroundEnt, mul) {
	
    this.animation = new Animation(spritesheets, 32, 36, 7, .2, 7, true, 1);
    this.x = backgroundEnt.x + 150 * mul;
    this.y = 350;
    this.bg = backgroundEnt;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 170;
    this.game = game;
    this.ctx = game.ctx;
    this.abs = this.x;
	
    Entity.call(this, game, this.x,this.y, this.width, this.height);
}
Coin.prototype = new Entity();
Coin.prototype.constructor = Coin;
  
Coin.prototype.draw = function () {
	if(this.removeFromWorld != true)
	{
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x + this.bg.x, this.y);
		Entity.prototype.draw.call(this);
	}
}

Coin.prototype.update = function () {
	this.abs = this.x + this.bg.x;
	//Entity.prototype.update.call(this);
}



AM.queueDownload("./PeachWalkLeft.png");
AM.queueDownload("./PeachWalkRight.png");
AM.queueDownload("./PeachThrowLeft.png");
AM.queueDownload("./PeachThrowRight.png");
AM.queueDownload("./PeachIdleRight.png");
AM.queueDownload("./PeachIdleLeft.png");
AM.queueDownload("./PeachCrouchRight.png");
AM.queueDownload("./PeachCrouchLeft.png");
AM.queueDownload("./PeachJumpRight.png");
AM.queueDownload("./PeachJumpLeft.png");
AM.queueDownload("./Fireball.png");
AM.queueDownload("./GoombaWalk.png");
AM.queueDownload("./Level1.png");
AM.queueDownload("./Coin.png");
AM.queueDownload("./Block.png");

AM.downloadAll(function () {
    console.log("hello");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    document.getElementById('gameWorld').focus();
    gameEngine.start();
	
    backgroundSprites = [AM.getAsset("./Level1.png")];
    princessSprites = [AM.getAsset("./PeachIdleRight.png"), AM.getAsset("./PeachIdleLeft.png"), AM.getAsset("./PeachWalkRight.png"), AM.getAsset("./PeachWalkLeft.png"), AM.getAsset("./PeachCrouchRight.png"), AM.getAsset("./PeachCrouchLeft.png"), AM.getAsset("./PeachJumpRight.png"), AM.getAsset("./PeachJumpLeft.png"), AM.getAsset("./PeachThrowRight.png"), AM.getAsset("./PeachThrowLeft.png")];
    goombaSprites = [AM.getAsset("./GoombaWalk.png")];
    fireballSprites = [AM.getAsset("./Fireball.png")];
    CoinSprites = [AM.getAsset("./Coin.png")];
    blockSprites = [AM.getAsset("./Block.png")];
    
    bgm.play();
    backgroundEnt = new Background(gameEngine, backgroundSprites);
    princessEnt =  new Princess(gameEngine, princessSprites);
    gameEngine.addEntity(backgroundEnt);

    blocks = []
    for(var i = 0; i < 64; i++) {
	var blk = new Block(gameEngine, blockSprites, backgroundEnt, i*64, 640);
        gameEngine.addEntity(blk);
	blocks.push(blk);
    } 
    
    gameEngine.blocks = blocks;
    for(var i = 0; i < 3; i++){
        gameEngine.addEntity(new Goomba(gameEngine, goombaSprites, backgroundEnt, i+1));
    }
    gameEngine.addEntity(princessEnt);
    //gameEngine.addEntity(new Fireball(gameEngine, fireballSprites));

    gameEngine.addEntity(new Cam(gameEngine, backgroundEnt, princessEnt));
    for(var i = 0; i < 100; i++) {
	gameEngine.addEntity(new Coin(gameEngine,CoinSprites, backgroundEnt, i + 1));
    }
	gameEngine.showOutlines = true;
        
    console.log("All Done!");
});
