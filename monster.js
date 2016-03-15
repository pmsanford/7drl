var Monster = function(visual) {
	Being.call(this, visual);
	this._path = null;
}
Monster.extend(Being);

Monster.prototype.act = function() {
	var passable = function(x, y) {
		var xy = new XY(x, y);
		return !Game.isBlocked(xy);
	};

	var fov = new ROT.FOV.PreciseShadowcasting(passable);

	var spotted = false;
	var player = Game.getPlayer().getXY();

	fov.compute(this._xy.x, this._xy.y, this._visRadius, function(x, y, r, vis) {
		var xy = new XY(x, y);
		if (xy.is(player)) {
			spotted = true;
		}
	});

	var dijk = new ROT.Path.Dijkstra(player.x, player.y, passable);


	var path = []
	if (spotted) {
		dijk.compute(this._xy.x, this._xy.y, function(x, y) {
			path.push(new XY(x, y));
		});

		path.pop();

		this._path = path.reverse();
		this._path.pop();

		if (this._path.length == 0) {
			console.log("Attack");
		}
	}

	if (this._path && this._path.length > 0) {
		this._level.setBeing(this, this._path.pop());
	}
};