var MonsterGenerator = function() {
};

MonsterGenerator.prototype.getRandomMonster = function(level) {
	return new Monster({ch: "*", fg: "#0f0"}, 'goblin', 3);
};