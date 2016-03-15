var Level = function() {
	/* FIXME data structure for storing entities */
	this._beings = {};

	/* FIXME map data */
	this._size = new XY(80, 25);
	this._map = {};

	this._empty = new Entity({ch:".", fg:"#888", bg:null});

	var item = Item.CreateSword();
	var loc = new XY(10, 10);
	item.setPosition(loc, this);

	this._items = {};
	this._items[loc] = item;

	loc = new XY(15, 15);
	var wall = new MapFeature({ch:"#", fg:"#880"});
	this._map[loc] = wall;
}

Level.prototype.getSize = function() {
	return this._size;
}

Level.prototype.setEntity = function(entity, xy) {
	/* FIXME remove from old position, draw */
	if (entity.getLevel() == this) {
		var oldXY = entity.getXY();
		delete this._beings[oldXY];
		if (Game.level == this) { Game.draw(oldXY); }
	}

	entity.setPosition(xy, this); /* propagate position data to the entity itself */

	/* FIXME set new position, draw */
	this._beings[xy] = entity;
	if (Game.level == this) { 
		Game.draw(xy);
	}
}

Level.prototype.isBlocked = function(xy) {
	return this._map[xy] && this._map[xy].blocking;
}

Level.prototype.getItemAt = function(xy) {
	if (this._items[xy]) {
		var item = this._items[xy];
		delete this._items[xy];
		return item;
	}

	return null;
}

Level.prototype.getEntityAt = function(xy) {
	return this._beings[xy] || this._items[xy] || this._map[xy] || this._empty;
}

Level.prototype.getBeings = function() {
	/* FIXME list of all beings */
	return this._beings;
}
