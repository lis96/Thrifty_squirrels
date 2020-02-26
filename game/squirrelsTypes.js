const squirrelsTypes = (function(){
	/*
		Различные типы белок
	*/
	class squirrelsType {
		constructor(coordsOnGrid) {
			this.coordsOnGrid = function(coords) {
				return coordsOnGrid.map(delta => {
					return [
						delta[0] + coords[0],
						delta[1] + coords[1]
					];
				});
			}
		}
	}

	return {
		line2height: new squirrelsType([[0, 0], [1, 0]]),
		line2width: new squirrelsType([[0, 0], [0, 1]]),
		topLeftCorner: new squirrelsType([[0, 1], [1, 0], [1, 1]]),
		topRightCorner: new squirrelsType([[0, 0], [1, 0], [1, 1]]),
		bottomLeftCorner: new squirrelsType([[0, 0], [0, 1], [1, 1]]),
		bottomRightCorner: new squirrelsType([[0, 0], [0, 1], [1, 0]])
	}
})();