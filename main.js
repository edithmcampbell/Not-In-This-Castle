var AM = new AssetManager();
var dir = true;
var isCollision = false;
var isDead = false;
var isFalling = true;
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
Entity.prototype.collision = function(other){
	return (this.x < other.x + other.width
 	&& this.x + this.width > other.x
 	&& this.y < other.y + other.height
 	&& this.height + this.y > other.y);
 }


// no inheritance
function Background(game, spritesheets) {
    this.spritesheet = spritesheets[0];
    this.x = 0;
    this.y = 0;
	this.width = 800;
	this.height = 800;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0, 800, 800);
}
 
 Background.prototype = new Entity();
 Background.prototype.constructor = Background;

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
	Entity.prototype.draw.call(this);
};

Background.prototype.update = function () {
};

function Block(game, spriteshets) {
    this.spritesheet = spritesheets[0];
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0, 0, 0);
};


Block.prototype = new Entity();
Block.prototype.constructor = Block;

Block.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
	Block.prototype = new Entity();
    Block.prototype.constructor = Block;
};

Block.prototype.update = function () {
	 Entity.prototype.update.call(this);
};


function Princess(game, spritesheets) {
    this.animation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.x = 300;
    this.y = 565;
	this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 125;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
    this.walking = false;
    this.jumpAnimation = new Animation(spritesheets, 48, 80, 4, 0.2, 4, true, 1.25);
    this.jumping = false;
	this.isFalling = false;
	this.ground = 565;
	Entity.call(this, game, 300, 565, this.width, this.height);
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


Princess.prototype.update = function () {
	if(isDead === false ){
		if (this.game.d) {
			this.dir = true;
		}
		else if (this.game.a) {
			this.dir = false;
		}
		if (this.x <= 0) {
			this.dir = true;
		}
		if (this.x >= 750 ) {
			this.dir = false;
		   
		}
		
		if(this.dir) {		// facing right
			if (this.game.walking) {
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
			} else if (this.game.walking) {
				this.animation.change(this.animation.spritesheets[2], 48, 80, 4, 0.2, 4, true, 1.25);	// walking right
			} else if (this.game.throw) {
				this.animation.change(this.animation.spritesheets[8], 80, 80, 3, 0.2, 3, true, 1.5);	// throwing right
			}else {
				this.animation.change(this.animation.spritesheets[0], 48, 80, 9, 0.2, 9, true, 1.25);	// standing right
			}
		} else {			// facing left
			if (this.game.walking) {
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
			} else if (this.game.throw) {
				this.animation.change(this.animation.spritesheets[9], 80, 80, 3, 0.2, 3, true, 1.5);	// throwing left
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
		
			
		for (var i = 0; i < this.game.entities.length; i++) {
			 var ent = this.game.entities[i];
			 if (ent !== this && this.collision(ent) && (ent instanceof Goomba)) {
				 console.log("COLLISION!");
				 if(ent.y - 35 != this.y){
				 isCollision = true;
				 ent.x = -1000;
				 ent.y = -1000;
				 }
				
				 else{
					 isDead = true;
					 this.x = -1000;
					 this.y = -1000;
                   
				 }
			 }
		 }
		 
		
		Entity.prototype.update.call(this);
		
	} 
 }

function Goomba(game, spritesheets) {
    this.animation = new Animation(spritesheets, 60, 72, 5, .2, 5, true, 1);
    this.x = 500;
    this.y = 600;
	this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
	Entity.call(this, game, 500, 600, this.width, this.height);
	
}
Goomba.prototype = new Entity();
Goomba.prototype.constructor = Goomba;

Goomba.prototype.draw = function () {
	if(isCollision === false){
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	    Entity.prototype.draw.call(this);
	}
}

Goomba.prototype.update = function () {
	if(isCollision === false){
		if (this.x <= 0) {
		this.dir = true;
		}
		if (this.x >= 750 ) {
		this.dir = false;
		}
		if (this.dir) {
			this.x += this.game.clockTick * this.speed;
		} else {
			this.x -= this.game.clockTick * this.speed;
		}
		Entity.prototype.update.call(this);
    }
}

//new code
function Fireball(game, spritesheets) {
    this.animation = new Animation(spritesheets, 19, 22, 3, .2, 8, true, 2);
    this.x = 300;
    this.y = 300;
	this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    this.speed = 170;
    this.game = game;
    this.ctx = game.ctx;
    //this.dir = true;
	Entity.call(this, game, 0, 300, this.width, this.height);
}
Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;
  
Fireball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	Entity.prototype.draw.call(this);
}

Fireball.prototype.update = function () {
	if(this.game.movingFireball){
		this.x += this.game.clockTick * this.speed;
		if(this.x > 800){
			this.x = 0;
		}
	}
	else{
		this.x = 0;
        this.y = 300;
	}
	Entity.prototype.update.call(this);
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

AM.downloadAll(function () {
    console.log("hello");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    backgroundSprites = [AM.getAsset("./Level1.png")];
    princessSprites = [AM.getAsset("./PeachIdleRight.png"), AM.getAsset("./PeachIdleLeft.png"), AM.getAsset("./PeachWalkRight.png"), AM.getAsset("./PeachWalkLeft.png"), AM.getAsset("./PeachCrouchRight.png"), AM.getAsset("./PeachCrouchLeft.png"), AM.getAsset("./PeachJumpRight.png"), AM.getAsset("./PeachJumpLeft.png"), AM.getAsset("./PeachThrowRight.png"), AM.getAsset("./PeachThrowLeft.png")];
    goombaSprites = [AM.getAsset("./GoombaWalk.png")];
    fireballSprites = [AM.getAsset("./Fireball.png")];

    gameEngine.addEntity(new Background(gameEngine, backgroundSprites));
    gameEngine.addEntity(new Goomba(gameEngine, goombaSprites));
    gameEngine.addEntity(new Princess(gameEngine, princessSprites));

   gameEngine.addEntity(new Fireball(gameEngine, fireballSprites));

    console.log("All Done!");
});

