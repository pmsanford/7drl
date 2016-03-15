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
	this.setItem(item, loc);

	loc = new XY(15, 15);
	var wall = new MapFeature({ch:"#", fg:"#880"});
	this.setMap(wall, loc);

	loc = new XY(2, 2);
	var mon = new Monster({ch:"*", fg:"#070"});
	this.setBeing(mon, loc);
}

Level.prototype.getSize = function() {
	return this._size;
}

Level.prototype.setBeing = function(entity, xy) {
	this._setEntity(entity, xy, this._beings);
}

Level.prototype._setEntity = function(entity, xy, list) {
	/* FIXME remove from old position, draw */
	if (entity.getLevel() == this) {
		var oldXY = entity.getXY();
		delete list[oldXY];
		if (Game.level == this) { Game.draw(oldXY); }
	}

	entity.setPosition(xy, this); /* propagate position data to the entity itself */

	/* FIXME set new position, draw */
	list[xy] = entity;
	if (Game.level == this) { 
		Game.draw(xy);
	}
}

Level.prototype.setItem = function(entity, xy) {
	this._setEntity(entity, xy, this._items);
}

Level.prototype.setMap = function(entity, xy) {
	this._setEntity(entity, xy, this._map);
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
