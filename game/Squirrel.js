'use strict';

class Squirrel {
	constructor(coords, field, type, nut) {
		this.coords = [coords[0], coords[1]];	//координаты белки на поле
		this.field = field;						//поле
		if (!(type in squirrelsTypes)) {
			/*
				Для белки не определённого типа порождаем исключение
			*/
			throw 'Wrong squirrels type founded';
		}
		this.type = type;						//тип белки
		this.field.setSquirrel(this);			//вызываем функцию учёта белки на поле
		
		//проверяем белкин орешек на корректность
		if (!((coordsLst) => {
			let isInLst = false;
			for (let key in coordsLst) {
				if (coordsLst[key][0] === nut[0] && coordsLst[key][1] === nut[1]) {
					isInLst = true;
					break;
				}
			}
			return isInLst;
		})(squirrelsTypes[type].coordsOnGrid([0, 0]))) {
			throw 'The nut in squirrel is outside of squirrel blocks';
		}
		this._nut = [nut[0], nut[1]];	//сохраняем орешек		
		this.haveNut = true;			//логическая переменная, фиксирующая наличие у белки орешка
		this.wrappers = [];				//список обёртывающих
	}
	setWrapper(wrapper) {
		/*
			Регистрируем обёртывающую
		*/
		this.wrappers.push(wrapper);
	}
	getNut() {
		/*
			Защищённый доступ к орешку
		*/
		return [this._nut[0], this._nut[1]];
	}
	getNutCoords() {
		/*
			Защищённый доступ к координатам орешка белки
		*/
		return [this._nut[0] + this.coords[0], this._nut[1] + this.coords[1]];
	}
	tryingToHideNut() {
		/*
			Попытка спрятать орешек
		*/
		if (!this.haveNut) return false;
		if (!this.field.tryingToHideNut(this.getNutCoords())) return false;
		this.wrappers.forEach(wrapper => {
			wrapper.hideNut();
		});
		return true;
	}
	getCoordsList() {
		/*
			Координаты на поле, которые занимает белка
		*/
		return squirrelsTypes[this.type].coordsOnGrid(this.coords);
	}
	_filterSameCell(Coords, newCoords) {
		/*
			Удаляем из Coords все newCoords, с теми же координатами
		*/
		return newCoords.filter(el => {
			for (let key in Coords) {
				if (el[0] == Coords[key][0] && el[1] == Coords[key][1]) {
					return false;
				}
			}
			return true;
		});
	}
	_getSomeCoords(transform) {
		/*
			Возвращаем список координат, которые белка будет занимать при трансформации,
			из тех, которые не занимает сейчас
		*/
		let newCoords = [];
		this.getCoordsList().forEach(function(el){
			newCoords.push(transform(el));
		});
		return this._filterSameCell(this.getCoordsList(), newCoords);
	}

	//возвращаем _getSomeCoords для конкретного типа трансофрмаций
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
		/*
			Функция возвращает, может ли произойти некоторый тип движения белки
		*/
		let free = true;
		for (let key in newCoords) {
			if (!this.field.isFree(newCoords[key])) {
				free = false;
				break;
			}
		}

		return free;
	}

	//_canMoveToCoords для конкретного типа движения
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

	/*
		Производим (если возможно) движение белки
	*/
	_move(can, move, callback) {
		if (can) {
			this.coords = move(this.coords);
			this.tryingToHideNut();
			this.field.resolveSquirrelsSpace();
		}
		if (typeof callback !== 'undefined') {
			callback();
		}
	}

	//Провизводим конкретное движение белки (если оно допустимо)
	top(callback) {
		this._move(this.canTop(), moveTypes.top, callback);
	}
	bottom(callback) {
		this._move(this.canBottom(), moveTypes.bottom, callback);
	}
	left(callback) {
		this._move(this.canLeft(), moveTypes.left, callback);
	}
	right(callback) {
		this._move(this.canRight(), moveTypes.right, callback);
	}
}