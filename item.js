var Item = function(visual, name) {
	Entity.call(this, visual);
	this.name = name;
};
Item.extend(Entity);