'use strict';

class Squirrel {
	constructor(coords, field, type) {
		this.coords = [coords[0], coords[1]];
		this.field = field;
		if (!(type in squirrelsTypes)) {
			throw 'Wrong squirrels type founded';
		}
		this.type = type;
		this.field.setSquirrel(this);
	}
	getCoordsList() {
		return squirrelsTypes[this.type].coordsOnGrid(this.coords);
	}
	_filterSameCell(Coords, newCoords) {
		return newCoords.filter(function(el){
			for (let key in Coords) {
				if (el[0] == Coords[key][0] && el[1] == Coords[key][1]) {
					return false;
				}
			}
			return true;
		});
	}
	_getSomeCoords(transform) {
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push(transform(el));
		});
		return this._filterSameCell(this.getCoordsList(), newCoords);
	}
	getTopCoords() {
		return this._getSomeCoords(moveTypes.top);
	}
	getBottomCoords() {
		return this._getSomeCoords(moveTypes.bottom);
	}
	getLeftCoords() {
		return this._getSomeCoords(moveTypes.left);
	}
	getRightCoords() {
		return this._getSomeCoords(moveTypes.right);
	}
	_canMoveToCoords(newCoords) {
		let free = true;
		for (let key in newCoords) {
			if (!this.field.isFree(newCoords[key])) {
				free = false;
				break;
			}
		}

		return free;
	}
	canLeft() {
		return this._canMoveToCoords(this.getLeftCoords());
	}
	canRight() {
		return this._canMoveToCoords(this.getRightCoords());
	}
	canTop() {
		return this._canMoveToCoords(this.getTopCoords());
	}
	canBottom() {
		return this._canMoveToCoords(this.getBottomCoords());
	}
	_move(can, move) {
		if (can) {
			this.coords = move(this.coords);
			this.field.resolveSquirrelsSpace();
		}
	}
	top() {
		this._move(this.canTop(), moveTypes.top);
	}
	bottom() {
		this._move(this.canBottom(), moveTypes.bottom);
	}
	left() {
		this._move(this.canLeft(), moveTypes.left);
	}
	right() {
		this._move(this.canRight(), moveTypes.right);
	}
}