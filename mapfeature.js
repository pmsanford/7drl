var MapFeature = function(visual, blocking) {
	Entity.call(this, visual);
	if (blocking === undefined) {
		this._blocking = blocking || true;
	}
	else {
		this._blocking = blocking;
	}
};
MapFeature.extend(Entity);

MapFeature.prototype.isBlocking = function() {
	return this._blocking;
}