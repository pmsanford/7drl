var MapFeature = function(visual, blocking) {
	Entity.call(this, visual);
	this.blocking = blocking || true;
};
MapFeature.extend(Entity);