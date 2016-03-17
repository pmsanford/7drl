var MapFeature = function(visual, blocking) {
	Entity.call(this, visual);
	if (blocking === undefined) {
		this._blocking = blocking || true;
	}
	else {
		this._blocking = blocking;
	}
	this._explored = false;
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