var Being = function(visual) {
	Entity.call(this, visual);

	this._speed = 100;
	this._hp = 10;
	this._visRadius = 10;
}
Being.extend(Entity);

/**
 * Called by the Scheduler
 */
Being.prototype.getSpeed = function() {
	return this._speed;
}

Being.prototype.damage = function(damage) {
	this._hp -= damage;
	if (this._hp <= 0) { this.die(); }
}

Being.prototype.act = function() {
}

Being.prototype.die = function() {
	Game.scheduler.remove(this);
}

Being.prototype.setPosition = function(xy, level) {
	/* came to a currently active level; add self to the scheduler */
	if (level != this._level && level == Game.level) {
		Game.scheduler.add(this, true);
	}

	return Entity.prototype.setPosition.call(this, xy, level);
}

Being.prototype._computeFOV = function(callback) {
	var passable = function(x, y) {
		var xy = new XY(x, y);
		return !Game.isBlocked(xy);
	};

	var fov = new ROT.FOV.PreciseShadowcasting(passable);

	fov.compute(this._xy.x, this._xy.y, this._visRadius, callback);
}