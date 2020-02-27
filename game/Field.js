'use strict';

class Field {
	_emptyField() {
		/*
			Задаём всем ячейкам таблицы поля нули
		*/
		for (let i = 0, len = this._height * this._width;i < len;i++) {
			this._field[i] = 0;
		}
	}

	constructor() {
		this._squirrels = [];				//массив белок
		this._islands = [];
		this._minks = [];					//массив норок
		this._height = this._width = 4;		//размеры (дефолтно 4)
		this._field = [];					//поле
		this._emptyField();
	}

	getHeight() {
		/*
			Защищённое обращение к полю height
		*/
		return this._height;
	}

	getWidth() {
		/*
			Защищённое обращение к полю width
		*/
		return this._width;
	}
	
	resolveSquirrelsSpace() {
		/*
			Производим переграссчёт таблицы поля в соответствии с положением белок на поле
		*/
		this._emptyField();
		this._islands.forEach(island => {
			const coords = island.getCoords();
			this._field[coords[0] * this._width + coords[1]] = 1;
		});
		this._squirrels.forEach(sq => {
			sq.getCoordsList().forEach(coords => {
				if (this._field[coords[0] * this._width + coords[1]]) {
					throw 'Squirrels placement in the field conflict detected';
				}
				this._field[coords[0] * this._width + coords[1]] = 1;
			});
		});
		this._minks.forEach(mink => {
			const coords = mink.getCoords();
			if (!mink.isFulled()) {
				this._field[coords[0] * this._width + coords[1]] += 2;
			}
		});
	}

	setSquirrel(sq) {
		/*
			Функция добавления белки на поле(белка не знает о том, что она добавлена)
		*/
		this._squirrels.push(sq);
		this.resolveSquirrelsSpace();
	}

	setIsland(island) {
		/*
			Функция добавления островка на поле
		*/
		this._islands.push(island);
		const islandCoords = island.getCoords();
		this._minks.forEach(mink => {
			const coords = mink.getCoords();
			if (coords[0] === islandCoords[0] && coords[1] == islandCoords[1]) {
				mink.hideNut();
			}
		});
	}

	toString() {
		let str = '';
		for (let i = 0;i < this._height;i++) {
			for (let j = 0;j < this._width;j++) {
				str += this._field[i * this._width + j] + '  ';
			}
			str += '\n';
		}

		return str;
	}

	isFree(coords) {
		/*
			Проверяет, свободна ли некоторая ячейка поля
		*/
		if (coords[0] < 0 || coords[0] >= this._height || coords[1] < 0 || coords[1] >= this._width) {
			return false;
		}
		return ((this._field[coords[0] * this._width + coords[1]] & 1) == 0);
	}

	setMink(mink) {
		/*
			Регистрируем норку на поле
		*/
		this._minks.push(mink);
	}

	tryingToHideNut(coords) {
		/*
			Попытка срятать орешек на coords в некоторую норку
		*/
		if ((this._field[coords[0] * this._width + coords[1]] & 2) == 0) return false;
		for (let key in this._minks) {
			if (this._minks[key].tryingToHideNut(coords)) {
				break;
			}
		}
		return true;
	}
}