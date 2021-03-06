const moveTypes = {
	/*
		Типы движений на поле (изменения координаты при данном движении)
	*/
	top: function(coords) {
		return [coords[0] - 1, coords[1]];
	},
	bottom: function(coords) {
		return [coords[0] + 1, coords[1]];
	},
	left: function(coords) {
		return [coords[0], coords[1] - 1];
	},
	right: function(coords) {
		return [coords[0], coords[1] + 1];
	}
}