var Weapon = function(visual, name, damage) {
	Item.call(this, visual, name);
	this._damage = damage;
};

Weapon.extend(Item);

Weapon.prototype.getDamage = function() {
	return this._damage;
};

Weapon.createSword = function() {
	return new Weapon({ch:"/", fg:"#fff"}, 'Sword', 5);
};