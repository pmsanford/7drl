var Item = function(visual, name) {
	Entity.call(this, visual);
	this.name = name;
};
Item.extend(Entity);

Item.CreateSword = function() {
	return new Item({ch:"/", fg:"#fff"}, 'Sword');
}