function Crosspointer(color) {
	this.radius = 80;

	this.draw = function (ctx, x, y, angle, direction, frame) {
		x += Math.cos((direction == 1 ? 180 - angle: angle)*Math.PI/180)*this.radius;
		y += Math.sin(angle*Math.PI/180)*this.radius;
		ctx.save();
		ctx.translate(x, y);
			ctx.save();
				ctx.scale(direction,1);
					library.animLib.drawNFrame("crosspointer" + color, frame);
			ctx.restore();
		ctx.restore();
	}
}

function Explosion(x, y, radius) {
	this.stm = new Animator();
	this.stm.createAnimation("explosion", "explosion", "explosion", 8, 100, 100, 0, 0, 0, 3, NO_REPEAT);

	this.draw = function (ctx, x, y, dt) {
		ctx.save();
			ctx.translate(x, y);
			ctx.save();
				ctx.scale(radius/100,radius/100);
				this.stm.draw(dt);
			ctx.restore();
		ctx.restore();
	}
}

var drawEnergyBar = function(ctx, x, y, angle, direction, energy) {
	x0 = x + Math.cos((direction == 1 ? 180 - angle: angle)*Math.PI/180)* 8;
	y0 = y + Math.sin(angle*Math.PI/180)* 8;

	x1 = x + Math.cos((direction == 1 ? 180 - angle - 10: angle + 10)*Math.PI/180)* (8 + energy);
	y1 = y + Math.sin((angle + 10)*Math.PI/180)* (8 + energy);
	
	x2 = x + Math.cos((direction == 1 ? 180 - angle + 10: angle - 10)*Math.PI/180)* (8 + energy);
	y2 = y + Math.sin((angle - 8)*Math.PI/180)* (8 + energy)
	
	ctx.fillStyle =  "rgb(" + (3 * energy) + ", 0, " + (255 - 3 * energy) + ")";
	ctx.save();
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.fill();
	ctx.restore();
}

function Bazooka (config) {
	Sprite.call(this,config);
	this.stm = new Animator();
	this.stm.createAnimation("bazooka", "bazooka", null, 32, 24, 22, 18, 17, 38, 0, NO_REPEAT);
}

Bazooka.prototype.draw = function(ctx) {
	var angle = Math.atan(this.vy/this.vx);
	var frame = Math.floor((31/Math.PI * angle - Math.PI/2));
	this.stm.drawNFrame(ctx, frame);
}

Bazooka.prototype.verifyCollision = function() {
	return true;
}

function Granade (config) {
	Sprite.call(this,config);
	this.time = config.time;
	this.stm = new Animator();
	this.stm.createAnimation("granade", "granade", null, 32, 24, 22, 18, 17, 38, 0.8, CYCLIC);
}

Granade.prototype.draw = function(ctx) {
	var angle = Math.atan(this.vy/this.vx);
	var frame = Math.floor((31/Math.PI * angle - Math.PI/2));
	this.stm.drawNFrame(ctx, frame);
}