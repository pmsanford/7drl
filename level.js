var Level = function() {
	/* FIXME data structure for storing entities */
	this._beings = {};

	/* FIXME map data */
	this._size = new XY(80, 25);
	this._map = {};

	this._empty = new MapFeature({ch:" ", fg:"#fff", bg:null}, true);

	this._items = {};
};

Level.generateLevel = function() {
	var level = new Level();

	var callback = function(x, y, what) {
		var xy = new XY(x, y);
		if (what === 0) {
			var floor = new MapFeature({ch: ".", fg: "#888"}, false, true);
			level.setMap(floor, xy);
		}
	}

	var doorCallback = function(x, y) {
		var xy = new XY(x, y);
		var door = new Door({ch: "+", "fg": "#f70"});
		level.setMap(door, xy);
	}

	var map = new ROT.Map.Digger(level._size.x, level._size.y);

	map.create(callback);

	level._createWalls();

	var rooms = map.getRooms();
	for (var i = 0; i < rooms.length; i++) {
		rooms[i].getDoors(doorCallback);
	}

	return level;
};

Level.prototype._createWalls = function() {
	var keys = Object.keys(this._map);
	for (var i = 0; i < keys.length; i++) {
		for (var j = -1; j < 2; j++) {
			for (var k = -1; k < 2; k++) {
				var floc = this._map[keys[i]].getXY();
				var xy = new XY(floc.x + j, floc.y + k);
				if (this._map[xy]) {
					continue;
				}
				this.setMap(new MapFeature({ch: "#", "fg": "#660"}, true), xy);
			}
		}
	}
};

Level.prototype.getSize = function() {
	return this._size;
};

Level.prototype.removeBeing = function(being) {
	var xy = being.getXY();
	if (this._beings[xy] == being) {
		delete this._beings[xy];
		if (Game.level == this) { Game.draw(xy); }
	}
};

Level.prototype.setBeing = function(entity, xy) {
	this._setEntity(entity, xy, this._beings);
};

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
};

Level.prototype.findEmptySpace = function(startAt) {
	if (startAt === undefined) {
		startAt = new XY(this._size.x/2, this._size.y/2);
	}

	var xy = startAt;

	var state = 0;

	while (this._beings[xy] || this._map[xy] == undefined || (this._map[xy] && !this._map[xy].isEmptySpace())) {
		var loc = state % 8;
		switch (loc) {
			case 0:
			case 6:
			case 7:
				xy.x -= 1;
				break;
			case 1:
				xy.y -= 1;
			case 2:
			case 3:
				xy.x += 1;
				break;
			case 4:
			case 5:
				xy.y += 1;
				break;
		}
		state++;
		if (state > 1000) {
			if (console && console.log) {
				console.log('Runaway attempt to find empty space.');
			}
			return undefined;
		}
	}
	return xy;
};

Level.prototype.setItem = function(entity, xy) {
	this._setEntity(entity, xy, this._items);
};

Level.prototype.setMap = function(entity, xy) {
	this._setEntity(entity, xy, this._map);
};

Level.prototype.isBlocked = function(xy) {
	return this._map[xy] === undefined || this._map[xy].isBlocking();
};

Level.prototype.getBeingAt = function(xy) {
	return this._beings[xy];
};

Level.prototype.getItemAt = function(xy) {
	if (this._items[xy]) {
		var item = this._items[xy];
		delete this._items[xy];
		return item;
	}

	return null;
};

Level.prototype.getMapFeatureAt = function(xy) {
	return this._map[xy];
}

Level.prototype.getEntityAt = function(xy, visible) {
	if (visible && this._beings[xy]) {
		return this._beings[xy];
	} else {
		return this._items[xy] || this._map[xy] || this._empty;
	}
};

Level.prototype.getBeings = function() {
	/* FIXME list of all beings */
	return this._beings;
};
