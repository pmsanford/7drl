var MapFeature = function(visual, blocking, emptySpace) {
	Entity.call(this, visual);
	if (blocking === undefined) {
		this._blocking = blocking || true;
	}
	else {
		this._blocking = blocking;
	}
	this._explored = false;
	this._emptySpace = emptySpace === true;
};

MapFeature.extend(Entity);

MapFeature.prototype.isBlocking = function() {
	return this._blocking;
}

MapFeature.prototype.getVisual = function() {
	if (this._explored) {
		return this._visual;
	} else {
		return {ch: " ", fg: "#000"};
	}
}

MapFeature.prototype.explore = function() {
	var retval = !this._explored;
	this._explored = true;
	return retval;
}

MapFeature.prototype.isEmptySpace = function() {
	return this._emptySpace;
}