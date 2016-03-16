var Monster = function(visual) {
	Being.call(this, visual);
	this._path = null;
	this.name = "goblin";
	this._damage = 3;
}
Monster.extend(Being);

Monster.prototype.act = function() {
	var passable = function(x, y) {
		var xy = new XY(x, y);
		return !Game.isBlocked(xy);
	};

	var fov = new ROT.FOV.PreciseShadowcasting(passable);

	var spotted = false;
	var player = Game.getPlayer();
	var playerPos = player.getXY();

	fov.compute(this._xy.x, this._xy.y, this._visRadius, function(x, y, r, vis) {
		var xy = new XY(x, y);
		if (xy.is(playerPos)) {
			spotted = true;
		}
	});

	var dijk = new ROT.Path.Dijkstra(playerPos.x, playerPos.y, passable);


	var path = []
	if (spotted) {
		dijk.compute(this._xy.x, this._xy.y, function(x, y) {
			path.push(new XY(x, y));
		});

		path.pop();

		this._path = path.reverse();
		this._path.pop();

		if (this._path.length == 0) {
			Game.textBuffer.write(`The ${this.name} hits you for ${this._damage} damage!`);
			Game.textBuffer.flush();
			player.damage(this._damage);
		}
	}

	if (this._path && this._path.length > 0) {
		this._level.setBeing(this, this._path.pop());
	}
};

Monster.prototype.die = function() {
	Game.textBuffer.write(`The ${this.name} falls down dead!`);
	Game.textBuffer.flush();
	Game.kill(this);
	Being.prototype.die.call(this);
};