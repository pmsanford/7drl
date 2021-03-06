var Level = function(depth) {
	/* FIXME data structure for storing entities */
	this._beings = {};

	this.depth = depth || 1;

	/* FIXME map data */
	this._size = new XY(80, 25);
	this._map = {};

	this._empty = new MapFeature({ch:" ", fg:"#fff", bg:null}, true);

	this._items = {};
	this._downStairways = [];
};

Level.generateLevel = function(depth, staircaseLocations) {
	var level = new Level(depth);

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

	level._placeUpStairways(staircaseLocations);
	level._placeDownStairways();

	level._placeMonsters();

	return level;
};

Level.prototype._placeMonsters = function() {
	var mg = new MonsterGenerator();
	var cb = (function(mg, xy) {
		var monster = mg.getRandomMonster();
		this.setBeing(monster, xy);
	}).bind(this, mg);

	this._randomlyPlace(0, 5, cb);
};

Level.prototype._placeUpStairways = function(downStairways) {
	if (!downStairways || !(downStairways instanceof Array)) {
		return;
	}
	for (var i = 0; i < downStairways.length; i++) {
		var loc = downStairways[i].getXY();
		var xy = this.findEmptySpace(loc);
		var stairway = new Stairway("up");
		stairway.linkTo(downStairways[i]);
		this.setMap(stairway, xy);
	}
};

Level.prototype._placeDownStairways = function() {
	var cb = (function(xy) {
		var stairway = new Stairway("down");
		this.setMap(stairway, xy);
		this._downStairways.push(stairway);
	}).bind(this);

	this._randomlyPlace(1, 3, cb);
};

Level.prototype._randomlyPlace = function(min, max, cb) {
	var number = ROT.RNG.getUniformInt(min, max);

	for (var i = 0; i < number; i++) {
		var xy = new XY(ROT.RNG.getUniformInt(0, this._size.x), ROT.RNG.getUniformInt(0, this._size.y));
		xy = this.findEmptySpace(xy);
		cb(xy);
	}
};

Level.prototype.getDownStairways = function() {
	return this._downStairways();
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

Level.prototype.getDownStairways = function() {
	return this._downStairways;
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

	var isempty = (function(x, y) {
		var exy = new XY(x,y);
		if (this._beings[exy]) {
			return false;
		};

		if (this._map[exy]) {
			if (this._map[exy].isEmptySpace()) {
				return true;
			}
		}
		return false;
	}).bind(this);

	if (isempty(xy.x, xy.y)) {
		return xy;
	}

	var callback = function(x, y) {
		return true;
	};

	var fov = new ROT.FOV.PreciseShadowcasting(callback);

	var radius = 1;
	var emptySpace = null;
	do {
		if (radius > this._size.x && radius > this._size.y) {
			console.log("Unable to find empty space.");
			return undefined;
		}
		fov.compute(xy.x, xy.y, radius, function(x, y, r, v) {
			if (isempty(x, y)) {
				emptySpace = new XY(x, y);
			}
		});
		if (emptySpace !== null) {
			return emptySpace;
		}
		radius++;
	} while (true);
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
