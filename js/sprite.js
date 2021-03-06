Sprite = function(config) {
	this.x = config.x || 0;
	this.y = config.y || 0;
	this.vx = config.vx || 0;
	this.ax = config.ax || 0;
	this.vy = config.vy || 0;
	this.ay = config.ay || 0;
	this.width = config.width || 30;
	this.height = config.height || 30;
	this.sx = config.sx || 1;
	this.sy = config.sy || 1;

	this.move = function(dt) {
		if (this.canMove()) {
			this.x = this.x + this.vx * dt;
			this.vx = this.vx + this.ax * dt;
			this.y = this.y + this.vy * dt;
			this.vy = this.vy + this.ay * dt;
		}
	}

	this.colision = function(sprite) {
		if(	this.left() > sprite.right() || this.right() < sprite.left() || 
			this.bottom() < sprite.top()  || this.top() > sprite.bottom() )
				return false;
		return true;
	}

	this.left  = function() { return this.x - this.width/2; }
	this.right = function() { return this.x + this.width/2; }
	this.bottom  = function() { return this.y + this.height/2; }
	this.top  = function() { return this.y - this.height/2; }
}

Sprite.prototype.update = function(dt, g) { throw new NullImplementationException("Sprite.update(dt, g)");  }
Sprite.prototype.canMove = function(param) {return true;}

var inherit = function (child, father) {
	child.prototype = Object.create(father.prototype);
	child.prototype.constructor = child;
}